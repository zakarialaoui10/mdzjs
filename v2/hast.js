import { parseDocument } from 'htmlparser2';

function transformNode(node) {
  switch (node.type) {
    case 'text': {
      const text = node.data;
      return processText(text);
    }
    case 'tag': {
      const tagName = node.rawTagName || node.name;
      const isJSXComponent = /^[A-Z]/.test(tagName);

      const attributes = node.attribs
        ? Object.entries(node.attribs)
            .map(([key, value]) => `${key}: ${processAttribute(value)}`)
            .join(', ')
        : '';

      const childNodes = node.children
        .map(transformNode)
        .filter(Boolean) // Remove empty strings from children
        .join(', ');

      if (isJSXComponent) {
        return `${tagName}({${attributes}}, ${childNodes})`;
      } else {
        return `tag('${tagName}', {${attributes}}, ${childNodes})`;
      }
    }
    default:
      return '';
  }
}

function processText(text) {
  const mustacheRegex = /\{\s*([^}]+)\s*\}/g;
  console.log({text})
  console.log({pr : text.match(mustacheRegex)})
  if (mustacheRegex.test(text)) {
    return text.replace(mustacheRegex, (_, expression) => `\${${expression.trim()}}`);
  }

  return JSON.stringify(text.trim());
}

function processAttribute(value) {
  const mustacheRegex = /\{\s*([^}]+)\s*\}/g;

  if (mustacheRegex.test(value)) {
    // Replace {expression} with dynamic JSX-compatible syntax
    return value.replace(mustacheRegex, (_, expression) => `${expression.trim()}`);
  }

  return JSON.stringify(value); // Keep as a static string if no {expression} is found
}

const html = `<p id="{

M>10}
"> {
 (()=> {
  
  return 1
  })()
}

Hi 
</p>`;

const ast = parseDocument(html, { lowerCaseTags: false }); // Disable automatic lowercase conversion

const transformedCode = ast.children
  .map(transformNode)
  .filter(Boolean) // Remove empty strings from top-level nodes
  .join(', ');

console.log(transformedCode);
