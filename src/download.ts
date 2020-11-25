import type { Readable } from "stream";
import type { AxiosStatic } from "axios";

import { spawn } from "child_process";

import { checkURLStatus } from "./utils";
import { ERRORS, headers } from "./constant";
import { reddit } from "./types";

type Media = {
	type: "GIF" | "Video";
	URL: string;
};

export const download = async (
	axios: AxiosStatic,
	url: string
): Promise<reddit> => {
	const res = await axios.get(`${url}.json`, {
		headers
	});
	const data = res?.data?.[0]?.data?.children?.[0]?.data;
	if (data) return data as reddit;
	throw new Error(ERRORS.INVALID_POST);
};


	// const isGIF = data?.url.endsWith(".gif");
	// if (isGIF) return { type: "GIF", url: data?.url };

	// const isVideo = data?.is_video ?? false;
	// if (!isVideo) {
	// 	throw new Error("Post doesn't contain a video!");
	// }
	// const videoLink = data?.media?.reddit_video?.fallback_url as string;
	// const audioLink = `${data?.url}/DASH_audio.mp4?source=fallback`;
	// const hasAudio = await checkURLStatus(axios, audioLink);
	// console.log({ hasAudio });
	// if (!hasAudio) return videoLink.replace("?source=fallback", "");
	// const header = [
	// 	"-headers",
	// 	`"User-Agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0'"`
	// ];
	// const input = [
	// 	...header,
	// 	"-i",
	// 	`"${videoLink}"`,
	// 	...header,
	// 	"-i",
	// 	`"${audioLink}"`,
	// 	"-c:v",
	// 	"copy",
	// 	"-c:a",
	// 	"aac",
	// 	"-"
	// ];
	// console.log(["ffmpeg", ...input].join(" "));
	// const child =
	// 	process.platform == "win32"
	// 		? spawn("ffmpeg", [...input])
	// 		: spawn("/bin/bash", ["-c", ["ffmpeg", ...input].join(" ")]);
	// //TODO handle error
	// child.stdin.end();
	// return child.stdout;