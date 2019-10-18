import { JsonLink } from "./json-link.interface";

export interface LinkMap {
	self: JsonLink;
	[key: string]: JsonLink;
}
