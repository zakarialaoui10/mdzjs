import { transpileMDZ } from "../transpiler/index.js";

export default function esbuildMDZ({ extensions = [".mdx"], useVanJs = false } = {}) {
  return {
    name: 'esbuild-mdz',
    setup(build) {
      extensions.forEach(ext => {
        build.onLoad({ filter: new RegExp(`\\${ext}$`) }, async (args) => {
          const fs = await import('fs/promises');
          const src = await fs.readFile(args.path, 'utf8');
          const code = transpileMDZ(src, useVanJs);
          return {
            contents: code,
            loader: 'js',
          };
        });
      });

      build.onLoad({ filter: /\.mdz$/ }, async (args) => {
        const fs = await import('fs/promises');
        const src = await fs.readFile(args.path, 'utf8');
        const code = transpileMDZ(src, useVanJs);
        return {
          contents: code,
          loader: 'js',
        };
      });
    },
  };
}
