# 🌱 Light for Life - Energy Management API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <strong>Sistema de Gestión Energética Inteligente</strong><br>
  API RESTful desarrollada con NestJS para promover el ahorro energético y la conciencia ambiental
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript" />
</p>

---

## 📋 Tabla de Contenidos

- [🎯 Descripción](#-descripción)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🔧 Uso](#-uso)
- [📊 API Endpoints](#-api-endpoints)
- [🔔 Sistema de Notificaciones](#-sistema-de-notificaciones)
- [🏃‍♂️ Ejecutar el Proyecto](#️-ejecutar-el-proyecto)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

---

## 🎯 Descripción

**Light for Life** es una API robusta y escalable diseñada para ayudar a los usuarios a gestionar y optimizar su consumo energético diario. El sistema incentiva el ahorro de energía a través de un sistema inteligente de notificaciones automáticas, seguimiento de metas y gamificación.

### 🌟 Misión
Promover la conciencia ambiental y el ahorro energético mediante tecnología innovadora que motiva a los usuarios a adoptar hábitos más sostenibles.

---

## ✨ Características Principales

### 📊 **Gestión de Consumo**
- ✅ Registro diario de consumo energético por dispositivo
- ✅ Cálculo automático de consumo estimado (kWh)
- ✅ Seguimiento mensual de gastos energéticos
- ✅ Histórico completo de consumos

### 🎯 **Sistema de Metas**
- ✅ Establecimiento de metas mensuales de consumo
- ✅ Cálculo automático de ahorros en tiempo real
- ✅ Comparación contra objetivos establecidos
- ✅ Alertas de proximidad al límite de meta

### 🔔 **Notificaciones Inteligentes**
- ✅ **Al Login**: Verificaciones críticas automáticas
- ✅ **Tiempo Real**: Alertas de límites y metas superadas
- ✅ **Programadas**: Recordatorios diarios y semanales
- ✅ **Motivacionales**: Celebración de logros y progreso positivo

### 🏆 **Gamificación**
- ✅ Sistema de medallas por logros
- ✅ Videos educativos sobre ahorro energético
- ✅ Seguimiento de rachas de ahorro
- ✅ Perfiles de usuario personalizados

### 🔐 **Seguridad y Autenticación**
- ✅ Autenticación segura con bcrypt
- ✅ Recuperación de contraseña por email
- ✅ Códigos de verificación temporales
- ✅ Validación de datos con class-validator

---

## 🏗️ Arquitectura

### **Stack Tecnológico**
- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Cache**: Redis para sesiones y datos temporales
- **Email**: Nodemailer con templates Handlebars
- **Documentación**: Swagger/OpenAPI
- **Programación de Tareas**: @nestjs/schedule con cron jobs
- **Validación**: class-validator y class-transformer

### **Estructura Modular**
```
src/
├── app/                    # Módulo principal de la aplicación
├── common/                 # Servicios compartidos
│   ├── config/            # Configuración de entorno
│   ├── redis/             # Configuración de Redis
│   └── services/          # Servicios comunes (fecha, tareas)
└── modules/               # Módulos de funcionalidad
    ├── users/             # Gestión de usuarios
    ├── districts/         # Distritos y tarifas eléctricas
    ├── devices/           # Dispositivos eléctricos
    ├── daily-consumptions/ # Consumos diarios
    ├── monthly-consumptions/ # Resúmenes mensuales
    ├── goals/             # Metas de ahorro
    ├── savings/           # Cálculo de ahorros
    ├── notifications/     # Sistema de notificaciones
    ├── videos/            # Contenido educativo
    ├── medals/            # Sistema de logros
    ├── users-videos/      # Relación usuarios-videos
    ├── users-medals/      # Relación usuarios-medallas
    ├── mails/             # Servicios de email
    └── chatbot/           # Asistente virtual
```

---

## 🚀 Instalación

### **Prerrequisitos**
- Node.js 18+ 
- PostgreSQL 12+
- Redis 6+
- npm o yarn

### **Clonar el Repositorio**
```bash
git clone https://github.com/CarlitoUwU/ti_backend
cd ti_backend
```

### **Instalar Dependencias**
```bash
npm install
```

---

## ⚙️ Configuración

### **1. Variables de Entorno**
Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Security
BCRYPT_SALT=10

# Timezone (DO NOT CHANGE - Required for Peru timezone)
TZ=America/Lima

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@your-domain.com

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### **2. Base de Datos**
```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Sembrar datos iniciales
npx prisma db seed
```

### **3. Redis**
Asegúrate de que Redis esté corriendo:
```bash
redis-server
```

---

## 🔧 Uso

### **Desarrollo**
```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo debug
npm run start:debug
```

### **Producción**
```bash
# Compilar el proyecto
npm run build

# Ejecutar en producción
npm run start:prod
```

### **URLs Importantes**
- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/swagger
- **Health Check**: http://localhost:3000/api

---

## 📊 API Endpoints

### **🔐 Autenticación**
```http
POST /api/users/login                    # Iniciar sesión
POST /api/users                         # Registrar usuario
POST /api/users/create-reset-password    # Solicitar recuperación
POST /api/users/verify-reset-code        # Verificar código
POST /api/users/reset-password           # Restablecer contraseña
```

### **👤 Usuarios**
```http
GET    /api/users                 # Listar usuarios
GET    /api/users/:id             # Obtener usuario específico
PATCH  /api/users/:id/activate    # Activar usuario
PATCH  /api/users/:id/deactivate  # Desactivar usuario
DELETE /api/users/:id             # Eliminar usuario
```

### **📊 Consumos Diarios**
```http
POST   /api/daily-consumptions                           # Registrar consumo
GET    /api/daily-consumptions                           # Listar consumos
GET    /api/daily-consumptions/user/:userId              # Consumos por usuario
GET    /api/daily-consumptions/user/:userId/date         # Consumos por fecha
PUT    /api/daily-consumptions/:id                       # Actualizar consumo
PATCH  /api/daily-consumptions/:id/activate              # Activar registro
PATCH  /api/daily-consumptions/:id/deactivate            # Desactivar registro
DELETE /api/daily-consumptions/:id                       # Eliminar consumo
```

### **🎯 Metas**
```http
POST   /api/goals                        # Crear meta mensual
GET    /api/goals                        # Listar metas
GET    /api/goals/user/:userId           # Metas por usuario
GET    /api/goals/user/:userId/period    # Metas por período
PUT    /api/goals/:id                    # Actualizar meta
PATCH  /api/goals/:id/activate           # Activar meta
PATCH  /api/goals/:id/deactivate         # Desactivar meta
DELETE /api/goals/:id                    # Eliminar meta
```

### **💰 Ahorros**
```http
GET    /api/savings                      # Listar ahorros
GET    /api/savings/user/:userId         # Ahorros por usuario
GET    /api/savings/user/:userId/period  # Ahorros por período
PATCH  /api/savings/:id                  # Recalcular ahorros
```

### **📱 Dispositivos**
```http
POST   /api/devices              # Crear dispositivo
GET    /api/devices              # Listar dispositivos
GET    /api/devices/:id          # Obtener dispositivo
PATCH  /api/devices/:id/activate # Activar dispositivo
DELETE /api/devices/:id          # Eliminar dispositivo
```

### **🏛️ Distritos**
```http
POST   /api/districts            # Crear distrito
GET    /api/districts            # Listar distritos
GET    /api/districts/:id        # Obtener distrito
DELETE /api/districts/:id        # Eliminar distrito
```

---

## 🔔 Sistema de Notificaciones

### **Tipos de Notificaciones**

#### **🔑 Al Login**
```http
POST /api/notifications/check-login/:userId
```
- Meta mensual faltante
- Consumo diario pendiente (después de las 18:00)
- Meta superada (crítico)

#### **⚡ Tiempo Real** (Automáticas)
- Cerca del límite de meta (80%)
- Meta superada
- Se ejecutan al registrar consumo diario

#### **🕐 Programadas (Cron Jobs)**

**Diario (18:00 Perú)**
```http
POST /api/notifications/check-daily-all
```
- Recordatorio de consumo diario faltante

**Semanal (Domingos 10:00 Perú)**
```http
POST /api/notifications/check-weekly-all
```
- Verificación de progreso hacia la meta
- Notificación de progreso positivo (ahorro > 15%)

**Mensual**
```http
POST /api/notifications/check-month-start-all  # Día 1, 09:00
POST /api/notifications/check-month-end-all    # Último día, 20:00
```
- Inicio: Recordatorio para establecer meta
- Fin: Resumen mensual de ahorro/gasto

### **Ejemplos de Mensajes**
- 📱 *"¡No olvides registrar tu consumo energético de hoy!"*
- ⚠️ *"¡Atención! Has usado 85% de tu meta mensual. Te quedan 12.5 kWh disponibles."*
- 🎉 *"¡Felicitaciones! Estás ahorrando 15.2 kWh este mes (20% de eficiencia)."*
- 📊 *"Resumen de Junio 2025: ¡Ahorraste 25.8 kWh y S/ 18.50! 🎉"*

### **Configuración de Cron Jobs**
Los cron jobs están configurados automáticamente en `TasksService` con zona horaria de Perú (America/Lima):

```typescript
// Diario 18:00
@Cron('0 18 * * *', { timeZone: 'America/Lima' })

// Semanal Domingos 10:00  
@Cron('0 10 * * 0', { timeZone: 'America/Lima' })

// Mensual día 1, 09:00
@Cron('0 9 1 * *', { timeZone: 'America/Lima' })
```

---

## 🏃‍♂️ Ejecutar el Proyecto

### **Comando Rápido**
```bash
# Instalar dependencias y ejecutar
npm install && npm run start:dev
```

### **Con Docker (Opcional)**
```bash
# Construir imagen
docker build -t light-for-life-api .

# Ejecutar contenedor
docker run -p 3000:3000 light-for-life-api
```

### **URLs de Verificación**
- ✅ **API**: http://localhost:3000/api
- ✅ **Swagger Docs**: http://localhost:3000/swagger
- ✅ **Health Check**: Verificar que muestre el mensaje de bienvenida

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov

# Linting
npm run lint
```

---

## 📦 Deployment

### **Variables de Entorno de Producción**
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/prod_db
REDIS_HOST=prod_redis_host
MAIL_HOST=production_smtp_host
```

### **Plataformas Recomendadas**
- **Backend**: Railway, Render, DigitalOcean
- **Base de Datos**: Railway PostgreSQL, AWS RDS
- **Redis**: Railway Redis, AWS ElastiCache
- **DNS/CDN**: Cloudflare

### **Comandos de Deployment**
```bash
# Compilar para producción
npm run build

# Ejecutar migraciones
npx prisma migrate deploy

# Iniciar en producción
npm run start:prod
```

---

## 🤝 Contribuir

### **Estructura de Commits**
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: añadir tests
chore: tareas de mantenimiento
```

### **Pull Requests**
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📞 Soporte

### **Equipo de Desarrollo**
- **Email**: LightForLifeX@gmail.com
- **Documentación**: http://localhost:3000/swagger (en desarrollo)

### **Reportar Issues**
Para reportar bugs o solicitar nuevas funcionalidades, por favor crear un issue en el repositorio con:
- Descripción detallada del problema
- Pasos para reproducir
- Screenshots (si aplica)
- Información del entorno

---

## 📄 Licencia

Este proyecto está bajo la licencia **UNLICENSED** - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🌟 Agradecimientos

- **NestJS** por el framework robusto y escalable
- **Prisma** por el excelente ORM
- **Comunidad TypeScript** por las herramientas y librerías

---

<p align="center">
  <strong>Desarrollado con ❤️ por el equipo de Light for Life</strong><br>
  <em>Promoviendo un futuro más sostenible a través de la tecnología</em>
</p>

---

**🌱 Juntos hacia un futuro más verde y eficiente energéticamente 🌱**
