/* MIT
 * Copyright (c) 2019 Lsong <song940@gmail.com> (https://lsong.org)
 */

import type { Readable } from "stream";
import type { Instagram } from "../types";

import axios from "axios";

import { ERRORS } from "../constant";

const regex = /<script type="text\/javascript">window._sharedData = (.+);<\/script>/;

const get = (url: string) =>
	axios.get(url, { responseType: "stream" }).then(res => res.data);

const readStream = (stream: Readable): Promise<Buffer> => {
	const buffer: Uint8Array[] = [];
	return new Promise((resolve, reject) => {
		stream
			.on("error", reject)
			.on("data", chunk => buffer.push(chunk))
			.on("end", () => resolve(Buffer.concat(buffer)));
	});
};

const transform = (buf: Buffer) => {
	const str = buf.toString();
	const match = str.match(regex)?.[1];
	if (!match) throw new Error(ERRORS.INVALID_POST);
	const json: Instagram = JSON.parse(match);
	return json;
};

const extractMedia = (instagram: Instagram): { type: string; url: string } => {
	const data = instagram?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
	if (!data) throw new Error(ERRORS.INVALID_POST);
	const link = data.is_video
		? { type: "video", url: data.video_url }
		: { type: "image", url: data.display_url };
	if (!link) throw new Error(ERRORS.INVALID_LINK);
	return link;
};

export const instagram = async (link: string) => {
	const page = await get(link);
	const stream = await readStream(page);
	const str = transform(stream);
	const media = extractMedia(str);
	return media;
}
