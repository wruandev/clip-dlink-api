/* eslint-disable @typescript-eslint/no-explicit-any */
const asyncFn = (fn: any) =>
  function asyncUtilWrap(...args: Array<any>) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };

export { asyncFn };
