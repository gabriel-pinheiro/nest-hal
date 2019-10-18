import { JsonSerializable } from "./interfaces/json-serializable.interface";
import { ResourceLink } from "./resource-link";
import { JsonResource } from "./interfaces/json-resource.interface";
import { LinkMap } from "./interfaces/link-map.interface";
import { EmbedMap } from "./interfaces/embed-map.interface";
import { flattenDeep, RecursiveArray } from "lodash";

export class Resource<T extends object> implements JsonSerializable {
	public readonly object: T;
	public readonly path: string;

	private readonly embedded: Map<string, Array<Resource<object>>>;
	private readonly links: Map<string, ResourceLink>;

	constructor(object: T, path: string) {
		if (!path)
			throw new Error("You must provide a path for the resource");

		this.object = object;
		this.path = path;

		this.embedded = new Map();
		this.links = new Map();

		this.link("self", this.path);
	}

	getLink(relation: string): ResourceLink | undefined {
		return this.links.get(relation);
	}

	getRequiredLink(key: string): ResourceLink {
		return Resource.required(this.links.get(key));
	}

	link(relation: string, link: ResourceLink | Resource<object> | string): Resource<T> {
		if (typeof link === "string")
			return this.linkToString(relation, link);

		if (link instanceof ResourceLink)
			return this.linkToLink(relation, link);

		if (link instanceof Resource)
			return this.linkToResource(relation, link);

		throw new TypeError("You can create links to ResourceLinks, Resources or strings only");
	}

	private linkToLink(relation: string, link: ResourceLink): Resource<T> {
		this.links.set(relation, link);
		return this;
	}

	private linkToString(relation: string, path: string): Resource<T> {
		const link = new ResourceLink(path);
		return this.linkToLink(relation, link);
	}

	private linkToResource(relation: string, resource: Resource<object>): Resource<T> {
		return this.linkToString(relation, resource.path);
	}

	embed(relation: string, ...embeds: RecursiveArray<Resource<object>>): Resource<T> {
		const flatEmbeds = flattenDeep(embeds);
		flatEmbeds
			.filter(embed => !(embed instanceof Resource))
			.forEach(() => { throw new Error("Embeds must also be resources"); });

		this.embedded.set(relation, flatEmbeds);
		return this;
	}

	toJSON(alreadySerialized?: WeakSet<Resource<object>>): JsonResource {
		if (!(alreadySerialized instanceof WeakSet))
			alreadySerialized = new WeakSet();

		this.validateCircularStructure(alreadySerialized);

		const embeds: EmbedMap | undefined = this.buildEmbedMap(alreadySerialized);
		const links: LinkMap = this.buildLinkMap();

		return {
			...this.object,
			_embedded: embeds,
			_links: links
		};
	}

	private validateCircularStructure(alreadySerialized: WeakSet<Resource<object>>) {
		if (alreadySerialized.has(this))
			throw new Error("Circular resource detected, cannot serialize");

		alreadySerialized.add(this);
	}

	private buildEmbedMap(alreadySerialized: WeakSet<Resource<object>>): EmbedMap | undefined {
		if (this.embedded.size === 0)
			return void 0;

		const embedMap: EmbedMap = {};

		for (const key of this.embedded.keys())
			embedMap[key] = Resource.required(this.embedded.get(key))
				.map(res => res.toJSON(alreadySerialized));

		return embedMap;
	}

	private buildLinkMap(): LinkMap {
		const linkMap: LinkMap = {
			self: this.getRequiredLink("self").toJSON()
		};

		for (const key of this.links.keys())
			linkMap[key] = this.getRequiredLink(key).toJSON();

		return linkMap;
	}

	private static required<T>(object: T | undefined): T {
		if (typeof object === "undefined")
			throw new ReferenceError("Required condition not matched");

		return object;
	}

	static object(object: Resource<object> | object) {
		if (object instanceof Resource)
			return object.object;

		return object;
	}
}
