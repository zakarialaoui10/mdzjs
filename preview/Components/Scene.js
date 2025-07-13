import {SceneGl, cube3} from "ziko-gl"
import { LottiePlayer } from "ziko-lottie"
import {Flex} from "ziko"
export default ({data})=>{
    return LottiePlayer().size("200px","200px").useControls()
    let element = SceneGl("200px","200px").add(
        cube3(1)
    )
    return Flex().append(element)
}