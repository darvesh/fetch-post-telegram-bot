import axios from "axios";
import { spawn } from "child_process";
import { headers } from "./constant";

const checkLink = async (url: string) => {
	try {
		await axios.get(url);
		return true;
	} catch (error) {
		return false;
	}
};

export const downloadVideo = async (url: string) => {
	const audio = url.split("/DASH")?.[0];
	if (!audio) return url;
	const audioLink = `${audio}/DASH_audio.mp4?source=fallback`;
	const hasAudio = await checkLink(audioLink);
	if (!hasAudio) return url;
	const input = [
		"-headers",
		headers,
		"-i",
		url,
		"-headers",
		headers,
		"-i",
		audioLink,
		"-c",
		"copy",
		"-map",
		"'0:v:0'",
		"-map",
		"'1:a:0'",
		"-f",
		"mpegts",
		"-"
	];
	const child =
		process.platform === "win32"
			? spawn("ffmpeg", input)
			: spawn("/bin/sh", ["-c", ["ffmpeg", ...input].join(" ")]);
	child.stdin.end();
	return child.stdout;
};
