import axios from "axios";
import { Readable } from "stream";
import Telegraf from "telegraf";

import { BOT_TOKEN } from "./config";
import { download } from "./download";
import { parseURL } from "./utils";

const bot = new Telegraf(BOT_TOKEN);

const linkRegex = /^((https\:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;

bot.on("message", async ctx => {
	try {
		const link = parseURL(linkRegex, ctx?.message?.text ?? "");
		const video = await download(axios, link);
		if (typeof video === "string") {
			const m = await ctx.reply("Please wait...");
			await ctx.replyWithVideo(video, {
				reply_to_message_id: ctx.message?.message_id
			});
			return ctx.telegram.deleteMessage(m.chat.id, m.message_id);
		}
		if (video instanceof Readable) {
			const m = await ctx.reply("Please wait...");
			await ctx.replyWithVideo({
				source: video
			});
			return ctx.telegram.deleteMessage(m.chat.id, m.message_id);
		}
		return ctx.reply("This post couldn't be processed!");
	} catch (error) {
		if (error.message.includes("Invalid URL")) ctx.reply("Invalid URL");
	}
});

bot.catch((error: Error) => console.error(error));

bot.launch().then(() => console.log("Bot started..."));
