import {SceneGl, cube3} from "ziko-gl"
export default ()=>{
    return SceneGl("200px","200px").add(
        cube3(1)
    )
}