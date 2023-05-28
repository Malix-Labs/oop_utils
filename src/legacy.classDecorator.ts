import { Constructor } from "./constructor";

/**
 * @ ClassDecorator
 */
export type SaferExperimentalClassDecorator = (target: Constructor) => void | Constructor;
export type SaferExperimentalClassDecoratorContext = Parameters<SaferExperimentalClassDecorator>[0];
