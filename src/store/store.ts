import type TelegrafContext from "telegraf/typings/context";

import DataStore from "nedb-promises";
import { User } from "../types";

const db = new DataStore(__dirname + "/user.db");

export const addUser = async (
	user: { id: number; name: string },
	ctx: TelegrafContext
) => {
	const exist = await userExists(user.id);
	if (exist) {
		await ctx.reply(
			`${user.name}(<code>${user.id}</code>) is already whitelisted`,
			{ parse_mode: "HTML" }
		);
		return;
	}
	await db.insert({ userId: user.id, name: user.name, date: new Date() });
	await ctx.reply(
		`${user.name}(<code>${user.id}</code>) has been whitelisted`,
		{ parse_mode: "HTML" }
	);
};

export const removeUser = async (
	id: number,
	ctx: TelegrafContext
): Promise<void> => {
	await db.remove({ userId: id }, { multi: true });
	await ctx.reply(`${id} has been removed from whitelist`);
};

export const userExists = async (id: number): Promise<boolean> => {
	const count = await db.count({ userId: id });
	return count > 0 ? true : false;
};

export const listUsers = async () => {
	const list = await db.find<User>(
		{},
		{ userId: 1, name: 1, date: 1, _id: 0 }
	);
	return list;
};
