# 🍽️ Sistema de Reservas para Restaurante

Aplicación web desarrollada con **React + Vite** que permite a los clientes realizar reservas online y al administrador gestionar las reservas desde un **panel de administración privado**.

👉 **Demo en vivo:**  
https://ianpallero03.github.io/sistema-reservas-restaurante/

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React**
- ⚡ **Vite**
- 🎨 **Tailwind CSS**
- 🔥 **Firebase**
  - Firestore (base de datos)
  - Firebase Authentication (login de administrador)
- 🎞️ **Framer Motion**
- 🌐 **GitHub Pages** (deploy)

---

## ✨ Funcionalidades principales

### 🧑‍🍳 Usuario
- Realizar reservas indicando:
  - Nombre
  - Teléfono
  - Fecha
  - Horario
  - Cantidad de personas
- Validaciones en tiempo real:
  - Solo se permiten reservas para la **semana actual**
  - Control de **capacidad máxima por día**
  - Mensajes claros cuando no hay disponibilidad
- Interfaz responsive (adaptada a mobile y desktop)
- Diseño moderno y animaciones suaves

---

### 🔐 Panel de Administrador
- Acceso protegido mediante **Firebase Authentication**
- Login exclusivo para administradores
- Visualización y gestión de reservas
- Separación completa entre:
  - Sitio público
  - Panel admin (`admin.html`)

---

## 🛠️ Lógica destacada

- Control de cupos diarios
- Bloqueo automático de reservas cuando se alcanza la capacidad máxima
- Validación de fechas dentro de la semana actual
- Manejo de errores y mensajes al usuario
- Estructura pensada para escalar el proyecto

---

## 📁 Estructura general del proyecto

src/
├── components/
├── admin/
│ ├── AdminApp.jsx
│ ├── AdminLogin.jsx
│ └── AdminPanel.jsx
├── firebase/
│ └── config.jsx
├── App.jsx
├── main.jsx
public/
├── images/
├── admin.html


---

## 📌 Estado del proyecto

Este proyecto se encuentra **en constante evolución**.  
La idea es seguir mejorándolo con nuevas funcionalidades, optimizaciones y mejores prácticas a medida que continúe aprendiendo y creciendo como desarrollador frontend.

---

## 👨‍💻 Autor

**Ian Pallero**  
Desarrollador Frontend Junior  
📎 LinkedIn | GitHub

---

⭐ Si te gustó el proyecto, ¡no dudes en dejar una estrella!
