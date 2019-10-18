import { Resource } from "./resource";

class EmptyObject { }

export class ResourceList<T extends object> extends Resource<EmptyObject> {
	constructor(
			resourceName: string,
			list: Array<Resource<T>>,
			firstPage: string,
			previousPage: string | null = null,
			currentPage: string,
			nextPage: string | null = null,
			lastPage: string | null = null) {
		ResourceList.require(firstPage,   "ResourceLists must contain a reference to the first page");
		ResourceList.require(currentPage, "ResourceLists must contain a reference to the current page");
		ResourceList.validateList(list);

		super(new EmptyObject(), currentPage);
		this.embed(resourceName, list);
		this.link("first", firstPage);

		if (previousPage)
			this.link("previous", previousPage);
		if (nextPage)
			this.link("next", nextPage);
		if (lastPage)
			this.link("last", lastPage);
	}

	private static require(object: any, errorMessage: string) {
		if (!object)
			throw new Error(errorMessage);
	}

	private static validateList(list: any[]) {
		list.filter(resource => !(resource instanceof Resource))
			.forEach(() => { throw new Error("You can only create ResourceLists from arrays of Resources"); });
	}
}
