import type TelegrafContext from "telegraf/typings/context";

import axios from "axios";
import { Readable } from "stream";

import { Reddit } from "../types";
import { CustomError } from "../utils";
import { downloadVideo } from "../ffmpeg";
import { ERRORS, REDDIT_REGEX_ONE, REDDIT_REGEX_TWO } from "../constant";

const resolveLink = async (url: string): Promise<string | undefined> => {
	if (url.match(REDDIT_REGEX_ONE))
		//resolving redd.it link to reddit.com link
		return axios
			.get(url)
			.then(res => res.request?.res?.responseUrl as string | undefined);
	return REDDIT_REGEX_TWO.exec(url)?.[0];
};

export const redditHandler = async (ctx: TelegrafContext) => {
	if (!ctx.message) return;
	if (!("text" in ctx.message)) {
		throw new CustomError(ERRORS.INVALID_POST, "redditHandler: A");
	}
	const link = ctx.message?.text;
	if (!link) throw new CustomError(ERRORS.INVALID_LINK, "redditHandler: B");

	const rawLink = await resolveLink(link);
	if (!rawLink)
		throw new CustomError(ERRORS.INVALID_LINK, "redditHandler: C");

	const ogLink = rawLink.endsWith("/")
		? rawLink + ".json"
		: rawLink + "/.json";

	const res = await axios.get(ogLink);
	const reddit = res?.data?.[0]?.data?.children?.[0]?.data as Reddit;

	if (!reddit) throw new CustomError(ERRORS.INVALID_LINK, "redditHandler: D");

	const { title } = reddit;

	if (reddit.is_video) {
		if (!reddit.media?.reddit_video.fallback_url)
			throw new CustomError(ERRORS.INVALID_POST, "redditHandler: E");

		const media = await downloadVideo(
			reddit.media?.reddit_video.fallback_url
		);

		if (typeof media === "string")
			return ctx.replyWithVideo(media, { caption: title });

		if (media instanceof Readable)
			return ctx.replyWithVideo({ source: media }, { caption: title });

		throw new CustomError(ERRORS.INVALID_POST, "redditHandler: F");
	}

	if (reddit.url.match(/\.(jpg|jpeg|png)/))
		return ctx.replyWithPhoto(reddit.url, { caption: title });

	if (reddit.url.match(/gfycat|\.gif/)) {
		if (!reddit.preview?.reddit_video_preview.fallback_url)
			throw new CustomError(ERRORS.INVALID_POST);

		return ctx.replyWithVideo(
			reddit.preview?.reddit_video_preview.fallback_url,
			{ caption: title }
		);
	}
	throw new CustomError(ERRORS.UNKNOWN, "redditHandler: G");
};
