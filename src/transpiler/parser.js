import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGFM from "remark-gfm";
import remarkMdx from "remark-mdx"

const parseMDZ = (markdown) => unified() 
    .use(remarkParse)
    .use(remarkGFM)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkMdx)
    .parse(markdown)

export{parseMDZ}