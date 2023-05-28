import { bindObjectToItself } from "./classDecorator";
import { Constructor } from "./constructor";
import { SaferExperimentalClassDecoratorContext } from "./legacy.classDecorator";

export interface IHierarchy {
	[className: typeof Function.prototype.name]: IHierarchy | {};
}

export abstract class AbstractClassHierarchy<ParentClass extends Constructor, ChildClass extends ParentClass> {
	map: Map<ParentClass, Set<ChildClass>> = new Map();

	constructor() {
		bindObjectToItself(this);
	}

	/**
	 * @decorator
	 */
	abstract register(target: ClassDecoratorContext | SaferExperimentalClassDecoratorContext): void;

	static isChild(target: Constructor): boolean {
		return Object.getPrototypeOf(target) !== Function.prototype;
	}

	static parentOf(target: Constructor): Constructor | null {
		return AbstractClassHierarchy.isChild(target) ? (Object.getPrototypeOf(target) as Constructor) : null;
	}

	childsOf(target: ParentClass): Set<ChildClass> | undefined {
		return this.map.get(target);
	}

	isPresentAsParent(target: Constructor): boolean {
		return this.map.has(target as ChildClass);
	}

	isPresentAsChild(target: Constructor): boolean {
		return Array.from(this.map.values()).some((children) => children.has(target as ChildClass));
	}

	isPresent(target: Constructor): boolean {
		return this.isPresentAsParent(target) || this.isPresentAsChild(target);
	}

	recursiveChildsOf(remainingMap: typeof this.map, childs: Set<ChildClass>): IHierarchy {
		const hierarchy: IHierarchy = {};

		childs.forEach((child) => {
			const grandChild = this.childsOf(child);
			hierarchy[child.name] = grandChild ? this.recursiveChildsOf(remainingMap, grandChild) : {};
			remainingMap.delete(child);
		});

		return hierarchy;
	}

	get hierarchy(): IHierarchy {
		const hierarchy: IHierarchy = {};
		const remainingMap = new Map(this.map);

		remainingMap.forEach((childs, parent) => {
			hierarchy[parent.name] = this.recursiveChildsOf(remainingMap, childs);
		});

		return hierarchy;
	}

	hierarchyFrom(parent: ParentClass): IHierarchy {
		const truc = this.childsOf(parent);
		return {
			[parent.name]: truc ? this.recursiveChildsOf(new Map(this.map), truc) : {},
		} as IHierarchy;
	}
}

export class ClassHierarchy<ParentClass extends Constructor, ChildClass extends ParentClass> extends AbstractClassHierarchy<ParentClass, ChildClass> {
	register(target: ClassDecoratorContext): void {}
}
