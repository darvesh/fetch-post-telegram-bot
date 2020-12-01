import type { TelegrafContext } from "telegraf/typings/context";

import { instagram } from "../helpers/instagram";
import { handleError } from "../utils";

export const instagramHandler = async (ctx: TelegrafContext, url: string) => {
	const message = await ctx.reply("Please wait until I fetch the file", {
		reply_to_message_id: ctx.message?.message_id
	});
	try {
		const media = await instagram(url);
		if (media.type === "video")
			return ctx.replyWithVideo(media.url, {
				reply_to_message_id: ctx.message?.message_id
			});
		if (media.type === "image")
			return ctx.replyWithPhoto(media.url, {
				reply_to_message_id: ctx.message?.message_id
			});
	} catch (error) {
		handleError(error.message, ctx.reply);
	} finally {
		ctx.deleteMessage(message.message_id);
	}
};
