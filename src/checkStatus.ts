import type { AxiosStatic } from "axios";

import { headers } from "./constant";

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
