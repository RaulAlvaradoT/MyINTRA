import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/usuarios/login", {
        telefono,
        password
      });

      const { token, usuario } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", usuario.rol);

      const rutas = {
        recepcion: "/recepcion",
        admin: "/admin",
        // puedes agregar más si deseas login universal
      };

      if (rutas[usuario.rol]) {
        navigate(rutas[usuario.rol]);
      } else {
        toast.error("Rol no válido");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">MyINTRA Login</h2>

        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
        <ToastContainer position="bottom-right" autoClose={2000} />
      </form>
    </div>
  );
}
