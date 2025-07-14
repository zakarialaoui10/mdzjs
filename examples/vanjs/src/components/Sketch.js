import { P5Canvas2D, P5Circle } from "p5.wrapper/van";
import { cos, sin, PI } from "ziko";

const c1 = P5Circle({ r : 40})
             .fill("blue")
             .stroke("green");
const c2 = P5Circle({x:0, y:0, r:50})
             .fill("darkblue")
             .stroke("green");
             
const Canvas = () => P5Canvas2D(c1, c2)
  .style({
    outline : "2px darkblue solid",
    margin : "50px auto"
  })
  .size("250px", "250px")
  .view(-100, -100, 100, 100)
  .setCustomLoopCallback(e => {
    c1.posX(75 * cos((e.iter * PI) / 50));
    c1.posY(75 * sin((e.iter * PI) / 50));
    c2.setRadius(20*(1.5+cos(e.iter * PI/50)))
  });

export default Canvas
