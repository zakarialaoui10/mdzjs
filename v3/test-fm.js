import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { read } from 'to-vfile';

// Read the file contents
const file = await read('example.md');
console.log({file : String(file)})

console.log({content : String(`---
title : "Hi"
---`)})

// Parse the file into a syntax tree
const tree = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml', 'toml'])
  .parse(String(file));

// Process the tree if needed
console.dir(tree);

// // You can manually stringify the tree back to markdown
// const processedTree = unified()
//   .use(remarkStringify)
//   .runSync(tree);

// console.log(unified().use(remarkStringify).stringify(processedTree));
