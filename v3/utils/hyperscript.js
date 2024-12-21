export const hyperscript = (tag, attrs, children="") => {
    const HasChildren = !!children;
    return `h("${tag}", ${attrs}${HasChildren ?`, ${children}` : ""})`
}