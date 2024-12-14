import { unified } from 'unified';
import remarkParse from 'remark-parse';
// import remarkStringify from 'remark-stringify'
import remarkFrontmatter from 'remark-frontmatter';
import remarkGFM from "remark-gfm";
import remarkMdx from "remark-mdx"

const parseMDZ = (markdown) => unified() 
    .use(remarkParse)
    // .use(remarkStringify)
    .use(remarkGFM)
    .use(remarkFrontmatter, ['toml'])
    .use(remarkMdx)
    .parse(markdown)

export{parseMDZ}