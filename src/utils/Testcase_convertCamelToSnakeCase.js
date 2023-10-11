// Test case 1: Convert a simple camelCase object to snake_case.
const inputObj1 = {
    camelCaseKey: "camelCaseValue",
  };
  const expectedOutputObj1 = {
    camel_case_key: "camel_case_value",
  };
  const actualOutputObj1 = convertCamelToSnakeCase(inputObj1);
  
  expect(actualOutputObj1).toEqual(expectedOutputObj1);
  
  // Test case 2: Convert a nested camelCase object to snake_case.
  const inputObj2 = {
    camelCaseKey1: {
      camelCaseKey2: "camelCaseValue2",
    },
  };
  const expectedOutputObj2 = {
    camel_case_key_1: {
      camel_case_key_2: "camel_case_value_2",
    },
  };
  const actualOutputObj2 = convertCamelToSnakeCase(inputObj2);
  
  expect(actualOutputObj2).toEqual(expectedOutputObj2);
  
  // Test case 3: Convert an object with a non-camelCase key to snake_case.
  const inputObj3 = {
    "my-key": "my-value",
  };
  const expectedOutputObj3 = {
    my_key: "my_value",
  };
  const actualOutputObj3 = convertCamelToSnakeCase(inputObj3);
  
  expect(actualOutputObj3).toEqual(expectedOutputObj3);
  
  // Test case 4: Convert an empty object to snake_case.
  const inputObj4 = {};
  const expectedOutputObj4 = {};
  const actualOutputObj4 = convertCamelToSnakeCase(inputObj4);
  
  expect(actualOutputObj4).toEqual(expectedOutputObj4);
  
  // Test case 5: Convert a null object to snake_case.
  const inputObj5 = null;
  const expectedOutputObj5 = null;
  const actualOutputObj5 = convertCamelToSnakeCase(inputObj5);
  
  expect(actualOutputObj5).toEqual(expectedOutputObj5);
  
  // Test case 6: Convert an object with a key that contains numbers.
  const inputObj6 = {
    camelCaseKey123: "camelCaseValue123",
  };
  const expectedOutputObj6 = {
    camel_case_key_123: "camel_case_value_123",
  };
  const actualOutputObj6 = convertCamelToSnakeCase(inputObj6);
  
  expect(actualOutputObj6).toEqual(expectedOutputObj6);
  
  
  // Test case 7: Convert an object with a key that is an empty string.
  const inputObj8 = {
    "": "",
  };
  const expectedOutputObj8 = {
    "": "",
  };
  const actualOutputObj8 = convertCamelToSnakeCase(inputObj8);
  
  expect(actualOutputObj8).toEqual(expectedOutputObj8);
  
  // Test case 8: Convert an object with a key that is undefined.
  const inputObj9 = {
    undefined: undefined,
  };
  const expectedOutputObj9 = {
    undefined: undefined,
  };
  const actualOutputObj9 = convertCamelToSnakeCase(inputObj9);
  
  expect(actualOutputObj9).toEqual(expectedOutputObj9);
  