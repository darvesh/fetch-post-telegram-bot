import type { Readable } from "stream";

import axios from "axios";

import { ERRORS } from "../constant";
import { File, Instagram, InstagramFiles, InstagramFileType } from "../types";
import { CustomError } from "../utils";

// MIT Copyright (c) 2019 Lsong <song940@gmail.com> (https://lsong.org)
const regex = /<script type="text\/javascript">window._sharedData = (.+);<\/script>/;

const getStream = (url: string) =>
	axios
		.get<Readable>(url, { responseType: "stream" })
		.then(res => res.data);

const readStream = (stream: Readable): Promise<Buffer> => {
	const buffer: Uint8Array[] = [];
	return new Promise((resolve, reject) => {
		stream
			.on("error", reject)
			.on("data", chunk => buffer.push(chunk))
			.on("end", () => resolve(Buffer.concat(buffer)));
	});
};

const transform = (buf: Buffer): Instagram => {
	const str = buf.toString();
	const match = str.match(regex)?.[1];
	if (!match) throw new CustomError(ERRORS.INVALID_POST);
	const json = JSON.parse(match) as {
		entry_data?: { PostPage?: [{ graphql?: Instagram }] };
	};
	if (!json?.entry_data?.PostPage?.[0].graphql)
		throw new CustomError(
			ERRORS.INVALID_LINK,
			"Link redirected to login page"
		);
	return json.entry_data.PostPage[0].graphql;
};

const removeHashTags = (caption: string) =>
	caption.replace(/(#\w+\s+?)+/g, " ");
const removeMultipleLines = (caption: string) =>
	caption
		.split("\n")
		.filter(word => word.match(/\w+/))
		.join(" | ");
const removeAtTheRate = (caption: string) => caption.replace(/@+/g, "(at)");
const extractCaption = (instagram: Instagram): string => {
	if (instagram.shortcode_media)
		if ("edge_media_to_caption" in instagram.shortcode_media) {
			const caption =
				instagram.shortcode_media?.edge_media_to_caption.edges?.[0]
					?.node?.text;
			const filteredCaption = removeMultipleLines(
				removeHashTags(removeAtTheRate(caption))
			);
			return filteredCaption.length > 1000
				? `${filteredCaption.slice(0, 250)} ....`
				: filteredCaption;
		}
	return "--no-caption--";
};
const extractMedia = (insta: Instagram) => {
	const album = insta?.shortcode_media?.edge_sidecar_to_children;
	const caption = extractCaption(insta);
	if (album) {
		if (!album)
			throw new CustomError(ERRORS.INVALID_POST, "extractMedia: A");
		const media = album.edges.reduce<File[]>((files, media) => {
			if (media.node.is_video)
				return [
					...files,
					{
						type: InstagramFileType.VIDEO,
						media: media.node.video_url
					}
				];
			return [
				...files,
				{ type: InstagramFileType.IMAGE, media: media.node.display_url }
			];
		}, []);
		return { files: media, caption };
	}
	const node = insta?.shortcode_media;
	if (!node) throw new CustomError(ERRORS.INVALID_POST, "extractMedia: B");
	if (node.is_video)
		return {
			files: [{ type: InstagramFileType.VIDEO, media: node.video_url }],
			caption
		};
	return {
		files: [{ type: InstagramFileType.IMAGE, media: node.display_url }],
		caption
	};
};

export const fetchInstagramFiles = (url: string): Promise<InstagramFiles> =>
	getStream(url).then(readStream).then(transform).then(extractMedia);
