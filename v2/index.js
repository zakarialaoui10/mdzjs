import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';
import { parse as parseYaml } from 'yaml'; // To parse frontmatter as YAML

// Parse Markdown using unified
const parseMarkdown = (markdown) => unified().use(remarkParse).parse(markdown);

// Extract imports, exports, and frontmatter from Markdown
const extractImportsExportsAndFrontmatter = (markdown) => {
  // Frontmatter regex (between '---' or '+++')
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/m;
  const importRegex = /^import\s+.+from\s+.+;$/gm;
  const exportRegex = /^export\s+.+;$/gm; // Regex for export statements
  
  let imports = [];
  let exports = [];
  let frontmatter = {};
  let cleanedMarkdown = markdown;

  // Extract frontmatter (if exists)
  const frontmatterMatch = markdown.match(frontmatterRegex);
  if (frontmatterMatch) {
    const frontmatterContent = frontmatterMatch[1];
    frontmatter = parseYaml(frontmatterContent); // Parse YAML frontmatter
    cleanedMarkdown = cleanedMarkdown.replace(frontmatterRegex, ''); // Remove frontmatter
  }

  // Extract import statements
  cleanedMarkdown = cleanedMarkdown.replace(importRegex, (match) => {
    imports.push(match.trim());
    return ''; // Remove the import statement from Markdown
  });

  // Extract export statements
  cleanedMarkdown = cleanedMarkdown.replace(exportRegex, (match) => {
    exports.push(match.trim());
    return ''; // Remove the export statement from Markdown
  });

  return { imports, exports, frontmatter, cleanedMarkdown };
};

// Transform Markdown AST to function calls
const transformToFunction = (markdownAST) => {
  const transformNode = (node) => {
    if (node.type === 'text') return JSON.stringify(node.value);

    if (node.type === 'paragraph') {
      const childNodes = node.children.map(transformNode).join(', ');
      return `tag('p', {}, ${childNodes})`;
    }

    if (node.type === 'heading') {
      const childNodes = node.children.map(transformNode).join(', ');
      return `tag('h${node.depth}', {}, [${childNodes}])`;
    }

    if (node.type === 'html') {
      const component = node.value.trim();
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

  const body = markdownAST.children.map(transformNode).join(',\n');
  return body.replaceAll(',\n', ';\n');
};

// Sample Markdown with frontmatter, imports, and exports
const markdown = `---
title: "Example Page"
author: "John Doe"
---

import Button from './Button.js';
export const a = 10

# Hello World

This is a paragraph with <Button data="hello"/>

<p> Hello </p>
`;

// Extract imports, exports, and frontmatter
const { imports, exports, frontmatter, cleanedMarkdown } = extractImportsExportsAndFrontmatter(markdown);

// Parse Markdown content into AST
const ast = parseMarkdown(cleanedMarkdown);
const jsFunction = transformToFunction(ast);

// Combine frontmatter, imports, exports, and the transformed function
const finalOutput = [
  `// Frontmatter: ${JSON.stringify(frontmatter)}`,
  ...imports,
  ...exports,
  jsFunction
].join('\n\n');

console.log(finalOutput);
