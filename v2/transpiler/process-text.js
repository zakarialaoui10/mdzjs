function processText(str) {
    const result = [];
    let currentExpr = '';
    let currentText = '';
    let insideBraces = false;
    let braceCount = 0;
  
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
  
      if (char === '{') {
        if (braceCount === 0 && currentText) {
          result.push(currentText); 
          currentText = ''; 
        }
        braceCount++;
        currentExpr += char;
      } else if (char === '}') {
        braceCount--;
        currentExpr += char;
        if (braceCount === 0) {
          try {
            const evaluatedExpr = new Function(currentExpr.trim())();
            result.push(evaluatedExpr); 
          } catch (e) {
            result.push(currentExpr.trim()); 
          }
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
      result.push(currentText);
    }
  
    return result;
  }
export{
  processText
}