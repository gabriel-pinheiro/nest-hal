import { Resource } from "./resource";
import { ResourceLink } from "./resource-link";

describe("Resource", () => {
	const PATH = "/lorem/ipsum";
	const OBJECT = () => ({potato: "george"});
	let res: Resource<object>;

	beforeEach(() => {
		res = new Resource(OBJECT(), PATH);
	});

	it("should not build without a path", () => {
		// @ts-ignore
		expect(() => new Resource(OBJECT())).toThrowError();
	});

	it("should have a self link", () => {
		const selfLink = res.getLink("self");
		expect(selfLink).toEqual(new ResourceLink(PATH));
	});

	it("should link to strings", () => {
		const link = res
			.link("foo", "bar")
			.getLink("foo");

		expect(link).toEqual(new ResourceLink("bar"));
	});

	it("should link to links", () => {
		const link = res
			.link("foo", new ResourceLink("bar"))
			.getLink("foo");

		expect(link).toEqual(new ResourceLink("bar"));
	});

	it("should link to resources", () => {
		const link = res
			.link("foo", new Resource(OBJECT(), "bar"))
			.getLink("foo");

		expect(link).toEqual(new ResourceLink("bar"));
	});

	it("should emit error when linking to invalid objects", () => {
		// @ts-ignore
		const error = () => res.link("foo", OBJECT());
		expect(error).toThrowError();
	});

	it("should deep flatten embeds", () => {
		const obj = {a: "b"};
		const res2 = new Resource(obj, PATH + "/something");

		// @ts-ignore
		const embed = res.embed("something", [[[res2]]]).toJSON()._embedded.something[0];
		expect(embed).toEqual(res2.toJSON());
	});

	it("should not allow embeds to not be resources", () => {
		// @ts-ignore
		expect(() => res.embed("rel", {})).toThrowError();
	});

	it("should serialize correctly", () => {
		const obj = {a: "b"};
		const res2 = new Resource(obj, PATH + "/something");

		const serialized = res
			.link("foo", "bar")
			.embed("something", res2)
			.toJSON();

		expect(serialized).toEqual({
			...OBJECT(),
			_links: {
				self: { href: PATH },
				foo: { href: "bar" }
			},
			_embedded: {
				something: [{
					...obj,
					_links: {
						self: { href: PATH + "/something" }
					}
				}]
			}
		});
	});

	it("should not modify original object on serialization", () => {
		const obj = {};

		new Resource(obj, PATH).toJSON();

		// @ts-ignore
		expect(obj._links).toBeUndefined();
	});

	it("should warn about circular structures when serializing", () => {
		expect(() => res.embed("me", res).toJSON()).toThrowError();
	});

	it("required: should emit error when not present", () => {
		// @ts-ignore
		expect(() => Resource.required(void 0)).toThrowError();
	});

	it("object: should return objects", () => {
		expect(Resource.object(OBJECT())).toEqual(OBJECT());
	});

	it("object: should flatten resources", () => {
		expect(Resource.object(res)).toEqual(OBJECT());
	});
});
