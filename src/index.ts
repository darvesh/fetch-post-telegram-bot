import { Telegraf } from "telegraf";

import { redditHandler } from "./handler/reddit";
import { BOT_TOKEN, BOT_API_URL } from "./config";
import { CustomError, handleError } from "./utils";
import { instagramHandler } from "./handler/instagram";
import { whiteListMiddleware } from "./helpers/whitelist";
import { INSTAGRAM_REGEX, REDDIT_REGEX } from "./constant";
import {
	addUserHandler,
	removeUserHandler,
	listUsersHandler
} from "./handler/whitelist";

const bot = new Telegraf(BOT_TOKEN, {
	telegram: { apiRoot: BOT_API_URL }
});

bot.use(whiteListMiddleware);

bot.hears(/^\/(add|remove)\s\d{8,10}\s@\w+$/, addUserHandler);

bot.hears(/^\/rm_\d{8,10}$/, removeUserHandler);

bot.hears("/list", listUsersHandler);

bot.hears(REDDIT_REGEX, async ctx =>
	redditHandler(ctx).catch(error =>
		handleError(
			error.message,
			error?.reason,
			error.context,
			ctx.reply.bind(ctx)
		)
	)
);

bot.hears(INSTAGRAM_REGEX, async ctx =>
	instagramHandler(ctx).catch(error =>
		handleError(
			error.message,
			error?.reason,
			error.context,
			ctx.reply.bind(ctx)
		)
	)
);

bot.catch(error => {
	if (error instanceof CustomError)
		void handleError(
			error.message,
			error?.reason,
			error?.context ?? "botErrorHandler"
		);
	else console.error(error);
});

void bot.launch().then(() => console.log("Bot started..."));
