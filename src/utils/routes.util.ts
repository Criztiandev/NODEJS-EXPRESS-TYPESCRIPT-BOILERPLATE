// routes.util.ts
type ControllerMethod = (...args: any[]) => any;
type Controller = { [key: string]: ControllerMethod | any };

export function bindControllerMethods<T extends Controller>(controller: T): T {
  const boundController = Object.create(Object.getPrototypeOf(controller)) as T;

  // Copy all properties from the original controller
  Object.getOwnPropertyNames(controller).forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(controller, prop)) {
      boundController[prop as keyof T] = controller[prop];
    }
  });

  // Get all methods from the prototype chain and bind them
  function getAllPrototypeMethods(obj: any): string[] {
    const props = new Set<string>();
    let currentObj = Object.getPrototypeOf(obj);

    while (currentObj && currentObj !== Object.prototype) {
      Object.getOwnPropertyNames(currentObj)
        .filter(
          (prop) => typeof obj[prop] === "function" && prop !== "constructor"
        )
        .forEach((prop) => props.add(prop));
      currentObj = Object.getPrototypeOf(currentObj);
    }

    return Array.from(props);
  }

  // Bind all prototype methods
  getAllPrototypeMethods(controller).forEach((method) => {
    if (typeof controller[method] === "function") {
      boundController[method as keyof T] = controller[method].bind(controller);
    }
  });

  return boundController;
}
