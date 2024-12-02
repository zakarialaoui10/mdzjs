import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import { parse as parseYaml } from 'yaml';

const parseMarkdownWithFrontmatter = (markdown) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml']); // Enable YAML frontmatter parsing

  const parsed = processor.parse(markdown);
  return parsed;
};

const extractFrontmatter = (tree) => {
  const frontmatterNode = tree.children.find((node) => node.type === 'yaml');
  return frontmatterNode ? parseYaml(frontmatterNode.value) : {};
};

// Sample Markdown
const markdown = `
---
title: Example
author: User
---

# Heading 1
This is a sample document.
`;

const markdownAST = parseMarkdownWithFrontmatter(markdown);
const frontmatter = extractFrontmatter(markdownAST);

console.log('Frontmatter:', frontmatter);
console.log('AST:', markdownAST);
