import type TelegrafContext from "telegraf/typings/context";

import axios from "axios";
import { Readable } from "stream";

import { Reddit } from "../types";
import { CustomError, getFromContext } from "../utils";
import { downloadVideo } from "../ffmpeg";
import { ERRORS, REDDIT_REGEX_ONE, REDDIT_REGEX_TWO } from "../constant";

const resolveLink = async (url: string): Promise<string | undefined> => {
	if (url.match(REDDIT_REGEX_ONE)) {
		//resolving redd.it link to reddit.com link
		return axios
			.get(url, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0"
				}
			})
			.then(res => res.request?.res?.responseUrl as string | undefined);
	}
	return REDDIT_REGEX_TWO.exec(url)?.[0];
};

export const redditHandler = async (ctx: TelegrafContext) => {
	const link = getFromContext("message", ctx);
	if (!link)
		throw new CustomError(
			ERRORS.INVALID_LINK,
			"message property doesn't exist in context",
			"redditHandler"
		);

	const rawLink = await resolveLink(link);
	if (!rawLink)
		throw new CustomError(
			ERRORS.INVALID_LINK,
			"link couldn't be resolved",
			"redditHandler"
		);

	const ogLink = rawLink.endsWith("/")
		? rawLink + ".json"
		: rawLink + "/.json";

	const res = await axios.get(ogLink);
	const reddit = res?.data?.[0]?.data?.children?.[0]?.data as Reddit;

	if (!reddit)
		throw new CustomError(
			ERRORS.INVALID_LINK,
			"JSON recieved from Reddit is invalid",
			"redditHandler"
		);

	const { title } = reddit;

	if (reddit.is_video) {
		if (!reddit.media?.reddit_video.fallback_url)
			throw new CustomError(
				ERRORS.INVALID_POST,
				"video_fallback URL couldn't be found even though is_video is true",
				"redditHandler"
			);

		const media = await downloadVideo(
			reddit.media?.reddit_video.fallback_url
		);
		if (typeof media === "string")
			return ctx.replyWithVideo(media, { caption: title });
		if (media instanceof Readable)
			return ctx.replyWithVideo({ source: media }, { caption: title });

		throw new CustomError(
			ERRORS.INVALID_POST,
			"is_video is true but media is neither string or stream",
			"redditHandler"
		);
	}

	if (reddit.url.match(/\.(jpg|jpeg|png)/))
		return ctx.replyWithPhoto(reddit.url, { caption: title });

	if (reddit.url.match(/gfycat|\.gif/)) {
		if (!reddit.preview?.reddit_video_preview.fallback_url)
			throw new CustomError(
				ERRORS.INVALID_POST,
				"gif fallback_url couldn't be found",
				"redditHandler"
			);

		return ctx.replyWithVideo(
			reddit.preview?.reddit_video_preview.fallback_url,
			{ caption: title }
		);
	}
	throw new CustomError(
		ERRORS.UNKNOWN,
		"The bot cound't find video, photo nor gif from the link",
		"redditHandler"
	);
};
