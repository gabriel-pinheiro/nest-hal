import { Resource } from "../resource";

function buildLink(path: string | ((object: object) => string), resource: Resource<object> | object): string {
	const object = Resource.object(resource);

	if (path instanceof Function)
		return path(object);

	return path;
}

export const SelfLink = (path: string | ((object: any) => string)): MethodDecorator => (ctrl, mthd, descriptor: PropertyDescriptor) => {
	const oldMethod = descriptor.value;

	descriptor.value = function(...params: any[]) {
		const object = oldMethod.apply(this, params);
		return selfLink(object, path);
	};
};

function selfLink<T extends object>(object: T | Resource<T>, path: string | ((object: object) => string)): Resource<T> {
	const resLink: string = buildLink(path, object);

	if (object instanceof Resource)
		return object.link("self", resLink);

	return new Resource(object, resLink);
}

export const Link = (relation: string, path: string | ((object: any) => string)): MethodDecorator => (ctrl, mthd, descriptor: PropertyDescriptor) => {
	const oldMethod = descriptor.value;

	descriptor.value = function(...params: any[]) {
		const object = oldMethod.apply(this, params);
		return link(object, relation, path);
	};
};

function link<T extends object>(object: Resource<T>, relation: string, path: string | ((object: object) => string)): Resource<T> {
	if (!(object instanceof Resource))
		throw new Error("You can only use @Link in methods that return Resources or BEFORE @SelfLink, @SelfLink must be the last decorator");

	const resLink: string = buildLink(path, object);
	return object.link(relation, resLink);
}
