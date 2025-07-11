function cleanMD(str, openSign, closeSign) {
  const result = [];
  let currentExpr = '';
  let currentText = '';
  let braceCount = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
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

function cleanExpression(block, openSign="", closeSign ="") {
  const content = block.slice(1, -1);
  const cleanedContent = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
  return `${openSign}{\n${cleanedContent}\n}${closeSign}`;
}
  
  // const text = `
  // const obj = {
  
  //   key1: 'value1',
  
  
  //   key2: 'value2',
  
  
  //   key3: {
  //     nestedKey1: 'nestedValue1',
  
  
  //     nestedKey2: 'nestedValue2',
  
  
  //     nestedKey3: {
  
  //       deepKey: 'deepValue'
  
  //     }
  
  //   }
  
  
  // };
  
  // export default {
  
  
  //   keyA: 'valueA',
  
  
  //   keyB: {
  
  //     nestedKey: 'nestedValue'
  
  //   }
  
  // };
  // `;
  
  // console.log(cleanMD(text));
  
export{
  cleanMD
}