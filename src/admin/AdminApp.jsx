import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import AdminPanel from "../AdminPanel";

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  if (authLoading) {
    return <p style={{ padding: 40 }}>Cargando admin...</p>;
  }

  // 🔐 LOGIN
  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Login Admin</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");

            try {
              await signInWithEmailAndPassword(auth, email, password);
            } catch {
              setError("Email o contraseña incorrectos");
            }
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Ingresar</button>
        </form>
      </div>
    );
  }

  // ✅ ADMIN LOGUEADO
  return <AdminPanel adminUser={user} />;
}
