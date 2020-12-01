import type { TelegrafContext } from "telegraf/typings/context";

import Telegraf from "telegraf";

import { handleError } from "./utils";
import { redditHandler } from "./handler/reddit";
import { BOT_TOKEN, BOT_API_URL } from "./config";
import { instagramHandler } from "./handler/instagram";
import { ERRORS, INSTAGRAM_REGEX, REDDIT_REGEX } from "./constant";

const bot = new Telegraf(BOT_TOKEN, {
	telegram: { apiRoot: BOT_API_URL }
});

bot.on("message", async (ctx: TelegrafContext) => {
	const link = ctx.message?.text;
	if (!link) throw new Error(ERRORS.INVALID_POST);

	if (link.match(INSTAGRAM_REGEX)) return instagramHandler(ctx, link);

	if (link.match(REDDIT_REGEX)) return redditHandler(ctx);
});

bot.catch((error: Error) => handleError(error.message));

bot.launch().then(() => console.log("Bot started..."));
