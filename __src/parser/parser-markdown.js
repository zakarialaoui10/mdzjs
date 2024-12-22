import { marked } from 'marked';
import fm from 'front-matter';

function parseMarkdown(markdown) {
  let FMProps = {};
  function preprocess(markdown) {
    const { attributes, body } = fm(markdown);
    FMProps = { ...attributes };
    return body;
  }
  marked.use({ hooks: { preprocess } });
  const body = marked.parse(markdown);
  return { body, attributes: FMProps };
}

export{
    parseMarkdown,
}