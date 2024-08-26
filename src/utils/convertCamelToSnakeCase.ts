const convertCamelToSnakeCase = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const snakeObj: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      snakeObj[snakeKey] = convertCamelToSnakeCase(
        obj[key] as Record<string, unknown>
      );
    }
  }

  return snakeObj;
};

export default convertCamelToSnakeCase;
