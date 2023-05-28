import { SaferExperimentalClassDecoratorContext } from "./legacy.classDecorator";
import { AbstractClassHierarchy } from "./classHierarchy";
import { Constructor } from "./constructor";

export class ClassHierarchyExperimentalDecorators<ParentClass extends Constructor, ChildClass extends ParentClass> extends AbstractClassHierarchy<ParentClass, ChildClass> {
	register(context: SaferExperimentalClassDecoratorContext): void {
		const parent = ClassHierarchyExperimentalDecorators.parentOf(context as Constructor);
		if (!parent) {
			this.map.set(context as ParentClass, new Set());
		} else if (!this.isPresentAsParent(parent)) {
			this.map.set(parent as ParentClass, new Set([context as ChildClass]));
		} else {
			this.map.get(parent as ParentClass)!.add(context as ChildClass);
		}
	}
}
