import { transpileMDZ } from "../../transpiler/index.js";

export default function ViteMDZ({ extensions = [".mdx"], plugins } = {}) {
  return {
    name: "mdz-loader",
    async transform(src, id) {
      if (id.endsWith(".mdz") || extensions.some((ext) => id.endsWith(ext))) {
        const code = await transpileMDZ(src, {plugins});
        return {
          code,
          map: null,
        };
      }
    },

    handleHotUpdate({ file, server }) {
      if (file.endsWith(".mdz")) {
        server.ws.send({
          type: "custom",
          event: "custom-update",
          data: {
            file,
            timestamp: Date.now(),
          },
        });

        return [file];
      }
    },
  };
}
