export const INSTAGRAM_REGEX = /instagram/;

export const ERRORS = {
	INVALID_LINK: "LINK IS INVALID",
	INVALID_POST: "THIS LINK COULDN'T BE PROCESSED"
} as const;

export const placeholder = "https://ibb.co/rvYSLg5";

export const imageRegex = /\.(jpg|jpeg|png)$/;
export const gifRegex = /\.(gif|gifv)$/;
export const imgurRegex = /https\:\/\/(?:.\.)?imgur.com\/(\w+)\.[a-z]{3,4}/i;
export const linkRegex = /^((https\:\/\/)?(www\.)?)?(old\.)?reddit\.com\/r\/\w+\/comments\/\w+\/\w+\/?/g;