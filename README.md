# Subastop

Subastop es una plataforma de gestión de inventario construida con Next.js y Redux Toolkit.

## Instrucciones de Instalación y Ejecución

### Requisitos Previos
- Node.js (se recomienda la versión 20 o superior)
- npm o yarn

### Instalación
Para instalar las dependencias del proyecto, ejecute el siguiente comando en la raíz del directorio:

```bash
npm install
```

### Ejecución en Desarrollo
Para iniciar el servidor de desarrollo, utilice:

```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

### Construcción para Producción
Para generar el bundle de producción:

```bash
npm run build
```

### Ejecución de Pruebas
Para ejecutar las pruebas unitarias con Vitest:

```bash
npm run test
```

## Estrategia de Feature-Oriented Design (FOD)

El proyecto sigue una arquitectura orientada a características (Feature-Oriented Design), la cual organiza el código basándose en el dominio del negocio y las funcionalidades en lugar de solo por tipos de archivos técnicos.

### Estructura de Directorios
- **src/features**: Contiene los módulos principales de la aplicación. Cada carpeta dentro de `features` representa una funcionalidad independiente (ej. `inventory`, `preferences`) que encapsula sus propios:
  - Componentes de interfaz de usuario específicos.
  - Lógica de estado (slices y selectors).
  - Servicios de API o hooks.
  - Pruebas unitarias.
- **src/shared**: Alberga recursos reutilizables en múltiples características, como componentes de UI base (botones, inputs), layouts generales y utilidades.
- **src/store**: Configuración centralizada del estado global de la aplicación utilizando Redux Toolkit.
- **src/app**: Directorio principal de Next.js para el enrutamiento y la composición de páginas utilizando componentes de las distintas características.

### AI Disclosure
El proyecto fue desarrollado con Antigravity y Gemini. Se utilizó IA para la generación de código base y pruebas mediante el uso de PRD (Product Requirements Document) y Arquitectura.

Se realizó la revisión del flujo y lógica general del proyecto, y se corrigieron errores y problemas de rendimiento como el uso de debounce en el buscador. Además, se afianzó ciertos aspectos de la arquitectura, se mejoró la experiencia de usuario como con los estilos y la paginación.

### COMENTARIOS PARA EL REVISOR
Se requirió que al guardar, se active una invalidación de tags para que se refleje el cambio en la lista de productos sin necesidad de recargar la página. Sin embargo, esto hace que no se vea en la lista el producto creado o editado. Como una solución, para la edición de producto, no se realiza la invalidación de tags, sino que se utiliza updateQueryData para actualizar el producto en la lista. Para la creación de producto, sí se realiza la invalidación de tags.
