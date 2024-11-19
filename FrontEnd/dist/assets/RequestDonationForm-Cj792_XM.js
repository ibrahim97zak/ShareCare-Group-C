import{j as e,u as q,r as l,a as D}from"./index--yLj51bn.js";import{L as w}from"./LocationSelect-D-4fDPvx.js";import{J as u,I as g}from"./joi-browser.min-cUeixLxY.js";import{A as F,a as k}from"./ApiConfigUrl-DAZoxYJA.js";import{S as y}from"./sweetalert2.all-xLGnaaWx.js";const E=[{value:"clothes",label:"Clothes"},{value:"food",label:"Food"},{value:"money",label:"Money"},{value:"medicines",label:"Medicines"},{value:"books",label:"Books"},{value:"furniture",label:"Furniture"}],B=({value:a,onChange:s})=>e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-medium mb-2",htmlFor:"donationCategory",children:"Donation Category:"}),e.jsxs("select",{className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",value:a,onChange:s,children:[e.jsx("option",{value:"",children:"Select Donation Category"}),E.map(r=>e.jsx("option",{value:r.value,children:r.label},r.value))]})]}),A=u.object({donationCategory:u.string().required().valid("clothes","food","money","medicines","books","furniture"),description:u.string().required().min(10).max(200),location:u.string().required()}),R=()=>{const{user:a}=q(),[s,r]=l.useState(""),[d,b]=l.useState(""),[i,f]=l.useState(0),[m,v]=l.useState(""),[o,x]=l.useState({}),j=D(),N=async t=>{t.preventDefault();const{error:p}=A.validate({donationCategory:s,description:d,location:m});if(p){x(p.details.reduce((n,h)=>(n[h.path]=h.message,n),{}));return}if(isNaN(i)||i<=0){x({quantity:"Please enter a valid quantity"});return}const c={userId:a._id,donationType:s,location:m,description:d};a.role,c.quantity=i,console.log(c);const S=`${F}/api/donations/${a.role==="Beneficiary"?"request":"offer"}`;try{const n=await k.post(S,c);console.log(n.data),y.fire({icon:"success",title:"Donation Form Submitted Successfully!",text:"Your donation form has been submitted successfully."})}catch(n){console.error(n),y.fire({icon:"error",title:"Error Submitting Donation Form",text:"An error occurred while submitting your donation form."})}},C=()=>{j("/")};return e.jsx("div",{className:"min-h-screen flex justify-center items-center bg-gray-100 p-4 mt-12",children:e.jsxs("div",{className:"max-w-lg w-full bg-white p-6 rounded-lg shadow-md",children:[e.jsx("h2",{className:"text-2xl font-bold text-green-600 mb-6 ",children:"Donation Form"}),e.jsxs("form",{onSubmit:N,className:"space-y-4",children:[e.jsx(B,{value:s,onChange:t=>r(t.target.value)}),o.donationCategory&&e.jsx("p",{className:"text-red-500 text-sm",children:o.donationCategory}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-medium mb-2",htmlFor:"description",children:"Description:"}),e.jsx(g,{type:"textarea",placeholder:"Enter description",value:d,onChange:t=>b(t.target.value)}),o.description&&e.jsx("p",{className:"text-red-500 text-sm",children:o.description})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-gray-700 font-medium mb-2",htmlFor:"quantity",children:a.role==="Beneficiary"?"Goal Amount":"Quantity"}),e.jsx(g,{type:"number",placeholder:a.role==="Beneficiary"?"Enter goal amount":"Enter quantity",value:i,onChange:t=>f(parseInt(t.target.value,10))}),o.quantity&&e.jsx("p",{className:"text-red-500 text-sm",children:o.quantity})]}),e.jsx(w,{value:m,onChange:t=>v(t.target.value)}),o.location&&e.jsx("p",{className:"text-red-500 text-sm",children:o.location}),e.jsx("button",{type:"submit",className:"bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-5",children:"Submit"}),e.jsx("button",{type:"button",onClick:C,className:"bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded",children:"Cancel"})]})]})})};export{R as default};
