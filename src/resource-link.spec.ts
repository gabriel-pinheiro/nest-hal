import { ResourceLink } from "./resource-link";

describe("ResourceLink", () => {
	const PATH = "/lorem/ipsum";

	it("should serialize correctly", () => {
		const link = new ResourceLink(PATH, true);

		expect(link.toJSON()).toEqual({
			href: PATH,
			templated: true
		});
	});

	it("should hide 'templated' when false", () => {
		const link = new ResourceLink(PATH);

		expect(link.toJSON()).toEqual({
			href: PATH
		});
	});
});
