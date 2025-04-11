import { pool } from "../db/mydb.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginPaciente = async (req, res) => {
  const { telefono, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM pacientes WHERE telefono = ?", [telefono]);
    const paciente = rows[0];

    if (!paciente) return res.status(404).json({ msg: "Paciente no encontrado" });

    if (paciente.password !== password) {
        return res.status(401).json({ msg: "Contraseña incorrecta" });
      }     

    const token = jwt.sign({ id: paciente.id_paciente, rol: "paciente" }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      paciente: {
        id: paciente.id_paciente,
        nombre: paciente.nombre,
        telefono: paciente.telefono,
        contacto_emergencia: paciente.contacto_emergencia,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
export const getProximaCita = async (req, res) => {
    const idPaciente = req.user.id;
  
    try {
      const [rows] = await pool.query(
        `SELECT c.fecha, c.hora_inicio, c.estado, c.id_terapeuta
         FROM citas c
         WHERE c.id_paciente = ? AND c.estado = 'pendiente' AND c.fecha >= CURDATE()
         ORDER BY c.fecha ASC, c.hora_inicio ASC
         LIMIT 1`,
        [idPaciente]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ msg: "No hay próximas citas" });
      }
  
      res.json(rows[0]);
    } catch (error) {
      console.error("❌ ERROR SQL:", error); // <-- Muestra el error real
      res.status(500).json({ msg: "Error del servidor al obtener cita" });
    }
  };

  
  export const getHistorialCitas = async (req, res) => {
    const idPaciente = req.user.id;
  
    try {
      const [rows] = await pool.query(
        `SELECT 
           c.fecha,
           c.hora_inicio,
           c.notas,
           t.nombre AS terapeuta,
           s.nombre_servicio AS servicio,
           suc.nombre AS sucursal
         FROM citas c
         JOIN terapeutas t ON c.id_terapeuta = t.id_terapeuta
         JOIN servicios s ON c.id_servicio = s.id_servicio
         JOIN sucursales suc ON c.id_sucursal = suc.id_sucursal
         WHERE c.id_paciente = ? AND c.estado = 'realizada'
         ORDER BY c.fecha DESC, c.hora_inicio DESC`,
        [idPaciente]
      );
  
      res.json(rows);
    } catch (error) {
      console.error("❌ ERROR SQL (historial extendido):", error);
      res.status(500).json({ msg: "Error del servidor al obtener historial extendido" });
    }
  };
  
  