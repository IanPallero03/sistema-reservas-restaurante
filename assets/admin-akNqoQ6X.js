import{j as e,r as n,b as p,m,i as g,A as f,R as b,n as j}from"./AdminPanel-CIQgiSMq.js";function y({email:t,setEmail:l,password:o,setPassword:i,loginAdmin:s,authError:a}){return e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[#f5e6ca] px-4",children:e.jsxs("form",{onSubmit:s,className:`\r
            w-full max-w-sm\r
            bg-white\r
            p-8\r
            rounded-2xl\r
            shadow-xl\r
            space-y-6\r
            border border-emerald-100\r
          `,children:[e.jsxs("div",{className:"text-center space-y-1",children:[e.jsx("h2",{className:"text-2xl font-serif text-emerald-900",children:"Panel Administrador"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Acceso exclusivo"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-sm text-gray-600",children:"Email"}),e.jsx("input",{type:"email",placeholder:"admin@email.com",value:t,onChange:r=>l(r.target.value),className:`\r
                w-full px-4 py-3\r
                border rounded-lg\r
                outline-none\r
                focus:ring-2 focus:ring-emerald-700\r
                focus:border-emerald-700\r
                transition\r
              `,required:!0})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-sm text-gray-600",children:"Contraseña"}),e.jsx("input",{type:"password",placeholder:"••••••••",value:o,onChange:r=>i(r.target.value),className:`\r
                w-full px-4 py-3\r
                border rounded-lg\r
                outline-none\r
                focus:ring-2 focus:ring-emerald-700\r
                focus:border-emerald-700\r
                transition\r
              `,required:!0})]}),a&&e.jsx("div",{className:"bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center",children:a}),e.jsx("button",{type:"submit",className:`\r
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
            `,children:"← Volver al sitio"}),e.jsx("p",{className:"text-xs text-gray-400 text-center pt-2",children:"Sistema interno · Mi Restaurante"})]})})}function w(){const[t,l]=n.useState(null),[o,i]=n.useState(!0),[s,a]=n.useState(""),[r,u]=n.useState(""),[x,c]=n.useState("");return n.useEffect(()=>{const d=p(m,h=>{l(h),i(!1)});return()=>d()},[]),o?e.jsx("p",{style:{padding:40},children:"Cargando admin..."}):t?e.jsx(f,{adminUser:t}):e.jsx(y,{email:s,setEmail:a,password:r,setPassword:u,error:x,onSubmit:async d=>{d.preventDefault(),c("");try{await g(m,s,r)}catch{c("Email o contraseña incorrectos")}}})}b.createRoot(document.getElementById("root")).render(e.jsx(j.StrictMode,{children:e.jsx(w,{})}));
