import { ResourceList } from "./resource-list";
import { Resource } from "./resource";

describe("ResourceList", () => {
	const PATH = "/lorem/ipsum";
	const OBJECT = () => ({potato: "george"});
	let res: Resource<object>;

	beforeAll(() => {
		res = new Resource(OBJECT(), PATH);
	});

	it("should not allow firstPage to be undefined", () => {
		// @ts-ignore
		expect(() => new ResourceList("lorem", [res], null, " ", " ", " ", " "))
			.toThrowError();
	});

	it("should not allow currentPage to be undefined", () => {
		// @ts-ignore
		expect(() => new ResourceList("lorem", [res], " ", " ", null, " ", " "))
			.toThrowError();
	});

	it("should allow previous, next and last pages to be undefined", () => {
		expect(new ResourceList("lorem", [res], " ", void 0, " ")).toBeDefined();
	});

	it("should not allow list to contain non-Resource objects", () => {
		// @ts-ignore
		expect(() => new ResourceList("lorem", [{}], " ", null, " ")).toThrowError();
	});

	it("should serialize correctly", () => {
		expect(new ResourceList("lorem", [res], "a", "b", "c", "d", "e").toJSON())
			.toEqual({
				_embedded: {
					lorem: [
						{
							potato: "george",
							_links: {
								self: { href: "/lorem/ipsum" }
							}
						}
					]
				},
				_links: {
					self: { href: "c" },
					first: { href: "a" },
					previous: { href: "b" },
					next: { href: "d" },
					last: { href: "e" }
				}
			});
	});
});
