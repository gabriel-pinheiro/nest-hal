import { JsonResource } from "./json-resource.interface";

export interface EmbedMap {
	[key: string]: JsonResource[];
}
