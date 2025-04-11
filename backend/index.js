import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pacienteRoutes from "./routes/pacientes.js"; // <-- Esto va después de las importaciones generales
import terapeutaRoutes from "./routes/terapeutas.js";
import recepcionRoutes from "./routes/recepcion.js";
import usuariosRoutes from "./routes/usuarios.js";




dotenv.config();

const app = express(); // <-- Asegúrate que esto esté antes de cualquier uso de "app"

app.use(cors());
app.use(express.json());

// Aquí ya puedes usar app.use
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/login", pacienteRoutes);
app.use("/api/terapeuta", terapeutaRoutes);
app.use("/api/recepcion", recepcionRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
