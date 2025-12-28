import{r as t,g as k,d as g,e as l,a as y,q as E,o as S,c as C,j as e,u as w,k as R,l as D,m as L,b as M,n as A,p as q,R as P,t as H}from"./config-DI-Qb_hU.js";function B({adminUser:i}){const[c,x]=t.useState([]),[u,m]=t.useState(!0),[n,a]=t.useState(!0),b=k(),j=async()=>{try{await R(b)}catch(r){console.error("Error al cerrar sesión:",r)}},f=()=>{const r=new Date,s=r.getDay(),o=s===0?-6:1-s,d=new Date(r);return d.setDate(r.getDate()+o),d.setHours(0,0,0,0),d},h=async()=>{if(!window.confirm(`⚠️ ¿Seguro que querés eliminar las reservas de semanas anteriores?
Esta acción no se puede deshacer.`))return;const s=f(),o=await D(C(l,"reservas"));let d=0;for(const p of o.docs){const v=p.data();if(!v.date)continue;const N=new Date(v.date);N.setHours(0,0,0,0),N<s&&(await L(g(l,"reservas",p.id)),d++)}alert(`✅ Se eliminaron ${d} reservas anteriores.`)};return t.useEffect(()=>{const r=g(l,"config","general"),s=y(r,o=>{o.exists()&&a(o.data().estado)});return()=>s()},[]),t.useEffect(()=>{if(!i)return;const r=E(C(l,"reservas"),S("createdAt","desc")),s=y(r,o=>{const d=o.docs.map(p=>({id:p.id,...p.data()}));x(d),m(!1)});return()=>s()},[i]),e.jsxs("div",{className:"min-h-screen bg-[#f5e6ca] p-8",children:[e.jsx("h1",{className:"text-3xl font-serif text-emerald-900 mb-6",children:"Panel de Reservas"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("button",{onClick:()=>window.location.href="/sistema-reservas-restaurante/",className:`\r
    flex items-center gap-2\r
    px-4 py-2\r
    rounded-lg\r
    bg-white\r
    border border-emerald-800\r
    text-emerald-800 text-sm font-medium\r
    shadow-sm\r
    hover:bg-emerald-800\r
    hover:text-white\r
    transition-all\r
    duration-300\r
    cursor-pointer\r
    mb-5\r
  `,children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"1.8",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"})}),"Volver al sitio"]}),e.jsxs("button",{onClick:j,className:`\r
    flex items-center gap-2\r
    px-4 py-2\r
    rounded-lg\r
    bg-red-600 text-white\r
    border border-emerald-800\r
    text-emerald-800 text-sm font-medium\r
    shadow-sm\r
    hover:bg-red-700\r
    hover:text-white\r
    transition-all\r
    duration-300\r
    cursor-pointer\r
    mb-5\r
    `,children:[e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"1.8",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M18 12H9m0 0l3-3m-3 3l3 3"})]}),"Cerrar sesión"]})]}),e.jsxs("div",{className:"mb-8 flex items-center justify-between bg-white p-5 rounded-xl shadow",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-serif text-lg text-emerald-900",children:"Reservas generales"}),e.jsx("p",{className:`text-sm ${n?"text-emerald-700":"text-red-600"}`,children:n?"ABIERTAS":"CERRADAS"})]}),e.jsx("button",{onClick:async()=>{const r=g(l,"config","general");await w(r,{estado:!n})},className:`px-5 py-2 rounded-lg text-white transition cursor-pointer
      ${n?"bg-red-600 hover:bg-red-700":"bg-emerald-700 hover:bg-emerald-600"}
    `,children:n?"Cerrar reservas":"Abrir reservas"})]}),e.jsxs("div",{className:"mb-8 flex items-center justify-between bg-white p-5 rounded-xl shadow",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-serif text-lg text-emerald-900",children:"Mantenimiento"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Eliminar reservas antiguas"})]}),e.jsx("button",{onClick:h,className:`\r
      px-5 py-2\r
      rounded-lg\r
      bg-red-100\r
      text-red-700\r
      border border-red-300\r
      hover:bg-red-600\r
      hover:text-white\r
      transition\r
      cursor-pointer\r
    `,children:"🗑️ Eliminar"})]}),u?e.jsx("p",{children:"Cargando reservas..."}):c.length===0?e.jsx("p",{children:"No hay reservas aún"}):e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full bg-white rounded-lg shadow",children:[e.jsx("thead",{className:"bg-emerald-800 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3 text-left",children:"Nombre"}),e.jsx("th",{className:"p-3",children:"Fecha"}),e.jsx("th",{className:"p-3",children:"Hora"}),e.jsx("th",{className:"p-3",children:"Personas"}),e.jsx("th",{className:"p-3",children:"Teléfono"}),e.jsx("th",{className:"p-3",children:"Estado"}),e.jsx("th",{className:"p-3",children:"Acciones"})]})}),e.jsx("tbody",{children:c.map(r=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3",children:r.name}),e.jsx("td",{className:"p-3 text-center",children:r.date}),e.jsx("td",{className:"p-3 text-center",children:r.time}),e.jsx("td",{className:"p-3 text-center",children:r.people}),e.jsx("td",{className:"p-3 text-center",children:r.phone}),e.jsx("td",{className:"p-3 text-center",children:e.jsx("span",{className:`px-2 py-1 rounded text-sm font-medium
      ${r.status==="confirmed"?"bg-emerald-100 text-emerald-800":r.status==="cancelled"?"bg-red-100 text-red-700":"bg-yellow-100 text-yellow-800"}
    `,children:r.status==="pending"?"Pendiente":r.status==="confirmed"?"Confirmada":"Cancelada"})}),e.jsx("td",{className:"p-3 text-center",children:e.jsxs("div",{className:"flex flex-col sm:flex-row gap-2 justify-center",children:[(r.status==="pending"||r.status==="cancelled")&&e.jsx("button",{onClick:async()=>{const s=g(l,"reservas",r.id);await w(s,{status:"confirmed"})},className:` px-3 py-1\r
      rounded\r
      text-xs sm:text-sm\r
      font-medium\r
      border border-emerald-700\r
      text-emerald-700\r
      hover:bg-emerald-700 hover:text-white\r
      transition\r
      cursor-pointer`,children:"Confirmar"}),(r.status==="pending"||r.status==="confirmed")&&e.jsx("button",{onClick:async()=>{const s=g(l,"reservas",r.id);await w(s,{status:"cancelled"})},className:` px-3 py-1\r
      rounded\r
      text-xs sm:text-sm\r
      font-medium\r
      border border-red-600\r
      text-red-600\r
      hover:bg-red-600 hover:text-white\r
      transition cursor-pointer`,children:"Cancelar"})]})})]},r.id))})]})})]})}function I({email:i,setEmail:c,password:x,setPassword:u,onSubmit:m,error:n}){return e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[#f5e6ca] px-4",children:e.jsxs("form",{onSubmit:m,className:`\r
            w-full max-w-sm\r
            bg-white\r
            p-8\r
            rounded-2xl\r
            shadow-xl\r
            space-y-6\r
            border border-emerald-100\r
          `,children:[e.jsxs("div",{className:"text-center space-y-1",children:[e.jsx("h2",{className:"text-2xl font-serif text-emerald-900",children:"Panel Administrador"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Acceso exclusivo"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-sm text-gray-600",children:"Email"}),e.jsx("input",{type:"email",placeholder:"admin@email.com",value:i,onChange:a=>c(a.target.value),className:`\r
                w-full px-4 py-3\r
                border rounded-lg\r
                outline-none\r
                focus:ring-2 focus:ring-emerald-700\r
                focus:border-emerald-700\r
                transition\r
              `,required:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-sm text-gray-600",children:"Contraseña"}),e.jsx("input",{type:"password",placeholder:"••••••••",value:x,onChange:a=>u(a.target.value),className:`\r
                w-full px-4 py-3\r
                border rounded-lg\r
                outline-none\r
                focus:ring-2 focus:ring-emerald-700\r
                focus:border-emerald-700\r
                transition\r
              `,required:!0})]}),n&&e.jsx("div",{className:"bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center",children:n}),e.jsx("button",{type:"submit",className:`\r
              w-full\r
              bg-emerald-800\r
              text-white\r
              py-3\r
              rounded-lg\r
              font-medium\r
              hover:bg-emerald-700\r
              transition\r
              shadow-md\r
              shadow-emerald-800/20\r
              cursor-pointer\r
            `,children:"Ingresar"}),e.jsx("button",{type:"button",onClick:()=>window.location.href="/sistema-reservas-restaurante/",className:`\r
              w-full\r
              flex items-center justify-center gap-2\r
              py-2\r
              rounded-lg\r
              bg-white\r
              border border-emerald-800\r
              text-emerald-800 text-sm font-medium\r
              hover:bg-emerald-800\r
              hover:text-white\r
              transition-all\r
              duration-300\r
              cursor-pointer\r
            `,children:"← Volver al sitio"}),e.jsx("p",{className:"text-xs text-gray-400 text-center pt-2",children:"Sistema interno · Mi Restaurante"})]})})}function V(){const[i,c]=t.useState(null),[x,u]=t.useState(!0),[m,n]=t.useState(""),[a,b]=t.useState(""),[j,f]=t.useState("");return t.useEffect(()=>{const h=M(A,r=>{c(r),u(!1)});return()=>h()},[]),x?e.jsx("p",{style:{padding:40},children:"Cargando admin..."}):i?e.jsx(B,{adminUser:i}):e.jsx(I,{email:m,setEmail:n,password:a,setPassword:b,error:j,onSubmit:async h=>{h.preventDefault(),f("");try{await q(A,m,a)}catch{f("Email o contraseña incorrectos")}}})}P.createRoot(document.getElementById("root")).render(e.jsx(H.StrictMode,{children:e.jsx(V,{})}));
