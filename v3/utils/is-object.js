export function isObject(input) {
    try {
      const parsed = new Function(`return (${input})`)();
      return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
    } catch {
      return false;
    }
  }
  
//   console.log(isObject("{a:1}")); // true
//   console.log(isObject("{1+1}")) // false