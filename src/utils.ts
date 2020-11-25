import type { AxiosStatic } from "axios";

import { ERRORS, headers } from "./constant";

export const checkURLStatus = async (
	axios: AxiosStatic,
	url: string
): Promise<boolean> => {
	try {
		await axios.get(url, {
			headers
		});
		return true;
	} catch (error) {
		return false;
	}
};

export const parseURL = (
	regex: InstanceType<typeof RegExp>,
	url: string
): string => {
	const link = url.match(regex)?.[0];
	if (link) return link;
	throw new Error(ERRORS.INVALID_URL);
};

export const throwErr = (message = ERRORS.INVALID_POST) => {
	throw new Error(message);
};
