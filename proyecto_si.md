Plan de Acción: Gestor de Restaurantes Anti-Aglomeraciones

Este documento define la estructura, los roles, el flujo de pantallas y el stack tecnológico para el desarrollo de la plataforma de gestión de restaurantes y reservas en tiempo real.

1. Roles del Sistema

Cliente: Usuario final que busca evitar filas, reserva mesas y gestiona su saldo en la aplicación.

Operador/Personal (Dueño): Usuario en el restaurante que gestiona la disponibilidad de las mesas en tiempo real y configura la publicidad.

Administrador: Perfil analítico que revisa las métricas de rendimiento y la afluencia de clientes. (Nota: En muchos casos, este rol y el de Operador se unifican bajo la cuenta del "Dueño del Restaurante", pero a nivel de vistas se separan sus funciones).

2. Especificaciones de Pantallas y Flujos

A. Vista del Cliente (App Principal)

Objetivo: Permitir la búsqueda rápida de locales, visualizar disponibilidad real y efectuar reservas prepagadas.

Pantalla 1: Home (Inicio)

Navbar: Muestra el logo, acceso al perfil y el Saldo de la Billetera Virtual destacado.

Módulo de Publicidad: Un banner dinámico en la parte superior. Muestra las campañas activas (creadas por los restaurantes). Interacción: Al hacer clic, redirige al detalle de ese restaurante específico para iniciar la reserva.

Buscador/Filtros: Campo de texto y filtros por cercanía o tipo de comida.

Feed de Restaurantes (Cards): Lista de locales. Cada tarjeta debe mostrar:

Foto, Nombre y Ubicación.

Indicador en vivo: Etiqueta resaltada con el número total de mesas disponibles en ese instante (ej: "4 mesas libres").

Pantalla 2: Detalle del Restaurante y Reserva

Cabecera: Información detallada del local.

Grid de Disponibilidad: Muestra de forma desglosada el tipo de mesas disponibles (ej: "2 mesas para 2 personas", "1 mesa para 4 personas").

Flujo de Reserva:

El usuario selecciona el tipo de mesa y horario.

Validación Crítica: El sistema verifica el saldo.

Si Saldo >= Costo: El botón "Confirmar Reserva" está activo. Al pulsar, se debita el dinero y se genera la reserva.

Si Saldo < Costo: El botón se bloquea y muestra un CTA (Call to Action): "Recargar Billetera para reservar".

Pantalla 3: Billetera y Perfil

Historial de reservas pasadas y activas.

Módulo para recargar saldo (integración futura con pasarela de pagos).

B. Vista del Restaurante - Modo Operativo (Gestor de Mesas y Anuncios)

Objetivo: Control en tiempo real del piso del restaurante y gestión de marketing directo.

Pantalla 1: Panel de Control de Mesas (Punto de Venta / Recepción)

Grid Interactivo de Mesas: Representación visual de todas las mesas del local. Cada mesa muestra su número y capacidad.

Interruptores de Estado (Toggles): Un control rápido (un solo clic/tap) para cambiar el estado de la mesa de "Disponible" a "Ocupada" y viceversa. Esta acción debe reflejarse instantáneamente en las pantallas de los clientes.

Configuración de Piso: Opción para agregar o eliminar mesas del sistema.

Pantalla 2: Gestor de Publicidad

Lista de Anuncios: Historial de campañas creadas.

Creador/Editor: Formulario simple para subir una imagen, escribir un título promocional y establecer a dónde redirige el anuncio.

Control de Activación: Un interruptor (On/Off) para decidir si el anuncio se muestra actualmente en el Home de los clientes.

C. Vista del Administrador (Métricas y Rendimiento)

Objetivo: Toma de decisiones basadas en datos recopilados por las reservas y la ocupación.

Pantalla 1: Dashboard Analítico

KPIs Principales (Tarjetas numéricas):

Total de Clientes Atendidos hoy (basado en la capacidad de las mesas reservadas/ocupadas).

Ingresos generados por reservas.

Porcentaje promedio de ocupación de mesas.

Gráfico de Horas Pico: Un gráfico de barras o líneas que mapea el volumen de reservas a lo largo del día, permitiendo identificar fácilmente los horarios de mayor congestión.

Filtros de Fecha: Selector para ver datos del día, semana o mes actual frente a periodos anteriores.

3. Especificaciones Técnicas y Arquitectura del Proyecto

Para garantizar el rendimiento, la reactividad en tiempo real y la facilidad de despliegue, el proyecto se construirá bajo el siguiente stack tecnológico:

Backend (Servidor y API):

Entorno: Node.js utilizando el framework Express.js para la creación de la API RESTful.

Comunicación en Tiempo Real: Implementación de Socket.io (o similar) en conjunto con Express para emitir los cambios de disponibilidad de mesas instantáneamente hacia los clientes.

Base de Datos y ORM:

ORM: Prisma. Se utilizará Prisma por su tipado estricto y facilidad para gestionar migraciones y relaciones complejas (Usuarios <-> Restaurantes <-> Mesas <-> Reservas).

Motor de BD: PostgreSQL (recomendado por su robustez relacional).

Frontend (Interfaces de Usuario):

Librería Principal: React.js.

Estilos: Tailwind CSS para un diseño 100% responsivo y rápido.

Gestión de Estado: Context API o Redux (o herramientas como React Query) para manejar el estado global del usuario (saldo) y la sincronización de las mesas con el backend.

Infraestructura y Despliegue (DevOps):

Contenedorización: Todo el proyecto estará Dockerizado.

Estructura: Se proveerá un archivo docker-compose.yml en la raíz del proyecto que orquestará al menos tres contenedores:

El contenedor del Frontend (React).

El contenedor del Backend (Express + Node).

El contenedor de la Base de Datos (PostgreSQL).

Esto garantizará que el entorno de desarrollo sea idéntico al de producción y que el proyecto se pueda levantar con un solo comando (docker-compose up).