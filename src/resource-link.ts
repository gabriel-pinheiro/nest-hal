import { JsonSerializable } from "./interfaces/json-serializable.interface";
import { JsonLink } from "./interfaces/json-link.interface";

export class ResourceLink implements JsonSerializable {
	private readonly path: string;
	private readonly isTemplated: boolean;

	constructor(path: string, isTemplated: boolean = false) {
		this.path = path;
		this.isTemplated = isTemplated;
	}

	toJSON(): JsonLink {
		const serialized: JsonLink = {
			href: this.path
		};

		if (this.isTemplated)
			serialized.templated = true;

		return serialized;
	}
}
