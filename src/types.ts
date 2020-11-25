export type reddit = {
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

export type Media =
	| {
			from: "reddit";
			type: "video" | "image" | "gif";
			url: string;
			title: string;
	  }
	| {
			from: "imgur";
			type: "video" | "image";
			url: string;
			title: string;
	  }
	| {
			from: "gfycat";
			type: "video";
			url: string;
			title: string;
	  };
