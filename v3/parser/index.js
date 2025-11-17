import { unified } from 'unified';
import { reporter } from 'vfile-reporter'
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
// import remarkToc from 'remark-toc'
import remarkGFM from 'remark-gfm';
import { VFile } from 'vfile';
import {matter} from 'vfile-matter';
import { mdxjsEsm } from 'micromark-extension-mdxjs-esm'
import { mdxjsEsmFromMarkdown } from 'mdast-util-mdxjs-esm'

export async function parseMDZ(markdown, ...plugins) {
  const file = new VFile(markdown);
  matter(file, { strip: true });

  const preprocessor = unified()
    .use(remarkParse)
    .use({
      extensions: [mdxjsEsm()],
      fromMarkdown: [mdxjsEsmFromMarkdown()]
    })
    .use(remarkGFM)
    .use(remarkFrontmatter, ['yaml'])
    // .use(mdxjsEsm)
    // .use(remarkToc)

  plugins.forEach(plugin => {
    if (Array.isArray(plugin)) preprocessor.use(...plugin);
    else preprocessor.use(plugin);
  })
  const ast = preprocessor.parse(String(file));
  if(file.messages.length > 0 ) console.error(reporter(file))

  return {
    file,
    frontmatter: file.data.matter,
    ast,
  };
}

const inp = `
---
a : 1
b : 2
MDZ.Props : 
 - a : 1
 - c : 2
---

## Contents

## History

### Discovery
`.trimStart()
const out = await parseMarkdown(inp, )

console.log(out)
