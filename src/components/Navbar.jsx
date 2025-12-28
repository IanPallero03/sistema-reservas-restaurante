import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar({ adminUser }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 👉 Función para scroll suave con offset del header
  const scrollWithOffset = (id) => {
    const el = document.getElementById(id);
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    const y =
      el.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      10; // margen opcional

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // 👉 Cambia color del navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-500 ${
        scrolled
          ? "backdrop-blur border-emerald-100/10 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
       
     {/* LOGO */}
<div className="
  text-2xl sm:text-3xl md:text-4xl
  font-serif font-light
  text-gray-100 uppercase tracking-wider
  mr-16   /* 👈 SEPARACIÓN DEL MENÚ */
">
  Mi Restaurante
</div>

{/* NAV DESKTOP */}
<ul
  className={`hidden md:flex gap-8 font-light text-[17px] tracking-wide ${
    scrolled ? "text-white" : "text-white"
  }`}
>

          <li>
            <span
              onClick={() => scrollWithOffset("about")}
              className="relative group cursor-pointer"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-100 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </li>

          <li>
            <span
              onClick={() => scrollWithOffset("menu")}
              className="relative group cursor-pointer"
            >
              Menú
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-100 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </li>

          <li>
            <span
              onClick={() => scrollWithOffset("aboutUs")}
              className="relative group cursor-pointer"
            >
              Sobre Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-100 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </li>

          <li>
            <span
              onClick={() => scrollWithOffset("contact")}
              className="relative group cursor-pointer"
            >
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gray-100 transition-all duration-500 group-hover:w-full"></span>
            </span>
          </li>
        </ul>

        {/* ACCIONES DESKTOP */}
<div className="hidden md:flex items-center gap-2 ml-auto">
  {/* BOTÓN RESERVAR */}
  <button
    onClick={() => scrollWithOffset("menu")}
    className="
      bg-emerald-800 text-white px-4 py-2 rounded-lg
      shadow-md shadow-emerald-500/30
      hover:shadow-lg hover:shadow-emerald-500/40
      transition-all duration-300
      cursor-pointer
    "
  >
    Reservar
  </button>

  {/* BOTÓN ADMIN */}
  <button
    onClick={() => (window.location.href = `${import.meta.env.BASE_URL}admin.html`)}
    className="
      flex items-center gap-1
      px-4 py-2
      rounded-lg
      bg-white/20 backdrop-blur-md
      border border-black/20
      text-sm font-medium text-black
      shadow-md shadow-emerald-100/20
      hover:text-white hover:bg-white/30
      transition-all duration-600
      cursor-pointer
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0115 0" />
    </svg>

    {adminUser ? "Admin" : "Admin"}
  </button>
  
</div>


        {/* BOTÓN HAMBURGUESA */}
<button
  className="md:hidden flex flex-col gap-[6px] z-50"
  onClick={() => setOpen(!open)}
>

  {/* Línea 1 */}
  <span
    className={`h-[3px] w-8 bg-white rounded transition-all duration-300
    ${open ? "rotate-45 translate-y-[9px]" : ""}`}
  ></span>

  {/* Línea 2 */}
  <span
    className={`h-[3px] w-8 bg-white rounded transition-all duration-300
    ${open ? "opacity-0" : ""}`}
  ></span>

  {/* Línea 3 */}
  <span
    className={`h-[3px] w-8 bg-white rounded transition-all duration-300
    ${open ? "-rotate-45 -translate-y-[9px]" : ""}`}
  ></span>
</button>
      </nav>

      <div
className={`
md:hidden fixed top-16 left-0 right-0
bg-[#f5e6ca] backdrop-blur-lg
shadow-lg border-b border-gray-300
transition-all duration-300 overflow-hidden
${open ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"}
`}
>
<ul className="flex flex-col items-start gap-4 py-6 px-6 text-gray-700 font-medium">

  <li className="group">
    <span
      onClick={() => {
        scrollWithOffset("about");
        setOpen(false);
      }}
      className="cursor-pointer transition text-lg group-hover:text-emerald-700 pl-0 group-hover:pl-2"
    >
      Inicio
    </span>

    <div className="h-[2px] w-0 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
  </li>

  <li className="group">
    <span
      onClick={() => {
        scrollWithOffset("menu");
        setOpen(false);
      }}
      className="cursor-pointer transition text-lg group-hover:text-emerald-700 pl-0 group-hover:pl-2"
    >
      Menú
    </span>

    <div className="h-[2px] w-0 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
  </li>

  <li className="group">
    <span
      onClick={() => {
        scrollWithOffset("contact");
        setOpen(false);
      }}
      className="cursor-pointer transition text-lg group-hover:text-emerald-700 pl-0 group-hover:pl-2"
    >
      Contacto
    </span>

    <div className="h-[2px] w-0 bg-emerald-700 transition-all duration-300 group-hover:w-full"></div>
  </li>

  <li>
  
    <button
      onClick={() => {
        scrollWithOffset("menu");
        setOpen(false);
      }}
      className="bg-emerald-700 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600 transition"
    >
      Reservar
    </button>
  </li>

  <li>
  <button
    onClick={() => {
      window.location.href = "/admin";
      setOpen(false);
    }}
    className="
    flex items-center gap-1
    px-4 py-2
    rounded-lg
    bg-white/20 backdrop-blur-md
    border border-black/20
    text-sm font-medium text-black
    shadow-md shadow-emerald-100/20
    hover:text-white hover:bg-white/30
    transition-all duration-600
    cursor-pointer
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25a7.5 7.5 0 0115 0" />
    </svg>

    Admin
  </button>
</li>

</ul>

          
        </div>
      
    </motion.header>
  );
}
