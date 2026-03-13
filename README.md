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

### Beneficios Aplicados
1. **Escalabilidad**: Facilita la adición de nuevas funcionalidades sin afectar la estructura global.
2. **Mantenibilidad**: Al mantener la lógica relacionada agrupada, es más sencillo localizar y corregir errores o realizar mejoras.
3. **Bajo Acoplamiento**: Las características son independientes entre sí, comunicándose a través de interfaces claras o del estado global cuando es estrictamente necesario.
