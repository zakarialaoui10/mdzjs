import { visit } from 'unist-util-visit';

const remarkImports = () => {
  return (tree, file) => {
    const imports = [];

    visit(tree, 'html', (node, index, parent) => {
      if (node.value.trim().startsWith('import ')) {
        imports.push(node.value.trim());
        parent.children.splice(index, 1);
      }
    });
    file.data.imports = imports;
  };
};

export {
    remarkImports
};
