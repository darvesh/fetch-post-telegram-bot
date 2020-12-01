import type { AxiosStatic } from "axios";
import type { TelegrafContext } from "telegraf/typings/context";
import type { Readable } from "stream";

import { ERRORS, headers } from "./constant";

export const handleError = (
	message: string,
	reply?: TelegrafContext["reply"]
) => {
	const date = new Date();
	console.error(`${date.toString()} : ${message}`);
	if (!reply) return;
	if (message.includes("Request failed")) return reply(ERRORS.INVALID_LINK);
	reply(ERRORS.INVALID_POST);
};

export const readStream = (stream: Readable): Promise<Buffer> => {
	const buffer: Uint8Array[] = [];
	return new Promise((resolve, reject) => {
		stream
			.on("error", reject)
			.on("data", chunk => buffer.push(chunk))
			.on("end", () => resolve(Buffer.concat(buffer)));
	});
};
