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

export type Instagram = {
	entry_data: {
		PostPage: [
			{
				graphql: {
					shortcode_media: {
						is_video: boolean;
						video_url: string;
						display_url: string;
					};
				};
			}
		];
	};
};
