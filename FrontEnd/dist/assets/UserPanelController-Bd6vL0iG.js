import{r as a,j as e}from"./index-CYZ4GPnw.js";import{a as c}from"./axios-CCb-kr4I.js";const d="http://localhost:5000",m=()=>{const[r,o]=a.useState([]),[n,i]=a.useState(!0);a.useEffect(()=>{async function l(){try{const s=await c.get(`${d}/api/users/`);o(s.data),i(!1)}catch(s){console.log(s)}}l()},[]);const h=l=>{const s=localStorage.getItem("authToken");c.delete(`${d}/api/users/${l}`,{headers:{Authorization:`Bearer ${s}`}}).then(t=>{alert("Successfully Deleted")}).catch(t=>console.log(t))};return e.jsxs("div",{className:"user-panel-controller p-1",children:[e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"table-auto w-full text-sm text-left text-gray-500 rounded-lg shadow-md mb-4",children:[e.jsx("thead",{className:"text-xs text-gray-700 uppercase bg-gray-200 rounded-lg shadow-md",children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",className:"px-4 py-3",children:"Name"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden md:table-cell",children:"Username"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden sm:table-cell",children:"Email"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden lg:table-cell",children:"Location"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden lg:table-cell",children:"User Type"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden xl:table-cell",children:"Phone"}),e.jsx("th",{scope:"col",className:"px-4 py-3 hidden xl:table-cell",children:"Gender"}),e.jsx("th",{scope:"col",className:"px-4 py-3 whitespace-nowrap",children:"Actions"})]})}),e.jsx("tbody",{children:r.map(l=>e.jsxs("tr",{className:"bg-white border-b dark:bg-slate-100 dark:border-gray-700",children:[e.jsx("td",{className:"px-4 py-4",children:l.name}),e.jsx("td",{className:"px-4 py-4 hidden md:table-cell",children:l.userName}),e.jsx("td",{className:"px-4 py-4 hidden sm:table-cell",children:l.email}),e.jsx("td",{className:"px-4 py-4 hidden lg:table-cell",children:l.location}),e.jsx("td",{className:"px-4 py-4 hidden lg:table-cell",children:l.role}),e.jsx("td",{className:"px-4 py-4 hidden xl:table-cell",children:l.phone}),e.jsx("td",{className:"px-4 py-4 hidden xl:table-cell",children:l.gender}),e.jsx("td",{className:"px-4 py-4 whitespace-nowrap",children:e.jsx("button",{onClick:()=>h(l._id),className:`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${l.role==="Admin"?"bg-gray-300 cursor-not-allowed hover:bg-gray-300":""}`,disabled:l.role==="Admin",children:"Delete"})})]},l._id))})]})}),n&&e.jsx("p",{className:"text-gray-500 dark:text-gray-400",children:"Loading..."})]})};export{d as ApiUrl,m as default};
