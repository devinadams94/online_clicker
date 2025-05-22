// Simple test to debug potential type issues with purchasedTrustLevels

// Test different array formats and includes() behavior
const numericArray = [1, 2, 3];
const stringArray = ["1", "2", "3"];
const mixedArray = [1, "2", 3];

console.log("Testing numeric arrays:");
console.log("numericArray.includes(1):", numericArray.includes(1)); // true
console.log("numericArray.includes('1'):", numericArray.includes('1')); // false

console.log("\nTesting string arrays:");
console.log("stringArray.includes(1):", stringArray.includes(1)); // false
console.log("stringArray.includes('1'):", stringArray.includes('1')); // true

console.log("\nTesting mixed arrays:");
console.log("mixedArray.includes(1):", mixedArray.includes(1)); // true
console.log("mixedArray.includes('1'):", mixedArray.includes('1')); // false
console.log("mixedArray.includes(2):", mixedArray.includes(2)); // false
console.log("mixedArray.includes('2'):", mixedArray.includes('2')); // true

// Test JSON stringification and parsing
const levelsArray = [1, 2, 3];
const jsonString = JSON.stringify(levelsArray);
console.log("\nJSON string:", jsonString);

// Single parse
const parsed = JSON.parse(jsonString);
console.log("Parsed once:", parsed);
console.log("typeof parsed[0]:", typeof parsed[0]);
console.log("parsed.includes(1):", parsed.includes(1));
console.log("parsed.includes('1'):", parsed.includes('1'));

// Double stringification
const doubleJsonString = JSON.stringify(jsonString);
console.log("\nDouble JSON string:", doubleJsonString);

// Double parse 
try {
  const doubleParsed = JSON.parse(JSON.parse(doubleJsonString));
  console.log("Double parsed:", doubleParsed);
  console.log("typeof doubleParsed[0]:", typeof doubleParsed[0]);
  console.log("doubleParsed.includes(1):", doubleParsed.includes(1));
} catch (err) {
  console.error("Error with double parsing:", err);
}

// Test with database format - a string that represents a JSON array
const dbFormat = '[]';
console.log("\nEmpty DB format:", dbFormat);
const parsedEmpty = JSON.parse(dbFormat);
console.log("Parsed empty:", parsedEmpty);
console.log("parsedEmpty.includes(1):", parsedEmpty.includes(1));

// Test with non-empty DB format
const dbFormatWithData = '[1,2,3]';
console.log("\nDB format with data:", dbFormatWithData);
const parsedWithData = JSON.parse(dbFormatWithData);
console.log("Parsed with data:", parsedWithData);
console.log("typeof parsedWithData[0]:", typeof parsedWithData[0]);
console.log("parsedWithData.includes(1):", parsedWithData.includes(1));
console.log("parsedWithData.includes('1'):", parsedWithData.includes('1'));

// Test conversion from numbers to strings for comparison
const originalArray = [1, 2, 3];
const strArray = originalArray.map(item => String(item));
console.log("\nOriginal array:", originalArray);
console.log("String array:", strArray);
console.log("strArray.includes('1'):", strArray.includes('1'));
console.log("strArray.includes(1):", strArray.includes(1));