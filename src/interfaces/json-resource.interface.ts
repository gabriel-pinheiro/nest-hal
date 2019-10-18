import { LinkMap } from "./link-map.interface";

export interface JsonResource {
	_embedded?: object;
	_links: LinkMap;
	[key: string]: any;
}
