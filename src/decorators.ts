export function bindObjectToItself(target: Object): void {
	Object.getOwnPropertyNames(Object.getPrototypeOf(target)).forEach((property) => {
		const originalProperty = target[property as keyof typeof target];
		if (typeof originalProperty === "function") {
			target[property as keyof typeof target] = originalProperty.bind(target);
		}
	});
}
