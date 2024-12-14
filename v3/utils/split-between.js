export function splitBetween(input, startToken, endToken) {
    const pattern = new RegExp(`${startToken}(.*?)${endToken}`, "g"); 
    const result = [];
    let lastIndex = 0;
  
    input.replace(pattern, (match, content, offset) => {
      if (offset > lastIndex) {
        result.push({
          type: "string",
          value: input.slice(lastIndex, offset),
        });
      }
      result.push({
        type: "expression",
        value: content,
      });
      lastIndex = offset + match.length;
    });
  
    if (lastIndex < input.length) {
      result.push({
        type: "string",
        value: input.slice(lastIndex),
      });
    }
  
    return result;
  }