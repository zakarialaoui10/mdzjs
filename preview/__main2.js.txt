// globalThis.S=SPA({
//    target : document.querySelector("#app"),
//    wrapper : Section().style({
//       display : "flex",
//       justifyContent: "center",
//       alignItems : "center",
//       height : "100vh"
//    }),
//    routes:{
//       "/":()=>text("Hello world"),
//       "/id/:id":async ({id})=>{
//          let resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
//          let data = await resp.json()
//          return Flex(
//             text(data.title)
//          )
//       },
//       "/users/:user":async ({user})=>{
//          let resp = await fetch(`https://api.github.com/users/${user}`)
//          const {name,followers,public_repos, avatar_url}= await resp.json()
//          // console.log({name, followers, public_repos, avatar_url})
//          useTitle(name)
//          useFavIcon(avatar_url)
//          const Card = Flex(
//            text(name).style({
//             color : "darkblue",
//             fontSize : "1.4rem",
//             border : "2px darkblue solid",
//             padding : "10px",
//             background:"tomato"
//            }),
//            image(avatar_url).size("200px","auto").style({outline : "2px darkblue solid"}),
//            Flex(
//             text(`N° followers : ${followers}`),
//             text(`N° repos : ${public_repos}`)
//            ).horizontal("space-around",0).size("80%","auto").style({
//             color : "darkblue",
//             border : "2px darkblue solid",
//             padding : "10px",
//             background:"tomato"
//            })
//          ).size("400px","400px").vertical(0,"space-around").style({
//             border : "2px darkblue solid",
//             background : "coral"
//          })
//          return Card
//       },
//    }
// })
