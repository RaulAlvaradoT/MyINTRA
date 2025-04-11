import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const HomeRecepcion = () => {
  const [pacientes, setPacientes] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [citasHoy, setCitasHoy] = useState([]);
  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  const [form, setForm] = useState({
    id_paciente: "",
    id_terapeuta: "",
    id_servicio: "",
    id_sucursal: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    notas: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resPacientes, resTerapeutas, resServicios, resSucursales] = await Promise.all([
          axios.get("http://localhost:3001/api/recepcion/pacientes", { headers }),
          axios.get("http://localhost:3001/api/recepcion/terapeutas", { headers }),
          axios.get("http://localhost:3001/api/recepcion/servicios", { headers }),
          axios.get("http://localhost:3001/api/recepcion/sucursales", { headers })
        ]);

        setPacientes(resPacientes.data);
        setTerapeutas(resTerapeutas.data);
        setServicios(resServicios.data);
        setSucursales(resSucursales.data);
      } catch (error) {
        toast.error("Error al cargar datos");
      }
    };

    const fetchCitasHoy = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/recepcion/citas/hoy", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCitasHoy(res.data);
      } catch (error) {
        toast.error("Error al cargar citas de hoy");
      }
    };

    fetchDatos();
    fetchCitasHoy();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePacienteSearch = (e) => {
    const texto = e.target.value;
    setBusquedaPaciente(texto);
    const coincidencias = pacientes.filter((p) =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(texto.toLowerCase())
    );
    setSugerencias(coincidencias);
  };

  const seleccionarPaciente = (paciente) => {
    setForm({ ...form, id_paciente: paciente.id_paciente });
    setBusquedaPaciente(`${paciente.nombre} ${paciente.apellido}`);
    setSugerencias([]);
  };

  const agendarCita = async () => {
    try {
      const existeSolapamiento = citasHoy.some((cita) =>
        cita.id_terapeuta === form.id_terapeuta &&
        cita.fecha === form.fecha &&
        ((form.hora_inicio >= cita.hora_inicio && form.hora_inicio < cita.hora_fin) ||
         (form.hora_fin > cita.hora_inicio && form.hora_fin <= cita.hora_fin))
      );

      if (existeSolapamiento) {
        toast.warning("⛔ El terapeuta ya tiene una cita en ese horario");
        return;
      }

      await axios.post("http://localhost:3001/api/recepcion/citas", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("✅ Cita agendada correctamente");
      setForm({
        id_paciente: "",
        id_terapeuta: "",
        id_servicio: "",
        id_sucursal: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        notas: ""
      });
      setBusquedaPaciente("");
    } catch (error) {
      toast.error("❌ Error al agendar cita");
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-12">
      <div>
        <h1 className="text-2xl font-bold mb-4">Agendar nueva cita</h1>
        <div className="bg-white shadow-md rounded p-6 max-w-xl mx-auto space-y-4">
          <div>
            <label className="block font-semibold">Buscar paciente:</label>
            <input
              type="text"
              value={busquedaPaciente}
              onChange={handlePacienteSearch}
              className="w-full border rounded px-3 py-2"
              placeholder="Nombre o apellido"
            />
            {sugerencias.length > 0 && (
              <ul className="border mt-1 rounded bg-white max-h-40 overflow-y-auto">
                {sugerencias.map((p) => (
                  <li
                    key={p.id_paciente}
                    className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => seleccionarPaciente(p)}
                  >
                    {p.nombre} {p.apellido}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block font-semibold">Terapeuta:</label>
            <select name="id_terapeuta" value={form.id_terapeuta} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Seleccione un terapeuta</option>
              {terapeutas.map((t) => (
                <option key={t.id_terapeuta} value={t.id_terapeuta}>{t.nombre}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Servicio:</label>
              <select name="id_servicio" value={form.id_servicio} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Seleccione un servicio</option>
                {servicios.map((s) => (
                  <option key={s.id_servicio} value={s.id_servicio}>{s.nombre_servicio}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold">Sucursal:</label>
              <select name="id_sucursal" value={form.id_sucursal} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="">Seleccione una sucursal</option>
                {sucursales.map((s) => (
                  <option key={s.id_sucursal} value={s.id_sucursal}>{s.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Fecha:</label>
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold">Hora inicio:</label>
              <input type="time" name="hora_inicio" value={form.hora_inicio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block font-semibold">Hora fin:</label>
            <input type="time" name="hora_fin" value={form.hora_fin} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block font-semibold">Notas:</label>
            <textarea name="notas" value={form.notas} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <button onClick={agendarCita} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Agendar cita
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Citas del día</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Hora</th>
                <th className="px-4 py-2 border">Paciente</th>
                <th className="px-4 py-2 border">Terapeuta</th>
                <th className="px-4 py-2 border">Servicio</th>
              </tr>
            </thead>
            <tbody>
              {citasHoy.map((cita, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 border">{cita.hora_inicio} - {cita.hora_fin}</td>
                  <td className="px-4 py-2 border">{cita.paciente}</td>
                  <td className="px-4 py-2 border">{cita.terapeuta}</td>
                  <td className="px-4 py-2 border">{cita.servicio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default HomeRecepcion;