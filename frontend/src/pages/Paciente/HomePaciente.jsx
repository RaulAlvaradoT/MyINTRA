import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HomePaciente = () => {
  const [proximaCita, setProximaCita] = useState(null);
  const [historial, setHistorial] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerProximaCita = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/paciente/proxima-cita", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProximaCita(res.data);
      } catch (error) {
        toast.error("Error al obtener la próxima cita");
      }
    };

    const obtenerHistorial = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/paciente/historial", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistorial(res.data);
      } catch (error) {
        toast.error("Error al obtener el historial de citas");
      }
    };

    obtenerProximaCita();
    obtenerHistorial();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold mb-4">Bienvenido/a</h1>

      {proximaCita ? (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-2">Tu próxima cita</h2>
          <p><strong>Fecha:</strong> {proximaCita.fecha}</p>
          <p><strong>Hora:</strong> {proximaCita.hora_inicio} - {proximaCita.hora_fin}</p>
          <p><strong>Terapeuta:</strong> {proximaCita.terapeuta}</p>
          <p><strong>Servicio:</strong> {proximaCita.servicio}</p>
          <p className="mt-2 text-sm text-gray-600">Si deseas cancelar esta cita, por favor comunícate con recepción.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-2">No tienes citas próximas</h2>
          <p className="text-gray-600">Aún no tienes una cita agendada. Si deseas hacerlo, comunícate con recepción.</p>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Historial de citas</h2>
        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Fecha</th>
                  <th className="px-4 py-2 border">Hora</th>
                  <th className="px-4 py-2 border">Servicio</th>
                  <th className="px-4 py-2 border">Notas</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((cita, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 border">{cita.fecha}</td>
                    <td className="px-4 py-2 border">{cita.hora_inicio} - {cita.hora_fin}</td>
                    <td className="px-4 py-2 border">{cita.servicio}</td>
                    <td className="px-4 py-2 border">{cita.notas || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Aún no tienes historial de citas registradas.</p>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default HomePaciente;
