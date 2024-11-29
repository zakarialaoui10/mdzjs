import { marked } from 'marked';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';

// Extract import statements from the Markdown
const extractImports = (markdown) => {
  const importRegex = /^import\s+.+from\s+.+;$/gm;
  const imports = [];
  const cleanedMarkdown = markdown.replace(importRegex, (match) => {
    imports.push(match.trim());
    return ''; // Remove the import statement from the Markdown
  });
  return { imports, cleanedMarkdown };
};

// Parse Markdown using marked
const parseMarkdown = (markdown) => marked.lexer(markdown);

// Transform tokens into a function
const transformToFunction = (tokens) => {
  const transformToken = (token) => {
    if (token.type === 'text') return JSON.stringify(token.text);

    if (token.type === 'paragraph') {
      const childNodes = token.tokens.map(transformToken).join(', ');
      return `tag('p', {}, ${childNodes})`;
    }

    if (token.type === 'heading') {
      const childNodes = token.tokens.map(transformToken).join(', ');
      return `tag('h${token.depth}', {}, [${childNodes}])`;
    }

    if (token.type === 'html') {
      const component = token.raw.trim();
      const type = getComponentType(component);
      switch (type) {
        case 'jsx':
          return `${jsx2js(component)}`;
        case 'html':
          return `HTMLWrapper("${component}")`;
        default:
          return null;
      }
    }

    return 'null';
  };

  const body = tokens.map(transformToken).join(',\n');
  return body.replaceAll(',\n', ';\n');
};

// Sample Markdown
const markdown = `
import Button from './Button.js';

# Hello World

This is a paragraph with <Button data="hello"/>

<p> Hello </p>
`;

// Extract imports and clean Markdown
const { imports, cleanedMarkdown } = extractImports(markdown);

// Parse and transform
const tokens = parseMarkdown(cleanedMarkdown);
const jsFunction = transformToFunction(tokens);

// Combine imports and the transformed function
const finalOutput = [...imports, jsFunction].join('\n\n');

console.log(finalOutput);
