import { pool } from "../db/mydb.js";

// Obtener todos los pacientes
export const obtenerPacientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_paciente, nombre, apellido FROM pacientes");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener pacientes:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener todos los terapeutas activos
export const obtenerTerapeutas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_terapeuta, nombre FROM terapeutas WHERE activo = 1");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener terapeutas:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener todos los servicios disponibles
export const obtenerServicios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_servicio, nombre_servicio FROM servicios");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Obtener todas las sucursales
export const obtenerSucursales = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id_sucursal, nombre FROM sucursales");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener sucursales:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// Agendar una nueva cita
export const crearCita = async (req, res) => {
  const {
    id_paciente,
    id_terapeuta,
    id_servicio,
    id_sucursal,
    fecha,
    hora_inicio,
    hora_fin,
    notas
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO citas (
        id_paciente, id_terapeuta, id_servicio, id_sucursal,
        fecha, hora_inicio, hora_fin, notas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_paciente,
        id_terapeuta,
        id_servicio,
        id_sucursal,
        fecha,
        hora_inicio,
        hora_fin,
        notas
      ]
    );

    res.json({ msg: "✅ Cita agendada correctamente" });
  } catch (error) {
    console.error("❌ Error al agendar cita:", error);
    res.status(500).json({ msg: "Error al agendar cita" });
  }
};

// Obtener citas del día
export const obtenerCitasDelDia = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        c.id_cita, c.hora_inicio, c.hora_fin, c.estado,
        p.nombre AS paciente, s.nombre_servicio AS servicio,
        t.nombre AS terapeuta
       FROM citas c
       JOIN pacientes p ON c.id_paciente = p.id_paciente
       JOIN servicios s ON c.id_servicio = s.id_servicio
       JOIN terapeutas t ON c.id_terapeuta = t.id_terapeuta
       WHERE c.fecha = CURDATE()
       ORDER BY c.hora_inicio ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener citas del día:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
