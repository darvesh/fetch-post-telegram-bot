import axios from "axios";
// import { Readable } from "stream";
import Telegraf from "telegraf";

import { BOT_TOKEN } from "./config";
import { findMedia } from "./helpers";
import { download } from "./download";
import { parseURL } from "./utils";
import { linkRegex } from "./constant";

const bot = new Telegraf(BOT_TOKEN);

bot.on("message", async ctx => {
	const m = await ctx.reply("Please wait...");
	try {
		const link = parseURL(linkRegex, ctx?.message?.text ?? "");
		const json = await download(axios, link);
		const media = findMedia(json);
		if (media.type === "image")
			return ctx
				.replyWithPhoto(media.url, {
					caption: media.title
				})
				.then(() =>
					ctx.telegram.deleteMessage(m.chat.id, m.message_id)
				);
		if (media.type === "gif")
			return ctx
				.replyWithVideo(media.url, {
					caption: media.title
				})
				.then(() =>
					ctx.telegram.deleteMessage(m.chat.id, m.message_id)
				);
		if (media.type === "video")
			return ctx
				.replyWithVideo(media.url, {
					caption: media.title
				})
				.then(() =>
					ctx.telegram.deleteMessage(m.chat.id, m.message_id)
				);
		return ctx.reply("This post couldn't be processed!");
	} catch (error) {
		ctx.telegram
			.deleteMessage(m.chat.id, m.message_id)
			.then(() => ctx.reply(error.message));
	}
});

bot.catch((error: Error) => console.error(error));

bot.launch().then(() => console.log("Bot started..."));


// if (video instanceof Readable) {
// 	const m = await ctx.reply("Please wait...");
// 	await ctx.replyWithVideo({
// 		source: video
// 	});
// 	return ctx.telegram.deleteMessage(m.chat.id, m.message_id);
// }