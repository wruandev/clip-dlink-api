const checkIfDefined = (env: string | undefined, errorMessage: string): string => {
  if (!env) {
    console.error(errorMessage);
    process.exit(1);
  }

  return env;
};

export { checkIfDefined };
