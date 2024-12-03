import { visit } from 'unist-util-visit';

const remarkImports = () => {
  return (tree, file) => {
    const imports = [];

    visit(tree, 'html', (node, index, parent) => {
      console.log(1)
      if (node.value.trim().startsWith('import ')) {
        imports.push(node.value.trim());
        // Remove the import statement from the tree
        parent.children.splice(index, 1);
      }
    });

    // Attach imports to the file data for later use
    file.data.imports = imports;
  };
};

export {
    remarkImports
};
