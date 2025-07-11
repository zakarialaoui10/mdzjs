export const Dom=({text, color})=>{
    const element = document.createElement("p")
    element.innerText = text;
    element.style.color = color;
    return element;
}