# Nebula | Red Social Creativa — MERCEDES DE LUNA

## Índice
- [Introducción](#introducción)
- [Funcionalidades y tecnologías](#funcionalidades-y-tecnologías)
- [Guía de instalación](#guía-de-instalación)
- [Guía de uso](#guía-de-uso)
- [Conclusión](#conclusión)
- [Contribuciones, agradecimientos y referencias](#contribuciones-agradecimientos-y-referencias)
- [Licencias](#licencias)
- [Contacto](#contacto)

## Introducción
**Descripción:** Nebula es una red social ligera enfocada en compartir publicaciones cortas entre estudiantes.  
**Justificación:** Proyecto final de la 1ª evaluación de **Desarrollo de Aplicaciones Web (DAW)** para demostrar dominio de React, routing, gestión de estado y consumo de API.  
**Objetivos:**  
- Autenticación con contexto y almacenamiento local.  
- CRUD de publicaciones con paginación y scroll infinito.  
- Perfiles públicos/privados con seguimiento de usuarios.  
**Motivación:** Crear una experiencia ágil tipo microblog, optimizada para feedback rápido entre compañeros.

## Funcionalidades y tecnologías
**Funcionalidades clave**
- Registro e inicio de sesión con persistencia de sesión.
- Creación y borrado de publicaciones.
- Feed general y feed de seguidos con scroll infinito.
- Perfiles públicos y propio, con contadores y modales de seguidores/siguiendo.
- Navegación protegida por estado de autenticación.
- Animaciones suaves (GSAP + ScrollTrigger).

**Tecnologías**
- React 18 + Vite.
- React Router DOM.
- React Query (@tanstack/react-query).
- React Hook Form.
- GSAP (animaciones).
- Fetch API con token JWT y helpers propios.
- CSS modularizado en `global.css` (estilo “Nebula”).

## Guía de instalación
```bash
# 1) Clonar el repositorio
git clone https://github.com/MercedesDeLunaIbanez/RedSocialFront.git
cd RedSocialFront

# 2) Instalar dependencias
npm install

# 3) Variables 
http://localhost:8080/api/v1


# 4) Ejecutar en desarrollo
npm run dev
Abrir http://localhost:5173
```

## Guía de uso
1) **Registro/Login:** Accede a `/` para iniciar sesión o a `/register` para crear cuenta.  
2) **Crear publicación:** Tras loguearte, usa el formulario “Crea una nueva publicación”.  
3) **Explorar:**  
   - Feed de seguidos en `/` (Home).  
   - Todas las publicaciones en `/all`.  
4) **Perfiles:**  
   - Tu perfil y tus publicaciones en `/me`.  
   - Perfil público de otro usuario en `/profile/:name`.  
5) **Seguir/Dejar de seguir:** Botón en el perfil público; contadores con modal de listas.

## Conclusión
Nebula demuestra un flujo completo de autenticación, consumo de API y experiencia de usuario fluida con animaciones y datos paginados, cumpliendo los objetivos de la evaluación de DAW.

## Contribuciones, agradecimientos y referencias
- Inspiración UI/UX: microblogging moderno.
- Librerías: React, React Query, GSAP, React Hook Form, Vite.
- Agradecimientos: profesorado de DAW y compañeros por el feedback.

## Licencias
Código bajo licencia MIT.

## Contacto
- Autor: **Mercedes de Luna**
- Email: mercedes.deluna@a.vedrunasevillasj.es
- GitHub: https://github.com/mercedesVedruna/MercedesDeLuna.git
