import van from "vanjs-core";

const Counter = ({start = 10}={}) => {
  const { button, div } = van.tags;
  const counter = van.state(start);
  return (
    div(
      {class : "counter"},
      button({ onclick: () => ++counter.val }, "Counter: ", counter),
    )
  );
};
export default Counter;
