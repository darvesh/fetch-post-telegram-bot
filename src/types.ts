export type Reddit = {
	is_video: boolean;
	domain: string;
	url: string;
	title: string;
	preview?: {
		reddit_video_preview: {
			fallback_url: string;
		};
	};
	media?: {
		reddit_video: {
			fallback_url: string;
		};
	};
};

type Edge<T> = { edges: T };
type Node<T> = { node: T };
type TextNode = { text: string };
type VideoNode = {
	has_audio: boolean;
	is_video: true;
						video_url: string;
};
type ImageNode = {
						display_url: string;
	is_video: false;
					};

export type Instagram = {
	shortcode_media?: { edge_media_to_caption: Edge<[Node<TextNode>]> } & {
		edge_sidecar_to_children?: Edge<(Node<ImageNode> | Node<VideoNode>)[]>;
	} & (ImageNode | VideoNode);
				};

export enum InstagramFileType {
	IMAGE = "photo",
	VIDEO = "video"
			}
export type File = { type: InstagramFileType; media: string; caption?: string };
export type InstagramFiles = {
	files: File[];
	caption: string;
	};
};
