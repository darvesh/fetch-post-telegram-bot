import type { TelegrafContext } from "telegraf/typings/context";

import axios from "axios";
import { Readable } from "stream";

import { Reddit } from "../types";
import { downloadVideo } from "../ffmpeg";
import { ERRORS, REDDIT_REGEX_ONE, REDDIT_REGEX_TWO } from "../constant";

const resolveURL = (url: string) =>
	axios.get(url).then(res => res.request?.res?.responseUrl as string);

export const redditHandler = async (ctx: TelegrafContext) => {
	const link = ctx.message?.text;
	if (!link) throw new Error(ERRORS.INVALID_LINK);

	const rawLink = link.match(REDDIT_REGEX_ONE)
		? await resolveURL(link)
		: link.match(REDDIT_REGEX_TWO)
		? link
		: "";

	if (!rawLink) throw new Error(ERRORS.INVALID_LINK);

	const ogLink = rawLink.endsWith("/")
		? rawLink + ".json"
		: rawLink + "/.json";

	const res = await axios.get(ogLink);
	const reddit = res?.data?.[0]?.data?.children?.[0]?.data as Reddit;

	if (!reddit) throw new Error(ERRORS.INVALID_LINK);

	const { title } = reddit;

	if (reddit.is_video) {

		if (!reddit.media?.reddit_video.fallback_url)
			throw new Error(ERRORS.INVALID_POST);

		const media = await downloadVideo(
			reddit.media?.reddit_video.fallback_url
		);

		if (typeof media === "string")
			return ctx.replyWithVideo(media, { caption: title });

		if (media instanceof Readable)
			return ctx.replyWithVideo({ source: media }, { caption: title });
			
		throw new Error(ERRORS.INVALID_POST);
	}

	if (reddit.url.match(/\.(jpg|jpeg|png)/))
		return ctx.replyWithPhoto(reddit.url, { caption: title });

	if (reddit.url.match(/gfycat|\.gif/)) {

		if (!reddit.preview?.reddit_video_preview.fallback_url)
			throw new Error(ERRORS.INVALID_POST);

		return ctx.replyWithVideo(
			reddit.preview?.reddit_video_preview.fallback_url,
			{ caption: title }
		);
	}
	throw new Error(ERRORS.INVALID_POST);
};
