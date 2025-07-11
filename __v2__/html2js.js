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
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
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
  return JSON.stringify(text.trim());
}

const html = `<p>
Hello world 
<span> 
hi 
</span>
<JsxComponent data={zikojs} />

<JsxComponent>
 <Js />
 <Js />
</JsxComonent>
</p>`;

const ast = parseDocument(html, { lowerCaseTags: false }); // Disable automatic lowercase conversion

const transformedCode = ast.children
  .map(transformNode)
  .filter(Boolean) // Remove empty strings from top-level nodes
  .join(', ');

console.log(transformedCode);
