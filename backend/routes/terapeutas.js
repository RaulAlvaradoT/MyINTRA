import express from "express";
import { loginTerapeuta } from "../controllers/terapeutas.js";
import { verificarToken } from "../middlewares/auth.js";
import { getCitasDeHoy } from "../controllers/terapeutas.js";
import { marcarAsistencia } from "../controllers/terapeutas.js";

const router = express.Router();

router.post("/login", loginTerapeuta);
router.get("/citas/hoy", verificarToken, getCitasDeHoy);
router.patch("/cita/:id/asistencia", verificarToken, marcarAsistencia);

export default router;
