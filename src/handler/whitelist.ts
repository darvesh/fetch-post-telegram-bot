import type TelegrafContext from "telegraf/typings/context";

import { MASTER_ID } from "../config";
import { addUser, listUsers, removeUser } from "../store/store";
import { getFromContext } from "../utils";

export const addUserHandler = async (ctx: TelegrafContext) => {
	const id = getFromContext("id", ctx);
	const message = getFromContext("message", ctx);

	if (id && id === MASTER_ID) {
		const user: RegExpMatchArray | null = message.match(
			/(\d{8,9})\s(@\w+$)/
		);
		if (!user || (user && !user?.[1] && !user?.[2]))
			return ctx.reply("Invalid format");
		if (message.includes("add"))
			await addUser({ id: Number(user[1]), name: user[2] }, ctx);
		if (message.includes("remove")) await removeUser(id, ctx);
	}
};

export const removeUserHandler = async (ctx: TelegrafContext) => {
	const id = getFromContext("id", ctx);
	const message = getFromContext("message", ctx);
	if (id && id === MASTER_ID) {
		const userId = Number(message.split("_")[1]);
		await removeUser(userId, ctx);
	}
};

export const listUsersHandler = async (ctx: TelegrafContext) => {
	const id = getFromContext("id", ctx);
	if (id && id === MASTER_ID) {
		const list = await listUsers();
		const message = list.reduceRight((m, cur, id) => {
			return `${m}${list.length - id}. ${cur.name} (<code>${
				cur.userId
			}</code>)\n     Date: ${cur.date.toISOString()}\n     Remove: /rm_${
				cur.userId
			}\n     ${".".repeat(56)}\n`;
		}, "<b>Whitelisted Users</b>\n<code>----------------</code>\n");
		return ctx.reply(message || "List is empty", { parse_mode: "HTML" });
	}
};
