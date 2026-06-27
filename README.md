# AntiCrowd - Gestor de Restaurantes Anti-Aglomeraciones

Este proyecto es una plataforma interactiva y reactiva en tiempo real para la gestión de mesas de restaurantes, diseñada para evitar aglomeraciones, permitir reservas virtuales y gestionar campañas publicitarias directamente.

## 🚀 Arquitectura y Tecnologías
- **Frontend**: React (Vite) + Tailwind CSS (v3) + Socket.io-client + Lucide Icons.
- **Backend**: Node.js (Express) + Socket.io + Prisma ORM.
- **Base de Datos**: PostgreSQL.
- **Orquestación**: Docker Compose.

---

## 🛠️ Instrucciones de Despliegue con Docker

Para iniciar todo el stack completo (Base de Datos + Backend + Frontend), siga estos sencillos pasos:

### 1. Iniciar los contenedores
Ejecute el siguiente comando en la raíz del proyecto para descargar las imágenes y construir el entorno:
```bash
docker compose up -d --build
```

### 2. Ejecutar Migraciones y Generación de Prisma
Una vez que los contenedores estén corriendo, inicialice la base de datos aplicando el esquema y generando el cliente Prisma:
```bash
docker compose exec backend npx prisma db push
```

### 3. Cargar Datos Iniciales (Seeding)
Cargue los usuarios de prueba, restaurantes y mesas de ejemplo ejecutando el script de semillas:
```bash
docker compose exec backend node prisma/seed.js
```

---

## 💻 Entorno de Desarrollo Local (Sin Docker)

Si prefiere ejecutar el proyecto localmente en su sistema:

### Requisitos previos
- Node.js (v18 o superior)
- PostgreSQL corriendo localmente con las credenciales indicadas en `backend/.env`

### Paso 1: Configurar el Servidor (Backend)
1. Ingrese a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Ejecute las migraciones y cargue la base de datos:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor correrá en `http://localhost:3001`.*

### Paso 2: Configurar la Interfaz (Frontend)
1. Abra otra terminal e ingrese a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend correrá en `http://localhost:5173`.*

---

## 🧪 Instrucciones de Prueba (Flujo de Trabajo)

La aplicación incluye un **Simulador de Roles** en la barra superior que le permite probar todos los perfiles de usuario de forma simultánea:

### 1. Cliente (Juan Pérez / María López)
- Permite visualizar la disponibilidad en vivo de mesas por restaurante.
- **Reserva Prepagada**: Al presionar una mesa disponible y confirmar, el costo se debitará del saldo virtual de la billetera.
- **Validación de Saldo**: Seleccione a **María López** (con $15 de saldo) e intente reservar una mesa que cueste $20. Verá cómo el botón se bloquea y le ofrece un botón para ir a recargar su saldo.
- **Recarga de Billetera**: En la pestaña "Billetera y Reservas", ingrese un monto y presione "Cargar Saldo" para simular un depósito.

### 2. Operador del Restaurante (Panel de Mesas)
- Seleccione el rol de **Operador**.
- Verá el piso del restaurante con un interruptor interactivo para cada mesa.
- **Tácticas de Tiempo Real**: Si abre dos ventanas del navegador (una como Cliente y otra como Operador), al cambiar el interruptor de una mesa a "Ocupada" u "Disponible", la pantalla del cliente se actualizará instantáneamente sin necesidad de recargar, recalculando el badge de mesas libres en el feed.
- **Creador de Publicidad**: Suba un anuncio promocional y actívelo. Aparecerá inmediatamente en el banner dinámico superior del cliente.

### 3. Administrador (Dashboard Analítico)
- Seleccione el rol de **Administrador**.
- Revise las métricas generales de ocupación promedio, clientes atendidos y ganancias totales.
- El **Gráfico de Horas Pico** muestra los horarios más congestionados basándose en los registros reales de reservas.
