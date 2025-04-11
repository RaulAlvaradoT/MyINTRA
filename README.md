# MyINTRA

Sistema web de gestión clínica desarrollado para el Instituto de Atención Integral y Desarrollo Humano A.C. (INTRA). Esta aplicación permite coordinar eficientemente las actividades de pacientes, terapeutas, recepcionistas y administradores mediante una interfaz amigable, control de accesos por rol y herramientas automatizadas para la programación de citas, seguimiento y registro clínico.

## Características principales

### 🔐 Autenticación con JWT
- Inicio de sesión personalizado según el tipo de usuario: **paciente**, **terapeuta**, **recepción**, **admin**.
- Manejo seguro de sesiones con tokens y protección de rutas con middleware de verificación.

### 👤 Vista del paciente
- Consulta de **próxima cita** con detalle de fecha, hora, terapeuta y servicio.
- Visualización de su **historial clínico** con fechas, horarios, servicios y notas de cada sesión.
- Mensaje preventivo para contactar a recepción en caso de cancelaciones.

### 🧠 Vista del terapeuta
- Visualización de **citas del día** ordenadas por hora.
- Botones interactivos para registrar asistencia: ✅ Asistió / ❌ No asistió.
- Indicador visual de estado de asistencia por cita.

### 📞 Vista de recepción
- Interfaz para **agendar nuevas citas** mediante un formulario completo.
- Verificación automática de **conflictos de horario** con citas ya agendadas para evitar empalmes.
- Panel con las **citas del día** incluyendo paciente, terapeuta y servicio.
- Filtros inteligentes para buscar pacientes por nombre (tipo autocompletar).

### 🧑‍💼 Vista de administrador (en progreso)
- Gestión central de usuarios y datos clínicos.
- Visualización y análisis estadístico de la operación del centro.

## Estructura del proyecto

```
myintra/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Paciente/
│   │   │   ├── Terapeuta/
│   │   │   ├── Recepcion/
│   │   │   └── Admin/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
```

## Tecnologías utilizadas

- **Frontend:** React, TailwindCSS, Axios, React Router, React Toastify
- **Backend:** Node.js, Express, MySQL2
- **Autenticación:** JWT
- **Base de datos:** MySQL

## Instalación y ejecución local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/RaulAlvaradoT/MyINTRA.git
   cd MyINTRA
   ```

2. Instala dependencias del backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Instala dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Accede a la aplicación en `http://localhost:5173`

## Variables de entorno necesarias

En el archivo `.env` dentro del backend:
```env
PORT=3001
JWT_SECRET=tu_clave_secreta_segura
``` 

## Estado del proyecto

✅ Funcionalidades básicas completas para paciente, terapeuta y recepción.  
🔧 Vista de administrador en desarrollo.  
📝 Documentación técnica y arquitectura en progreso.

---

Este sistema fue diseñado con un enfoque práctico para mejorar la atención psicológica y administrativa en centros de salud mental. Si deseas contribuir o adaptarlo a tu institución, siéntete libre de hacer un fork o contactarme.

**Desarrollado con ❤️ por el Ing. Raúl Alvarado**
