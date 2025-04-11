import { pool } from "../db/mydb.js";
import jwt from "jsonwebtoken";

export const loginUsuario = async (req, res) => {
  const { telefono, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE telefono = ? AND activo = TRUE",
      [telefono]
    );

    const usuario = rows[0];

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado o inactivo" });
    }

    // Aquí puedes usar bcrypt.compare si encriptas contraseñas
    if (usuario.password !== password) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
        telefono: usuario.telefono
      }
    });
  } catch (error) {
    console.error("❌ ERROR LOGIN USUARIO:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
