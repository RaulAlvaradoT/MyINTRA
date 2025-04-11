import express from "express";
import { verificarToken } from "../middlewares/auth.js";
import { loginPaciente, getProximaCita, getHistorialCitas } from "../controllers/pacientes.js";


const router = express.Router();

router.post("/paciente", loginPaciente);
router.get("/citas/proxima", verificarToken, getProximaCita);
router.get("/citas/historial", verificarToken, getHistorialCitas);



export default router;
