export function splitBetween(input, startToken, endToken) {
    const pattern = new RegExp(`${startToken}(.*?)${endToken}`, "g"); // Match the tokens and capture the content inside
    const result = [];
    let lastIndex = 0;
  
    input.replace(pattern, (match, content, offset) => {
      // Add non-matching text as a string object
      if (offset > lastIndex) {
        result.push({
          type: "string",
          value: input.slice(lastIndex, offset),
        });
      }
      // Add the captured content as an expression object
      result.push({
        type: "expression",
        value: content,
      });
      // Update the last index to after the match
      lastIndex = offset + match.length;
    });
  
    // Add any remaining text after the last match as a string object
    if (lastIndex < input.length) {
      result.push({
        type: "string",
        value: input.slice(lastIndex),
      });
    }
  
    return result;
  }
  
// const input = "Text before {token content} text between {another token} end text";
// console.log(splitBetween(input, "{", "}"));
  

// export function splitBetween(input, startToken , endToken) {
//     const pattern = new RegExp(`${startToken}|${endToken}`, "g")
//     const arr=input.split(pattern);
//     return arr
// }

// // const input = `
// // Hi "EXP_START{This is an expression}EXP_END" How are you , {}
// // `;

// // const startToken = "\"EXP_START";
// // const endToken = "EXP_END\"";
// // console.log(splitBetween(input, startToken, endToken));

