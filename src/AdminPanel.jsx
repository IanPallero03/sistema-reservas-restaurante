import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase/config";
import { getAuth, signOut } from "firebase/auth";

export default function AdminPanel({ adminUser }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservasHabilitadas, setReservasHabilitadas] = useState(true);

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
       // vuelve al sitio
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const getMondayOfCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0 domingo - 6 sábado
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const eliminarReservasAnteriores = async () => {
    const confirmar = window.confirm(
      "⚠️ ¿Seguro que querés eliminar las reservas de semanas anteriores?\nEsta acción no se puede deshacer."
    );
  
    if (!confirmar) return;
  
    const lunesActual = getMondayOfCurrentWeek();
  
    const snap = await getDocs(collection(db, "reservas"));
  
    let borradas = 0;
  
    for (const d of snap.docs) {
      const data = d.data();
  
      if (!data.date) continue;
  
      const fechaReserva = new Date(data.date);
      fechaReserva.setHours(0, 0, 0, 0);
  
      if (fechaReserva < lunesActual) {
        await deleteDoc(doc(db, "reservas", d.id));
        borradas++;
      }
    }
  
    alert(`✅ Se eliminaron ${borradas} reservas anteriores.`);
  };
    
  
  
  useEffect(() => {
    const ref = doc(db, "config", "general");
  
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setReservasHabilitadas(snap.data().estado);
      }
    });
  
    return () => unsub();
  }, []);
  

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
      setLoading(false);
    });

    return () => unsub();
  }, [adminUser]);


  return (
    /* ====== SECCION PANEL ADMINISTRADOR ====== */
    <div className="min-h-screen bg-[#f5e6ca] p-8">
      <h1 className="text-3xl font-serif text-emerald-900 mb-6">
        Panel de Reservas 
      </h1>
      <div className="flex gap-2">
      <button
  onClick={() => (window.location.href = import.meta.env.BASE_URL)}
  className="
    flex items-center gap-2
    px-4 py-2
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

{/* 🔒 CERRAR SESIÓN */}
<button
    onClick={handleLogout}
    className="
    flex items-center gap-2
    px-4 py-2
    rounded-lg
    bg-red-600 text-white
    border border-emerald-800
    text-emerald-800 text-sm font-medium
    shadow-sm
    hover:bg-red-700
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
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 12H9m0 0l3-3m-3 3l3 3"
      />
    </svg>
    Cerrar sesión
  </button>
</div>


      {/* ====== SECCION ABRIR Y CERRAR RESERVAS ====== */}
      <div className="mb-8 flex items-center justify-between bg-white p-5 rounded-xl shadow">
  <div>
    <p className="font-serif text-lg text-emerald-900">
      Reservas generales
      
    </p>
    <p className={`text-sm ${
      reservasHabilitadas ? "text-emerald-700" : "text-red-600"
    }`}>
      {reservasHabilitadas ? "ABIERTAS" : "CERRADAS"}
    </p>
  </div>
  
  <button
    onClick={async () => {
      const ref = doc(db, "config", "general");
      await updateDoc(ref, {
        estado: !reservasHabilitadas,
      });
    }}
    className={`px-5 py-2 rounded-lg text-white transition cursor-pointer
      ${reservasHabilitadas
        ? "bg-red-600 hover:bg-red-700"
        : "bg-emerald-700 hover:bg-emerald-600"
      }
    `}
  >
    {reservasHabilitadas ? "Cerrar reservas" : "Abrir reservas"}
  </button>
</div>

{/* ====== SECCION ELIMINAR RESERVAS SEMANA ANTERIOR ====== */}
<div className="mb-8 flex items-center justify-between bg-white p-5 rounded-xl shadow">
  <div>
    <p className="font-serif text-lg text-emerald-900">
      Mantenimiento
    </p>
    <p className="text-sm text-gray-500">
      Eliminar reservas antiguas
    </p>
  </div>

  <button
    onClick={eliminarReservasAnteriores}
    className="
      px-5 py-2
      rounded-lg
      bg-red-100
      text-red-700
      border border-red-300
      hover:bg-red-600
      hover:text-white
      transition
      cursor-pointer
    "
  >
    🗑️ Eliminar
  </button>
</div>

{/* ====== SECCION CARGA DE RESERVAS ====== */}

      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservas.length === 0 ? (
        <p>No hay reservas aún</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead className="bg-emerald-800 text-white">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Hora</th>
                <th className="p-3">Personas</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>

              </tr>
            </thead>

            <tbody>
              {reservas.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3 text-center">{r.date}</td>
                  <td className="p-3 text-center">{r.time}</td>
                  <td className="p-3 text-center">{r.people}</td>
                  <td className="p-3 text-center">{r.phone}</td>
                  <td className="p-3 text-center">

  {/* ====== SECCION CONFIRMAR Y CANCELAR RESERVA ====== */}
  <span
    className={`px-2 py-1 rounded text-sm font-medium
      ${
        r.status === "confirmed"
          ? "bg-emerald-100 text-emerald-800"
          : r.status === "cancelled"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-800"
      }
    `}
  >
    {r.status === "pending"
  ? "Pendiente"
  : r.status === "confirmed"
  ? "Confirmada"
  : "Cancelada"}

  </span>
</td>
<td className="p-3 text-center">
<div className="flex flex-col sm:flex-row gap-2 justify-center">
  {(r.status === "pending" || r.status === "cancelled") && (
    <button
      onClick={async () => {
        const ref = doc(db, "reservas", r.id);
        await updateDoc(ref, { status: "confirmed" });
      }}
      className=" px-3 py-1
      rounded
      text-xs sm:text-sm
      font-medium
      border border-emerald-700
      text-emerald-700
      hover:bg-emerald-700 hover:text-white
      transition
      cursor-pointer"
    >
      Confirmar
    </button>
  )}

  {(r.status === "pending" || r.status === "confirmed") && (
    <button
      onClick={async () => {
        const ref = doc(db, "reservas", r.id);
        await updateDoc(ref, { status: "cancelled" });
      }}
      className=" px-3 py-1
      rounded
      text-xs sm:text-sm
      font-medium
      border border-red-600
      text-red-600
      hover:bg-red-600 hover:text-white
      transition cursor-pointer"
    >
      Cancelar
    </button>
  )}
    </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
