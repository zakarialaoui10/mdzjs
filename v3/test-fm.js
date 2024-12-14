import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'

const MD = `
---
 title : hi 
---
`
const ast = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(remarkFrontmatter, ['yaml', 'toml'])
  .parse(MD)

console.log(ast)