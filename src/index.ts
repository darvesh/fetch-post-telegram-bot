import type { TelegrafContext } from "telegraf/typings/context";

import Telegraf from "telegraf";

import { handleError } from "./utils";
import { BOT_TOKEN } from "./config";
import { instagramHandler } from "./handler/instagram";
import { ERRORS, INSTAGRAM_REGEX, REDDIT_REGEX } from "./constant";
import { redditHandler } from "./handler/reddit";

const bot = new Telegraf(BOT_TOKEN);

bot.on("message", async (ctx: TelegrafContext) => {
	const link = ctx.message?.text;
	if (!link) throw new Error(ERRORS.INVALID_POST);

	if (link.match(INSTAGRAM_REGEX)) return instagramHandler(ctx, link);

});

bot.catch((error: Error) => handleError(error.message));

bot.launch().then(() => console.log("Bot started..."));
