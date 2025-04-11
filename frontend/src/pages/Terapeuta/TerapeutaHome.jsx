import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TerapeutaHome = () => {
  const [citas, setCitas] = useState([]);
  const token = localStorage.getItem("token");

  const obtenerCitas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/terapeuta/citas/hoy", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Citas cargadas:", res.data); // ✅ Aquí sí se usa res.data

      setCitas(res.data);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      toast.error("❌ Error al cargar citas");
    }
  };

  const marcarAsistencia = async (id_cita, asistio) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/terapeuta/cita/${id_cita}/asistencia`,
        { asistio },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("✅ Asistencia registrada correctamente");
      obtenerCitas(); // Recargar citas después de marcar
    } catch (error) {
      console.error("Error al marcar asistencia:", error);
      toast.error("❌ Error al marcar asistencia");
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Citas del día</h1>
      {citas.length === 0 ? (
        <p>No hay citas programadas para hoy.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Hora</th>
              <th className="p-2 border">Paciente</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 border">{cita.hora_inicio}</td>
                <td className="p-2 border">{cita.paciente}</td>
                <td className="p-2 border">{cita.servicio}</td>
                <td className="p-2 border text-center">
                  {cita.asistio == null ? (
                    <>
                      <button
                        onClick={() => marcarAsistencia(cita.id_cita, 1)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        ✅ Asistió
                      </button>
                      <button
                        onClick={() => marcarAsistencia(cita.id_cita, 0)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
                      >
                        ❌ No asistió
                      </button>
                    </>
                  ) : (
                    <span
                      className={`font-bold ${
                        cita.asistio === 1 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cita.asistio === 1 ? "✅ Asistió" : "❌ No asistió"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default TerapeutaHome;
