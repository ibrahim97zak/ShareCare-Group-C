import{r as l,j as o,a as c}from"./index-BMzkFxf0.js";const h=({activeItems:n,user:t})=>{const[a,r]=l.useState(n);l.useEffect(()=>{r(n)},[n]);const d=async e=>{try{const s=await c.delete(`/api/donations/${e}`);console.log(s.data),alert("successfully deleted"),r(a.filter(i=>i.id!==e))}catch(s){console.error("Error deleting item:",s)}};return o.jsxs("div",{children:[o.jsxs("h2",{className:"text-lg font-bold mb-4",children:["Active ",t.role==="Donor"?"Offers":t.role==="Beneficiary"?"Requests":"Offers and Requests"]}),o.jsx("ul",{children:n.map((e,s)=>o.jsxs("li",{className:"bg-white p-4 rounded-lg shadow-md mb-4",children:[console.log("id",e._id),o.jsx("h3",{className:"text-lg font-bold",children:e.donationType}),o.jsx("p",{children:e.description}),t.role==="Admin"&&o.jsx("p",{className:"text-green-600 font-bold",children:e.donationRole}),o.jsxs("p",{children:["Location: ",e.location]}),o.jsxs("p",{children:["Quantity: ",e.quantity]}),e.receivedQuantity>=0&&o.jsxs("p",{children:["Received Quantity: ",e.receivedQuantity]}),o.jsx("button",{className:"mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700",onClick:()=>d(e._id),children:"Delete"})]},s))})]})};export{h as default};
