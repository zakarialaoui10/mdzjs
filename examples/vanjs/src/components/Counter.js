import van from "vanjs-core";

const Counter = ({counter_start = 10}={}) => {
  const { button, div } = van.tags;
  const counter = van.state(counter_start);
  return (
    div(
      {class : "counter"},
      button({ onclick: () => ++counter.val }, "Counter: ", counter),
    )
  );
};
export default Counter;
