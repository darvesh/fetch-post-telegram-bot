import type TelegrafContext from "telegraf/typings/context";

import { ERRORS } from "../constant";
import { CustomError, getFromContext, handleError } from "../utils";
import { fetchInstagramFiles } from "../helpers/instagram";

export const instagramHandler = async (ctx: TelegrafContext) => {
	const message = await ctx.reply("Please wait until I fetch the file", {
		reply_to_message_id: ctx.message?.message_id
	});
	try {
		const url = getFromContext("message", ctx);
		const nodes = await fetchInstagramFiles(url);
		if (nodes.files.length) {
			nodes.files[0].caption = nodes.caption;
			return ctx.replyWithMediaGroup(nodes.files, {
				reply_to_message_id: ctx.message?.message_id
			});
		}
		throw new CustomError(
			ERRORS.NO_MEDIA,
			"Files empty",
			"instagramHandler"
		);
	} catch (error) {
		void handleError(
			error.message,
			error?.context,
			"instagramHandler",
			ctx.reply.bind(ctx)
		);
	} finally {
		void ctx.deleteMessage(message.message_id);
	}
};
