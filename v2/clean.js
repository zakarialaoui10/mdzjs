export function cleanMD(str, openSign, closeSign) {
    const result = [];
    let currentExpr = '';
    let currentText = '';
    let braceCount = 0;
    let isEscaped = false;
  
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
  
      if (char === '\\' && !isEscaped) {
        // Set escape flag and skip adding the backslash for now
        isEscaped = true;
        continue;
      }
  
      if (isEscaped) {
        // If escaped, append the literal character and reset escape flag
        currentText += char;
        isEscaped = false;
        continue;
      }
  
      if (char === '{') {
        if (braceCount === 0 && currentText) {
          result.push(currentText.trim());
          currentText = '';
        }
        braceCount++;
        currentExpr += char;
      } else if (char === '}') {
        braceCount--;
        currentExpr += char;
        if (braceCount === 0) {
          result.push(cleanExpression(currentExpr, openSign, closeSign));
          currentExpr = '';
        }
      } else {
        if (braceCount === 0) {
          currentText += char;
        } else {
          currentExpr += char;
        }
      }
    }
  
    if (currentText) {
      result.push(currentText.trim());
    }
  
    return result.join('');
  }
  
  function cleanExpression(block, openSign = "", closeSign = "") {
    const content = block.slice(1, -1);
    const cleanedContent = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
    return `${openSign}{${cleanedContent}}${closeSign}`;
    // return `${openSign}{\n${cleanedContent}\n}${closeSign}`;
  }
  
//   const input = "Normal text {expression here} and \\{escaped brace\\}";
//   console.log(cleanMD(input, "[", "]"));
  