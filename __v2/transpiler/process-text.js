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
          result.push({type:"expression", value : currentExpr.slice(1,-1)}); 
          // try {
          //   // console.log({currentExpr:currentExpr.slice(1,-1)})
          //   // const evaluatedExpr = new Function(`return ${currentExpr.trim().slice(1,-1)}`)()
          //   result.push({type:"expression", value : currentExpr.slice(1,-1)}); 
          // } catch (e) {
          //   //result.push({type:"string", value : currentExpr.trim}); 
          //   result.push(currentExpr.trim()); 
          // }
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
    return result.map(n=>typeof(n)==="string"?`"${n}"`:n.value);
  }
export{
  processText
}