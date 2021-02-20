import type TelegrafContext from "telegraf/typings/context";

import { MASTER_ID } from "../config";
import { getFromContext } from "../utils";
import { userExists } from "../store/store";
import { INSTAGRAM_REGEX, REDDIT_REGEX } from "../constant";

export const whiteListMiddleware = async (
	ctx: TelegrafContext,
	next: () => Promise<void>
) => {
	const id = getFromContext<"id">("id", ctx);
	const message = getFromContext<"message">("message", ctx);
	const whitelisted = id ? await userExists(id) : undefined;
	if (whitelisted || id === MASTER_ID) return await next();
	if ([REDDIT_REGEX, INSTAGRAM_REGEX].some(reg => reg.exec(message)))
		return ctx.reply("You are not whitelisted! :)");
};
