import express from "express";
import {
  obtenerPacientes,
  obtenerTerapeutas,
  obtenerServicios,
  obtenerSucursales,
  crearCita,
  obtenerCitasDelDia
} from "../controllers/recepcion.js";
import { verificarToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/pacientes", verificarToken, obtenerPacientes);
router.get("/terapeutas", verificarToken, obtenerTerapeutas);
router.get("/servicios", verificarToken, obtenerServicios);
router.get("/sucursales", verificarToken, obtenerSucursales);
router.get("/citas/hoy", verificarToken, obtenerCitasDelDia);
router.post("/citas", verificarToken, crearCita);

export default router;
