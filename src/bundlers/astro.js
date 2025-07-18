import ViteMdzjs from "./vite.js";
const astroMdzjs = () => ({
    name: "astro-mdzjs",
    hooks: {
        "astro:config:setup": async ({ updateConfig }) => {
          updateConfig({
            vite : {
              plugins : [
                ViteMdzjs()
              ]
            }
          })
        },
    },
});
export default astroMdzjs;
