import type { Media, reddit } from "./types";

import {
	ERRORS,
	gifRegex,
	imageRegex,
	imgurRegex,
	placeholder
} from "./constant";
import { throwErr } from "./utils";

const constructImgurURL = (url: string) => {
	const link = url.match(imgurRegex)?.[1];
	if (link) return `https://imgur.com/download/${link}`;
	throw new Error(ERRORS.INVALID_POST);
};

export const findMedia = (data: reddit): Media => {
	const { domain, url, title = "" } = data;
	if (data.is_video && domain.includes("v.redd.it"))
		return {
			from: "reddit",
			type: "video",
			url: data.media?.reddit_video.fallback_url ?? placeholder,
			title
		};
	if (domain.includes("i.redd.it")) {
		if (url.match(gifRegex))
			return {
				from: "reddit",
				type: "gif",
				url,
				title
			};
		if (url.match(imageRegex))
			return {
				from: "reddit",
				type: "image",
				url,
				title
			};
		throwErr();
	}
	if (domain.includes("imgur")) {
		if (url.match(gifRegex))
			return {
				from: "imgur",
				type: "video",
				url:
					data.preview?.reddit_video_preview.fallback_url ??
					placeholder,
				title
			};
		if (url.match(imageRegex))
			return {
				from: "imgur",
				type: "image",
				url: constructImgurURL(data.url),
				title
			};
		throwErr();
	}
	if (domain.includes("gfycat"))
		return {
			from: "gfycat",
			type: "video",
			url: data.preview?.reddit_video_preview.fallback_url ?? placeholder,
			title
		};
	throw new Error(ERRORS.INVALID_POST); //calling throwErr will return undefined and cause TS type error
};
