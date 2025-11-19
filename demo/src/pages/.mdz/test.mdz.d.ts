import { UIElement } from "ziko"
export const title: string[]
export const count: number
export const tags: string[]

// export interface Props {
//   background: string
//   color: string
//   count: number
// }

// declare const Component: (props?: Props) => UIElement

// const Component = (props?: Record<string, any>) => UIElement

declare const UI: (props: {
  background: string
  color: string
  count: number
  tags: string[]
}) => UIElement
export default UI

export default Component