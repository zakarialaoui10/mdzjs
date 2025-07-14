import van from "vanjs-core";
import "./App.css";
import Blog ,{title} from "./blog/test.mdx";
console.log({title})

export const App = () => {
  const { div, h1, img, p, a } = van.tags;
  return div(
    Blog({
      counter_start : 19,
      name : "cyan", 
      __code_style__ : "1c-light"
    }).vertical(-1, -1),
    // a(
    //   { href: "https://vite.dev", target: "_blank" },
    //   img({
    //     src: "/vite.svg",
    //     class: "logo",
    //     alt: "Vite logo",
    //     width: 96,
    //     height: 96,
    //   }),
    // ),
    // a(
    //   { href: "https://vanjs.org", target: "_blank" },
    //   img({
    //     src: "/vanjs.svg",
    //     class: "logo vanjs",
    //     alt: "VanJS logo",
    //     width: 96,
    //     height: 96,
    //   }),
    // ),
    // h1(
    //   "Hello VanJS!",
    // ),
    // div({ class: "card" }, Counter()),
    // p({ class: "read-the-docs" }, "Click on the VanJS logo to learn more"),
  );
};

const root = document.getElementById("app");

van.add(root, App());
