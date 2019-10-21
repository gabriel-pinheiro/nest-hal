import { SelfLink, Link } from "./link.decorator";
import { Resource } from "../resource";

describe("@SelfLink", () => {
	const OBJECT = () => ({name: "george"});
	const PATH = "/lorem/ipsum";

	it("should create a resource with the correct string path", () => {
		class Class {
			@SelfLink(PATH)
			identity(object: any): any {
				return object;
			}
		}
		const obj = OBJECT();
		const res = new Class().identity(obj);

		expect(res).toBeInstanceOf(Resource);
		expect(res.path).toBe(PATH);
	});

	it("should create a resource with the correct function path", () => {
		class Class {
			@SelfLink(() => PATH)
			identity(object: any): any {
				return object;
			}
		}
		const obj = OBJECT();
		const res = new Class().identity(obj);

		expect(res).toBeInstanceOf(Resource);
		expect(res.path).toBe(PATH);
	});

	it("should send the original response to the lambda", () => {
		const obj = OBJECT();
		const mockFn = jest.fn(o => PATH);
		class Class {
			@SelfLink(o => mockFn(o))
			identity(object: any): any {
				return object;
			}
		}

		new Class().identity(obj);
		expect(mockFn).toHaveBeenCalledWith(obj);
	});

	it("should not create a Resource of Resource", () => {
		const obj = OBJECT();
		class Class {
			@SelfLink("foo")
			identity(object: any): any {
				return object;
			}
		}

		const res = new Resource(obj, "bar");
		expect(new Class().identity(res).object).not.toBeInstanceOf(Resource);
	});

	it("should change self link when return is a Resource", () => {
		const obj = OBJECT();
		class Class {
			@SelfLink("foo")
			identity(object: any): any {
				return object;
			}
		}

		const res = new Resource(obj, "bar");
		expect(new Class().identity(res).getRequiredLink("self").path).toBe("foo");
	});
});

describe("@Link", () => {
	const OBJECT = () => ({name: "george"});
	const PATH = "/lorem/ipsum";

	it("should link to the correct string path", () => {
		class Class {
			@Link("foo", "bar")
			@SelfLink(PATH)
			identity(object: any): any {
				return object;
			}
		}
		const obj = OBJECT();
		const res = new Class().identity(obj);

		expect(res.getRequiredLink("foo").path).toBe("bar");
	});

	it("should link to the correct function path", () => {
		class Class {
			@Link("foo", () => "bar")
			@SelfLink(PATH)
			identity(object: any): any {
				return object;
			}
		}
		const obj = OBJECT();
		const res = new Class().identity(obj);

		expect(res.getRequiredLink("foo").path).toBe("bar");
	});

	it("should not be used with non-resources", () => {
		class Class {
			@Link("foo", "bar")
			identity(object: any): any {
				return object;
			}
		}
		const obj = OBJECT();
		expect(() => new Class().identity(obj)).toThrowError();
	});
});
