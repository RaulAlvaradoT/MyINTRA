import { pool } from "../db/mydb.js";
import jwt from "jsonwebtoken";

// LOGIN
export const loginTerapeuta = async (req, res) => {
  const { telefono } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM terapeutas WHERE telefono = ?", [telefono]);
    const terapeuta = rows[0];

    if (!terapeuta) {
      return res.status(404).json({ msg: "Terapeuta no encontrado" });
    }

    const token = jwt.sign(
      { id: terapeuta.id_terapeuta, rol: "terapeuta" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      terapeuta: {
        id: terapeuta.id_terapeuta,
        nombre: terapeuta.nombre,
        email: terapeuta.email,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN TERAPEUTA:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// CITAS DE HOY
export const getCitasDeHoy = async (req, res) => {
  const idTerapeuta = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT 
         c.id_cita,
         c.fecha,
         c.hora_inicio,
         c.hora_fin,
         c.asistio,
         p.nombre AS paciente,
         s.nombre_servicio AS servicio
       FROM citas c
       JOIN pacientes p ON c.id_paciente = p.id_paciente
       JOIN servicios s ON c.id_servicio = s.id_servicio
       WHERE c.id_terapeuta = ? AND c.fecha = CURDATE()
       ORDER BY c.hora_inicio ASC`,
      [idTerapeuta]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ ERROR SQL (citas del día):", error);
    res.status(500).json({ msg: "Error al obtener citas del día" });
  }
};

// NUEVO: CITAS POR FECHA
export const getCitasPorFecha = async (req, res) => {
  const idTerapeuta = req.user.id;
  const { fecha } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         c.id_cita,
         c.fecha,
         c.hora_inicio,
         c.hora_fin,
         c.asistio,
         p.nombre AS paciente,
         s.nombre_servicio AS servicio
       FROM citas c
       JOIN pacientes p ON c.id_paciente = p.id_paciente
       JOIN servicios s ON c.id_servicio = s.id_servicio
       WHERE c.id_terapeuta = ? AND c.fecha = ?
       ORDER BY c.hora_inicio ASC`,
      [idTerapeuta, fecha]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ ERROR SQL (citas por fecha):", error);
    res.status(500).json({ msg: "Error al obtener citas por fecha" });
  }
};

// MARCAR ASISTENCIA
export const marcarAsistencia = async (req, res) => {
  const idTerapeuta = req.user.id;
  const idCita = req.params.id;
  const { asistio } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM citas WHERE id_cita = ? AND id_terapeuta = ?",
      [idCita, idTerapeuta]
    );

    if (rows.length === 0) {
      return res.status(403).json({ msg: "No tienes permiso para modificar esta cita" });
    }

    await pool.query(
      "UPDATE citas SET asistio = ?, estado = ? WHERE id_cita = ?",
      [asistio, asistio == 1 ? 'realizada' : 'pendiente', idCita]
    );

    res.json({ msg: "Asistencia actualizada correctamente" });
  } catch (error) {
    console.error("❌ ERROR al marcar asistencia:", error);
    res.status(500).json({ msg: "Error al actualizar asistencia" });
  }
};
