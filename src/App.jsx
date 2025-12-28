import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";
import Navbar from "./components/Navbar";
import { db } from "./firebase/config";
import AdminPanel from "./AdminPanel";

import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  getDoc,
  setDoc,
  runTransaction

} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
const auth = getAuth();

   // ✅ SECCION SIN CUPO CUANDO ENTRAN MAS DE 2 PERSONAS AL MISMO TIEMPO

// dentro de App(), antes del return

const reservarConTransaccion = async (formData) => {
  const refDia = doc(db, "reservasPorDia", formData.date);
  const reservasRef = collection(db, "reservas");

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(refDia);

      if (!snap.exists()) {
        throw new Error("El día no existe");
      }

      const dataDia = snap.data();
      const nuevasPersonas =
        Number(dataDia.personasReservadas) + Number(formData.people);

      // ⛔ SIN CUPO
      if (dataDia.cerrado || nuevasPersonas > dataDia.capacidadTotal) {
        throw new Error("SIN_CUPO");
      }

      // ✅ Actualizar día
      transaction.update(refDia, {
        personasReservadas: nuevasPersonas,
        cerrado: nuevasPersonas >= dataDia.capacidadTotal,
      });

      // ✅ Crear reserva
      const nuevaReservaRef = doc(reservasRef);
      transaction.set(nuevaReservaRef, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        people: Number(formData.people),
        date: formData.date,
        time: formData.time,
        status: "pending",
        createdAt: new Date(),
      });
    });

    return { ok: true };
  } catch (err) {
    if (err.message === "SIN_CUPO") {
      return { ok: false, error: "SIN_CUPO" };
    }

    console.error("Error en transacción:", err);
    return { ok: false, error: "ERROR" };
  }
};

   // ✅ SECCION LIMITE DE 1 SEMANA
const getMondayOfCurrentWeek = () => {
  const today = new Date();
  const day = today.getDay(); // 0 (domingo) - 6 (sábado)
  const diff = day === 0 ? -6 : 1 - day; // ajusta al lunes
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
};

   // ✅ SECCION INICIO DE SESION DE ADMIN LOGIN
function AdminLogin({ email, setEmail, password, setPassword, loginAdmin, authError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e6ca] px-4">
    <form
      onSubmit={loginAdmin}
      className="
        w-full max-w-sm
        bg-white
        p-8
        rounded-2xl
        shadow-xl
        space-y-6
        border border-emerald-100
      "
    >
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-serif text-emerald-900">
          Panel Administrador
        </h2>
        <p className="text-sm text-gray-500">
          Acceso exclusivo
        </p>
      </div>
  
      {/* EMAIL */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Email
        </label>
        <input
          type="email"
          placeholder="admin@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full px-4 py-3
            border rounded-lg
            outline-none
            focus:ring-2 focus:ring-emerald-700
            focus:border-emerald-700
            transition
          "
          required
        />
      </div>
  
      {/* PASSWORD */}
      <div className="space-y-1">
        <label className="text-sm text-gray-600">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full px-4 py-3
            border rounded-lg
            outline-none
            focus:ring-2 focus:ring-emerald-700
            focus:border-emerald-700
            transition
          "
          required
        />
      </div>
  
      {/* ERROR */}
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg text-center">
          {authError}
        </div>
      )}
  
      {/* BUTTON */}
      <button
        type="submit"
        className="
          w-full
          bg-emerald-800
          text-white
          py-3
          rounded-lg
          font-medium
          hover:bg-emerald-700
          transition
          shadow-md
          shadow-emerald-800/20
          cursor-pointer
        "
      >
        Ingresar
      </button>
      <button
onClick={() => (window.location.href = "/")}
className="
  flex items-center gap-3
  px-25 py-2
  rounded-lg
  bg-white
  border border-emerald-800
  text-emerald-800 text-sm font-medium
  shadow-sm
  hover:bg-emerald-800
  hover:text-white
  transition-all
  duration-300
  cursor-pointer
  mb-5
"
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="1.8"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
  />
</svg>
Volver al sitio
</button>
  
      {/* FOOTER */}
      <p className="text-xs text-gray-400 text-center pt-2">
        Sistema interno · Mi Restaurante
      </p>
    </form>
  </div>
  
  );
}

// ✅ SECCION CAROUSEL
function App() {
// ✅ PRIMERO las imágenes
const images = [
  `${import.meta.env.BASE_URL}images/fondo1.webp`,
  `${import.meta.env.BASE_URL}images/fondo2.webp`,
  `${import.meta.env.BASE_URL}images/fondo3.webp`,
];

// ✅ DESPUÉS el preload
useEffect(() => {
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}, [images]);

  
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [closingReserve, setClosingReserve] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    people: "",
  });
  const [errors, setErrors] = useState({});
  const [reservasHabilitadas, setReservasHabilitadas] = useState(true);
  const [estadoReservas, setEstadoReservas] = useState(null);
  const [estadoDia, setEstadoDia] = useState(null);
  const [errorSemana, setErrorSemana] = useState(null);
  const lugaresDisponibles =
  estadoDia
    ? estadoDia.capacidadTotal - estadoDia.personasReservadas
    : null;
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const path = window.location.pathname;
  const isAdminRoute = path.startsWith("/admin");
 
  // ✅ SECCION PANEL DE ADMINISTRADOR/CARGA DE RESERVAS
useEffect(() => {
  if (!adminUser) return;

  const q = query(
    collection(db, "reservas"),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReservas(data);
    setLoadingReservas(false);
  });

  return () => unsub();
}, [adminUser]);

  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH USER:", user);
      setAdminUser(user);
      setAuthLoading(false);
    });
  
    return () => unsub();
  }, []);
  
  
// ✅ SECCION CONTRASEÑA INCORRECTOS
  const loginAdmin = async (e) => {
    e.preventDefault();
    setAuthError("");
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError("Email o contraseña incorrectos");
    }
  };
  
  // ✅ SECCION CREAR ESTADO DEL DIA PARA FIREBASE
  const cargarEstadoDelDia = async (fecha) => {
    if (!fecha) return;
  
    const refDia = doc(db, "reservasPorDia", fecha);
    const snap = await getDoc(refDia);
  
    // 🟢 Si el día NO existe, lo creamos
    if (!snap.exists()) {
      const nuevoDia = {
        fecha,
        personasReservadas: 0,
        capacidadTotal: 60,
        cerrado: false,
      };
  
      await setDoc(refDia, nuevoDia);
      setEstadoDia(nuevoDia);
    } 
    // 🟡 Si ya existe, lo usamos
    else {
      setEstadoDia(snap.data());
    }
  };
  
  useEffect(() => {
    if (formData.date) {
      cargarEstadoDelDia(formData.date);
    }
  }, [formData.date]);
  
  // Escuchar config/reservasEstado en tiempo real
  useEffect(() => {
    const ref = doc(db, "config", "reservasEstado");
  
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) return;
  
      const data = snap.data();
  
      // 🔑 1. Guardar estado en React (CLAVE)
      setEstadoReservas(data);
  
      // 🔑 2. Convertir Timestamp → Date
      const semanaGuardada = data.semanaInicio.toDate();
  
      // 🔑 3. Calcular lunes actual
      const today = new Date();
      const mondayActual = new Date(today);
      mondayActual.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      mondayActual.setHours(0, 0, 0, 0);
  
      // 🧪 Logs útiles
      console.log("Semana guardada:", semanaGuardada);
      console.log("Semana actual:", mondayActual);
  
      // 🔄 4. Reset semanal
      if (semanaGuardada.getTime() !== mondayActual.getTime()) {
        console.log("RESET SEMANAL EJECUTADO");
  
        await updateDoc(ref, {
          personasReservadas: 0,
          reservasCerradas: false,
          semanaInicio: mondayActual,
        });
      }
    });
  
    return () => unsub();
  }, []);
  
  
  useEffect(() => {
    const ref = doc(db, "config", "general");
  
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setReservasHabilitadas(snap.data().estado);
      }
    });
  
    return () => unsub();
  }, []);
  

  // ✅ SECCION INTERVALO DE IMAGENES EN CAROUSEL
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000); // 10s (ajustá a lo que quieras)

    return () => clearInterval(interval);
  }, [images.length]);

  // --- bloquear scroll del body cuando esté abierto menu o reserva ---
  useEffect(() => {
    if (menuOpen || reserveOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // limpieza por si el componente se desmonta inesperadamente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, reserveOpen]);

  // --- funciones de abrir / cerrar menú con animación de salida ---
  const openMenu = () => {
    setClosing(false);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setClosing(false);
    }, 300); // debe coincidir con la duración CSS/transition
  };

  // --- funciones abrir / cerrar reserva con animación de salida ---
  const openReserve = () => {
    setClosingReserve(false);
    setReserveOpen(true);
  };

  const closeReserve = () => {
    setClosingReserve(true);
    setTimeout(() => {
      setReserveOpen(false);
      setClosingReserve(false);
    }, 300);
  };

 
  // ✅ SECCION FORMULARIO PARA TOMAR RESERVAS
  const validateForm = () => {
    let newErrors = {};
  
    if (!formData.name.trim()) {
      newErrors.name = "Ingresá tu nombre.";
    }
  
    if (!formData.phone.trim()) {
      newErrors.phone = "Ingresá un teléfono válido.";
    } else if (!/^[0-9\s+-]+$/.test(formData.phone)) {
      newErrors.phone = "El teléfono contiene caracteres inválidos.";
    }
  
    if (!formData.date) {
      newErrors.date = "Seleccioná una fecha.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      // ⚠️ PARSEO CORRECTO DE FECHA LOCAL
      const [year, month, day] = formData.date.split("-");
      const selectedDate = new Date(year, month - 1, day);
      selectedDate.setHours(0, 0, 0, 0);
    
      if (selectedDate < today) {
        newErrors.date = "La fecha no puede ser anterior a hoy.";
      }
    }
    
    if (!formData.people || Number(formData.people) <= 0) {
      newErrors.people = "Ingresá cuántas personas.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // ✅ SECCION FECHA DE SEMANA ACTUAL
  const fechaDentroDeSemanaActual = (fechaStr) => {
    if (!fechaStr) return false;
  
    const fechaSeleccionada = new Date(fechaStr);
    fechaSeleccionada.setHours(0, 0, 0, 0);
  
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
  
    // lunes actual
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  
    // domingo actual
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
  
    return (
      fechaSeleccionada >= lunes &&
      fechaSeleccionada <= domingo
    );
  };
  useEffect(() => {
    if (!formData.date) {
      setErrorSemana(null);
      return;
    }
  
    const esValida = fechaDentroDeSemanaActual(formData.date);
  
    if (!esValida) {
      setErrorSemana("❌ Solo se aceptan reservas para la semana actual.");
      setEstadoDia(null); // importante
    } else {
      setErrorSemana(null);
      cargarEstadoDelDia(formData.date);
    }
  }, [formData.date]);
  
  
// ⏳ mientras Firebase Auth carga
if (authLoading) return null;

// 🔐 ADMIN ROUTES
if (isAdminRoute) {
  if (!adminUser) {
    return (
      <AdminLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginAdmin={loginAdmin}
        authError={authError}
      />
    );
  }

  return (
    <AdminPanel
      adminUser={adminUser}
      onLogout={() => signOut(auth)}
    />
  );
}


// ✅ SECCION RETURN
  return (
    
    <div className="min-h-screen flex flex-col">

  {/* SECCION NAV */}
  <Navbar adminUser={adminUser} />


      <main className="flex-grow">
   <section className="relative text-center h-screen overflow-hidden">

  {/* SECCION SLIDER */}

  <div className="absolute inset-0">
    {images.map((img, index) => (
      <motion.div
      key={index}
      className="absolute inset-0 bg-cover bg-center bg-fixed will-change-transform"
      style={{ backgroundImage: `url(${img})` }}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ 
        opacity: index === current ? 1 : 0,
        scale: index === current ? 1 : 1.1
      }}
      transition={{ duration: 3, ease: "easeInOut" }}
    ></motion.div>
    ))}
  </div>

  {/* Capa oscura */}
  <div className="absolute inset-0 bg-black/40"></div>
 <section id="about"></section>
  {/* Texto alineado a la izquierda */}
  <div className="relative z-10 flex flex-col h-full justify-center items-start px-22 text-left">
    <h1 className="text-4xl text md:text-4xl font-serif font-light text-gray-100 tracking-wild uppercase">
      Donde cada sabor tiene una historia
    </h1>

    <p className="mt-6 text-base md:text-xl font-serif font-light text-gray-100 tracking-wide leading-relaxed max-w-xl">
      Un espacio pensado para disfrutar momentos, compartir risas y saborear lo mejor de la casa.
    </p>
  </div>

  {/* ⬅️ Flecha Izquierda */}
  <button
  onClick={() =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }
  className="absolute left-1 top-1/2 -translate-y-1/2 z-20 
             text-white p-3 cursor-pointer
             hover:scale-110 transition-transform duration-300"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="60" height="60" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
</button>



  {/* ➡️ Flecha Derecha */}
<button
  onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
  className="absolute right-1 top-1/2 -translate-y-1/2 z-20 
             text-white p-3 cursor-pointer
             hover:scale-110 transition-transform duration-300"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="60" height="60" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
</button>

  {/* Puntitos */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
    {images.map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          index === current ? "bg-white" : "bg-white/40"
        }`}
      ></div>
    ))}
  </div>
</section>
      </main>

  {/* --- SECCION SEPARADOR --- */}
  <section className="flex items-center justify-center h-52 bg-[#f5e6ca]">
  <h2 className="text-2xl text-center md:text-3xl font-serif font-light text-[#3a2f2f] tracking-wild uppercase">
  Celebrando la buena vida,
  <br /> a través de comida saludable, todo el año.
</h2>


     {/* SECCION MENU */}

  {/* Línea decorativa suave (opcional) */}
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white/40 rounded-full"></div>
  </section>
<section id="menu"></section>

<section className="relative text-center">
<div
  className="bg-cover bg-center bg-fixed h-screen"
  style={{
    backgroundImage: `url(${import.meta.env.BASE_URL}images/fondo4.webp)`
  }}
>

    {/* Capa semitransparente */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* CONTENIDO PRINCIPAL */}
    <div className="relative z-10 bg-white/10 p-10 rounded-2xl backdrop-blur-md shadow-lg max-w-2xl mx-auto">

      <h1 className="text-5xl md:text-6xl font-serif font-light text-white tracking-wild uppercase drop-shadow-md">
      ¿Querés ver nuestro catálogo?
      </h1>

      <p className="mt-4 text-gray-100 text-lg md:text-xl leading-relaxed font-serif font-light">
        En mi Restaurante te invitamos a disfrutar de una experiencia única: 
        café artesanal, cócteles de autor y platos que despiertan tus sentidos.
      </p>

      {/* BOTONES */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

        {/* ====== BOTÓN PARA ABRIR/CERRAR MENÚ ====== */}
        <button
  onClick={() => setMenuOpen(true)}
  className="bg-emerald-800 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition cursor-pointer"
>
  Ver Menú
</button>


    {/* Botón Reservar */}
    <button
    onClick={openReserve}
    className="bg-transparent border border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer"
    >
    Reservar Mesa
    </button>
      </div>
    </div>
  </div>



  {/* ====== MENÚ DESPLEGABLE DE CARTA ====== */}

  {menuOpen && (
  <div className="fixed inset-0 z-[999]">
    {/* Fondo oscuro */}
    <div
  className={`
    absolute inset-0 backdrop-blur-sm transition-opacity duration-300
    ${closing ? "opacity-0" : "opacity-60 bg-black"}
  `}
  onClick={closeMenu}
></div>

    {/* Contenedor del menú */}
    <div
  className={`
    absolute bottom-0 left-0 right-0 h-[90%]
    bg-[#f5e6ca] rounded-t-3xl shadow-2xl p-10 overflow-y-auto
    transition-all duration-300
    ${closing ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}
  `}
>

      {/* Botón cerrar */}
      <button
  onClick={closeMenu}
  className="cursor-pointer absolute top-5 right-5 text-2xl text-gray-700 hover:text-black"
>
  ✕
</button>

    {/* SECCION CARTA */}

    <h2 className="text-5xl text-center mb-12 font-serif ">Nuestra Carta</h2>

    {/* BEBIDAS */}
    <div className="max-w-5xl mx-auto mb-16">
      <h3 className="text-3xl font-serif font-light mb-6 text-emerald-900">Bebidas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Aperol Spritz</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Refrescante, cítrico, ideal para la tarde.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$4500</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Negroni</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Clásico, amargo y equilibrado.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$5000</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Cynar Julep</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Hierbas, menta fresca y mucho hielo.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$4800</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Gin Tonic</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Refrescante, aromático y balanceado.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$4700</p>
        </div>
      </div>
    </div>

    {/* ENTRADAS */}
    <div className="max-w-5xl mx-auto mb-16">
      <h3 className="text-3xl font-serif font-light mb-6 text-emerald-900">Entradas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Papas Rústicas</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Crocantes, especiadas y con alioli casero.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$3500</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Bruschettas</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Pan tostado, tomate fresco, oliva y albahaca.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$3800</p>
        </div>
      </div>
    </div>

    {/* PLATOS PRINCIPALES */}
    <div className="max-w-5xl mx-auto">
      <h3 className="text-3xl font-serif font-light mb-6 text-emerald-900">Platos Principales</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Hamburguesa Gourmet</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Doble cheddar, cebolla caramelizada y pan brioche.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$6800</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Fettuccine al Pesto</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Pesto casero, nueces y queso reggianito.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$6400</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Ensalada Mediterránea</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Oliva, queso feta, pepino, tomate y limón.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$5200</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
          <h4 className="text-xl font-serif font-light">Tacos de Pollo</h4>
          <p className="text-gray-600 mt-2 font-serif font-light">Salsa criolla, cilantro, lima y especias.</p>
          <p className="mt-3 font-serif font-light text-emerald-800">$6000</p>
        </div>
      </div>
    </div>
    </div>
  </div>
)}

{!reservasHabilitadas && (
  <div className="bg-red-100 text-red-700 text-center py-3 px-4 rounded-lg mb-6 font-serif text-xl shadow">
    ❌ No se pueden tomar reservas por el momento.
  </div>
)}

 {/* ====== SECCION RESERVAS ====== */}
{reserveOpen && (
  
  <div className="fixed inset-0 z-[999]">
    
    {/* Fondo oscuro */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={closeReserve}
    ></div>

    {/* Modal */}
    <div
      className={`
        absolute bottom-0 left-0 right-0 h-auto max-h-[100%]
        bg-[#f5e6ca] rounded-t-3xl shadow-2xl p-10 overflow-y-auto
        transition-all duration-300
        ${closingReserve ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}
      `}
    >
      {/* Botón cerrar */}
      <button
        onClick={closeReserve}
        className="cursor-pointer absolute top-5 right-5 text-2xl text-gray-700 hover:text-black"
      >
        ✕
      </button>
      

      <h2 className="text-4xl text-center mb-8 font-serif">Reservar Mesa</h2>

      {/* FORMULARIO */}
     {/* TOAST CONFIRMACIÓN */}
{reservationSent && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg z-[1000] animate-fade-in">
    ✓ Reserva recibida. ¡Gracias!
  </div>
)}


<form
 onSubmit={async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  if (!formData.time) {
    setErrors((prev) => ({ ...prev, time: "Seleccioná un horario." }));
    return;
  } else {
    setErrors((prev) => ({ ...prev, time: undefined }));
  }

  console.log("DATOS QUE SE ENVIAN A FIREBASE:", formData);

  // 🟡 VALIDACIÓN POR DÍA
if (estadoDia) {
  const totalConNuevaReserva =
    Number(estadoDia.personasReservadas) + Number(formData.people);

    if (estadoDia.cerrado || totalConNuevaReserva > estadoDia.capacidadTotal) {
      setMensajeDia("❌ Ya no hay reservas disponibles para este día.");
      return;
    }
}

// ❌ BLOQUEAR SI LA FECHA NO ES DE LA SEMANA ACTUAL
if (!fechaDentroDeSemanaActual(formData.date)) {
  alert("❌ Solo se aceptan reservas para la semana actual.");
  return;
}


  // 🔥 ESTA LÍNEA FALTABA
  const result = await reservarConTransaccion(formData);
  if (!result.ok) {
    if (result.error === "SIN_CUPO") {
      alert("❌ Ya no hay disponibilidad para este día.");
    } else {
      alert("Ocurrió un error al tomar la reserva.");
    }
    return;
  }
  
  if (result.ok && estadoReservas) {
    const refEstado = doc(db, "config", "reservasEstado");
    if (estadoDia) {
      const refDia = doc(db, "reservasPorDia", formData.date);
    
      const nuevoTotal =
        Number(estadoDia.personasReservadas) + Number(formData.people);
    
      await updateDoc(refDia, {
        personasReservadas: nuevoTotal,
        cerrado: nuevoTotal >= estadoDia.capacidadTotal,
      });
    }
    await updateDoc(refEstado, {
      personasReservadas:
        Number(estadoReservas.personasReservadas) +
        Number(formData.people),
    });
 

  
  setReservationSent(true);
 
    setFormData({
      name: "",
      phone: "",
      date: "",
      time: "",
      people: "",
    });

    setTimeout(() => {
      setReservationSent(false);
      closeReserve();
    }, 2500);
  } else {
    alert("Ocurrió un error al enviar la reserva. Intentá de nuevo.");
  }
}}

  className="max-w-xl mx-auto space-y-8 font-serif text-emerald-900"
>


{/* SECCION TOMAR DATOS DE RESERVA */}
{/* NOMBRE */}
<div>
  <label className="block mb-1 text-left">Nombre</label>
  <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className={`w-full p-3 rounded-lg border 
      ${errors.name ? "border-red-500" : "border-emerald-300"} 
      focus:outline-none focus:ring-2 
      ${errors.name ? "focus:ring-red-500" : "focus:ring-emerald-600"}
    `}
    placeholder="Tu nombre"
  />
  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
</div>

{/* TELEFONO */}
<div>
  <label className="block mb-1 text-left">Teléfono</label>
  <input
    type="text"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    className={`w-full p-3 rounded-lg border 
      ${errors.phone ? "border-red-500" : "border-emerald-300"} 
      focus:outline-none focus:ring-2 
      ${errors.phone ? "focus:ring-red-500" : "focus:ring-emerald-600"}
    `}
    placeholder="Ej: 3496 123456"
  />
  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
</div>

{/* FECHA */}
<div>
  <label className="block mb-1 text-left">Fecha</label>
  <input
  type="date"
  value={formData.date}
  onChange={async (e) => {
    const fecha = e.target.value;

    setFormData({ ...formData, date: fecha });

    if (fecha) {
      await cargarEstadoDelDia(fecha);
    }
  }}
  className={`w-full p-3 rounded-lg border 
    ${errors.date ? "border-red-500" : "border-emerald-300"} 
    focus:outline-none focus:ring-2 
    ${errors.date ? "focus:ring-red-500" : "focus:ring-emerald-600"}
  `}
/>

{errorSemana && (
  <p className="mt-2 text-sm text-red-600 font-serif">
    {errorSemana}
  </p>
)}

{estadoDia && !errorSemana && (
  <p
    className={`mt-2 text-sm font-serif ${
      estadoDia.cerrado || lugaresDisponibles <= 0
        ? "text-red-600"
        : "text-emerald-700"
    }`}
  >
    {estadoDia.cerrado || lugaresDisponibles <= 0
      ? "❌ No hay disponibilidad para este día."
      : `🪑 Quedan ${lugaresDisponibles} lugares disponibles para este día.`}
  </p>
)}

  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
</div>

{/* HORARIO */}
<div>
  <label className="block mb-1 text-left">Horario</label>
  <select
    value={formData.time}
    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
    className={`w-full p-3 rounded-lg border 
      ${errors.time ? "border-red-500" : "border-emerald-300"} 
      focus:outline-none focus:ring-2 
      ${errors.time ? "focus:ring-red-500" : "focus:ring-emerald-600"}
    `}
  >
    <option value="">Seleccioná un horario</option>
    <option value="19:00">19:00</option>
    <option value="20:00">20:00</option>
    <option value="21:00">21:00</option>
    <option value="22:00">22:00</option>

  </select>

  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
</div>

{/* CANTIDAD DE PERSONAS */}
<div>
  <label className="block mb-1 text-left">Cantidad de Personas</label>
  <input
    type="number"
    min="1"
    value={formData.people}
    onChange={(e) =>
      setFormData({
        ...formData,
        people: e.target.value === "" ? "" : Number(e.target.value),
      })
    }
    
    className={`w-full p-3 rounded-lg border 
      ${errors.people ? "border-red-500" : "border-emerald-300"} 
      focus:outline-none focus:ring-2 
      ${errors.people ? "focus:ring-red-500" : "focus:ring-emerald-600"}
    `}
    placeholder="Ej: 4"
  />
  {errors.people && <p className="text-red-500 text-sm mt-1">{errors.people}</p>}
</div>

{/* RESERVAS DISPONIBLES/NO DISPONIBLES*/}
<button
  type="submit"
  disabled={!reservasHabilitadas}
className={`w-full py-3 rounded-lg transition cursor-pointer 
  ${!reservasHabilitadas 
    ? "bg-gray-400 cursor-not-allowed" 
    : "bg-emerald-800 text-white hover:bg-emerald-700"}
`}
>
  {!reservasHabilitadas ? "Reservas no disponibles" : "Confirmar Reserva"}
</button>

      </form>
    </div>
  </div>
)}


{/* SECCION SOBRE NOSOTROS */}

 {/* Línea decorativa suave (opcional) */}
 <div className=" bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-black/50 rounded-full"></div>
</section>
<section id="aboutUs"></section>
<section
  id="aboutUs"
  className="max-w-9xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12 bg-[#f5e6ca]"
>


<div class="w-full md:w-1/2">
  <img
    src={`${import.meta.env.BASE_URL}images/SobreNosotros.webp`}
    alt="Restaurante elegante"
    className="
      w-full 
      h-90             /* altura en móviles */
      sm:h-96          /* tablets un poco más grande */
      md:h-[380px]     /* desktop más chico y elegante */
      lg:h-[420px]     /* pantallas grandes */
      object-cover 
      rounded-2xl 
      shadow-lg
    "
    loading="lazy"
  />
</div>
  <div 
    class="w-full md:w-1/2 text-center md:text-left font-serif text-emerald-900"
  >
    <h2 className="text-5xl md:text-6xl font-light tracking-wide mb-10">
      Una experiencia gastronómica única
    </h2>

    <p className="text-xl md:text-1xl leading-relaxed font-light opacity-90">
      En <span class="font-medium">Mi Restaurante</span> creemos que cada comida 
      debe sentirse como un momento memorable. Nuestra cocina combina 
      técnicas modernas con sabores auténticos, utilizando ingredientes 
      seleccionados con el máximo cuidado.
    </p>

    <p className="text-xl md:text-1xl leading-relaxed font-light mt-8 opacity-80">
      Cuidamos cada detalle: la ambientación, la música, el servicio y la 
      presentación de cada plato. Queremos que cada visita sea una 
      experiencia elegante, cálida y distinta.
    </p>
  </div>
  
</section>

<div className=" bottom-0 left-1/2 h-[0.5px] bg-black/100 rounded-full"></div>


{/* SECCION CONTACTO */}
        <section id="contact" className="relative py-24 bg-[#f5e6ca]">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* COLUMNA IZQUIERDA: Texto + Datos */}
    <div>
      <h2 className="text-5xl font-serif font-light text-[#3a2f2f] tracking-wild uppercase">
        Contactanos
      </h2>

      <p className="mt-6 text-lg text-[#3a2f2f] leading-relaxed font-serif">
        Estamos aquí para ayudarte. Podés reservar una mesa, consultar nuestro menú
        o enviarnos un mensaje. Te responderemos lo antes posible.
      </p>

      <div className="mt-10 space-y-4 text-[#3a2f2f] text-lg font-serif">
        <p><strong>📍 Dirección:</strong> Av. Principal 123, Ciudad</p>
        <p><strong>📞 Teléfono:</strong> +54 11 5555-5555</p>
        <p>
    <strong>📸 Instagram:</strong>{" "}
    <a 
      href="https://instagram.com/tu_usuario" 
      target="_blank" 
      rel="noopener noreferrer"
      className="underline hover:text-[#2c2424] transition"
    >
      @tu_usuario
    </a>
  </p>
        <p><strong>⏰ Horarios:</strong> Todos los días — 10:00 a 00:00</p>
      </div>
    </div>

    {/* COLUMNA DERECHA: GOOGLE MAPS */}
    <div className="relative bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl p-0 overflow-hidden shadow-xl h-[420px]">

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.637105414996!2d-60.718!3d-31.652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b5a9df1cc5f7%3A0x724!2sSanta%20Fe!5e0!3m2!1ses-419!2sar!4v000000000"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

    </div>

  </div>
</section>


{/* 🔝 Botón para volver arriba */}
<button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="
    fixed bottom-3 right-6 z-50
    bg-white/20 backdrop-blur-md border border-black/40
    w-12 h-12 flex items-center justify-center
    rounded-xl shadow-lg
    hover:scale-110 hover:bg-white/30 transition-all duration-300
    cursor-pointer
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="45"
    height="45"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
</button>



      <footer className="bg-gray-800 text-white py-6 text-center font-Playfair Display font-light tracking-wild uppercase">
        © {new Date().getFullYear()} Mi Restaurante — Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;




