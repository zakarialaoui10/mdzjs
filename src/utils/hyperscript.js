export const hyperscript = (tag, attrs, children="") => {
    const HasChildren = !!children;

    
    // if(children instanceof Array)children = children.push('"."')
    if(tag === "p"){
        children = children + ',""'
        const splitted = splitQuotedLines(children);
        children = insertBetween(splitted, 'h("br")')
        children[children.length - 1] = children.at(-1).slice(0, -3)
        console.log({children})
        // console.log({children : children.slice(0, -3)})
    }
    // children = children.slice(0,-3)
    return `h("${tag}", ${attrs}${HasChildren ?`, ${children}` : ""})`
}

function splitQuotedLines(str) {
  if (typeof str !== "string" || str.length < 2 || str[0] !== '"' || str[str.length - 1] !== '"') {
    // throw new Error("Input must be a quoted string, e.g. '\"Line1\\r\\nLine2\"'");
      return ['"k"']

  }
//   return ['"k"']
  return str
    .slice(1, -1)                        // Remove the surrounding quotes
    .split(/\r\n|\r|\n/)                // Split by newline types
    .map(line => `"${line}"`);          // Re-wrap each line in quotes
}

function insertBetween(arr, value) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]);
    if (i < arr.length - 1) {
      result.push(value);
    }
  }
  return result;
}
