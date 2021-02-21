import type TelegrafContext from "telegraf/typings/context";
import type { Readable } from "stream";

import { ERRORS } from "./constant";

export const handleError = (
	message: string,
	reason = "",
	context = "",
	reply?: TelegrafContext["reply"]
) => {
	const date = new Date();
	console.error(`${date.toString()} [${context}]: ${message} : ${reason}`);
	if (!reply) return;
	if (message.includes("Request failed")) return reply(ERRORS.INVALID_LINK);
	void reply(message);
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

export class CustomError extends Error {
	reason?: string;
	reply?: TelegrafContext["reply"];
	context?: string;
	constructor(message: string, reason?: string, context?: string) {
		super(message);
		this.reason = reason;
		this.context = context;
	}
}

type ReturnValue<T> = T extends "message"
	? string
	: T extends "id"
	? number
	: undefined;

export const getFromContext = <T extends "message" | "id">(
	what: T,
	ctx: TelegrafContext
): ReturnValue<T> => {
	if (what === "id" && ctx?.from?.id) return ctx.from.id as ReturnValue<T>;
	if (what === "message" && ctx.message && "text" in ctx.message)
		return ctx.message.text as ReturnValue<T>;
	throw new CustomError(
		ERRORS.INVALID_LINK,
		"message property doesn't exist in Context",
		"getFromContext"
	);
};
