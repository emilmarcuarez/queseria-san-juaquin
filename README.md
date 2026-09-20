# Quesería San Joaquín • Mercado & Charcutería Digital

> Plataforma web de comercio digital y catálogo interactivo de alta fidelidad desarrollada para **Quesería San Joaquín** (Maracaibo, Venezuela), especializada en quesería fresca, charcutería al corte rebanada al gusto y despensa completa de víveres nacionales e importados.

Desarrollado y producido por **EM Projects**.

---

## 📌 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Arquitectura y Estructura del Proyecto](#-arquitectura-y-estructura-del-proyecto)
3. [Características Principales](#-características-principales)
4. [Tecnologías y Librerías Utilizadas](#-tecnologías-y-librerías-utilizadas)
5. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
6. [Variables de Entorno](#-variables-de-entorno)
7. [Créditos](#-créditos)

---

## 🏬 Descripción General

**Quesería San Joaquín** es una solución e-commerce diseñada con enfoque mobile-first y estética retail moderna para el mercado venezolano. Permite a los clientes explorar productos emblemáticos (Harina P.A.N., Jamón Plumrose, Diablitos Underwood, Queso Zuliano, Café Fama de América, etc.), configurar cantidades exactas por kilogramo o unidades, visualizar precios duales en Dólares ($ USD) y Bolívares (Bs. con tasa oficial BCV), y formalizar pedidos directamente a través de WhatsApp con un desglose estructurado y formal.

---

## 🏗 Arquitectura y Estructura del Proyecto

El proyecto está construido bajo una arquitectura modular en componentes limpios y desacoplados:

```plaintext
queseria-san-juaquin/
├── public/
│   ├── images/
│   │   ├── hero/               # Banners fotográficos optimizados para el carrusel de inicio
│   │   ├── products/           # Fotografía de catálogo con empaques reales de Venezuela
│   │   └── logo/               # Identidad visual de Quesería San Joaquín
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── cart/               # Modal lateral (Drawer) del carrito y confirmación
│   │   ├── common/             # Barra de anuncios, navbar principal, footer, sticky action bar
│   │   ├── home/               # Hero carrusel, ventajas competitivas, vitrina de pasillos, testimonios
│   │   ├── pages/              # Páginas autónomas: Inicio, Tienda, Nosotros, Contacto, Detalle de Producto
│   │   └── products/           # Tarjetas de productos, modal de zoom interactivo
│   ├── context/
│   │   └── ShoppingCartContext # Estado global del carrito (persistencia en LocalStorage)
│   ├── data/
│   │   ├── productsCatalogData.json     # Catálogo completo con 31 productos emblemáticos
│   │   └── departmentsCatalogData.json  # Departamentos y pasillos comerciales
│   ├── hooks/
│   │   ├── useProductCatalogFilter.js   # Lógica desacoplada de filtrado y búsqueda
│   │   └── useShoppingCart.js           # Consumo del contexto de carrito
│   ├── styles/
│   │   └── index.css           # Configuración de Tailwind CSS y animaciones fluidas
│   ├── App.jsx                 # Enrutamiento basado en hash y coordinación de vistas
│   └── main.jsx                # Punto de entrada de la aplicación
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ✨ Características Principales

### 1. Separación de Vistas: Inicio y Tienda
- **Página de Inicio (`Inicio`):** Presenta el carrusel comercial inmersivo con imágenes de charcutería y despensa venezolana, barra de ventajas del supermercado, vitrina visual de categorías comerciales, sección de "Los Más Pedidos" con acceso directo a la tienda, guía de compra paso a paso y testimonios de clientes de Maracaibo.
- **Tienda Especializada (`Tienda`):** Vista dedicada que reúne el catálogo completo de productos con herramientas avanzadas de exploración:
  - **Buscador Especial Integrado:** Entrada de búsqueda en tiempo real dentro del catálogo.
  - **Filtros por Categoría:** Botones con conteo dinámico de productos disponibles.
  - **Agrupación por Categoría:** Alternador para ver los productos ordenados por categorías o en cuadrícula continua.
  - **Ordenamiento Multicriterio:** Clasificación por más vendidos, precio ascendente/descendente y orden alfabético.
  - **Paginación Inteligente:** Distribución fluida de 12 productos por página con controles de navegación rápida.
  - **Ocultamiento de Buscador en Cabecera:** Al estar en la tienda, el buscador general del header se oculta de forma automática para evitar redundancia y ceder protagonismo al buscador de la página.

### 2. Detalle de Producto y Zoom Interactivo
- Ficha técnica completa con descripción, especificaciones por ración, selector de peso/unidades y cálculo automático del subtotal en USD y Bs.
- **Modal de Zoom en Alta Resolución:** Permite hacer clic sobre la fotografía del producto para ampliar la imagen, examinar detalles de etiquetas y empaques, con controles de aumento, disminución y restablecimiento.

### 3. Sistema de Carrito y Generador de Pedidos WhatsApp
- Carrito flotante en dispositivos móviles con contador dinámico en tiempo real.
- Panel lateral deslizable (Cart Drawer) con control de cantidades, eliminación de ítems, resumen del subtotal y conversión dual BCV.
- Formulario de despacho con selección de método de entrega (Delivery a domicilio o Retiro en tienda).
- Redacción automática de mensaje de WhatsApp con formato profesional listo para enviar a la central de ventas.

### 4. Experiencia Móvil Optimizada (Mobile-First)
- Menú lateral deslizante con efecto de desenfoque de fondo (*glassmorphism*) y bloqueo de scroll nativo mientras se encuentra abierto.
- Botón flotante compacto del carrito sin solapamiento de notificaciones ni elementos superfluos.
- Paleta de colores balanceada en verdes esmeralda (`#114B2B`), blancos puros y neutros sutiles para una lectura limpia y profesional.

---

## 🛠 Tecnologías y Librerías Utilizadas

- **React 18**: Biblioteca base para componentes reactivos y gestión de ciclo de vida.
- **Vite 5**: Entorno de desarrollo ultrarrápido y empaquetador de producción optimizado.
- **Tailwind CSS 3**: Framework de utilidades para maquetación responsiva y sistema de diseño.
- **AOS (Animate On Scroll)**: Micro-animaciones en cascada al desplazarse por la interfaz.
- **Canvas Confetti**: Efecto festivo de confirmación al tramitar pedidos con éxito.
- **Google Material Symbols & Fonts**: Iconografía vectorial escalable y tipografía Inter.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js (versión 18.0 o superior recomendada)
- npm o yarn

### Pasos de Instalación

1. Clonar el repositorio o posicionarse en el directorio del proyecto:
```bash
cd queseria-san-juaquin
```

2. Instalar las dependencias del proyecto:
```bash
npm install
```

3. Iniciar el servidor de desarrollo local:
```bash
npm run dev
```
La aplicación estará disponible de forma predeterminada en `http://localhost:3000/`.

4. Construir la versión de producción:
```bash
npm run build
```

5. Previsualizar la compilación de producción:
```bash
npm run preview
```

---

## ⚙️ Variables de Entorno

Puedes personalizar los siguientes valores en un archivo `.env` en la raíz del proyecto:

```env
# Número de teléfono para la recepción de pedidos en WhatsApp (código de país + número)
VITE_WHATSAPP_PHONE_NUMBER=584147675800

# Tasa de cambio oficial de referencia (VES por USD)
VITE_BCV_EXCHANGE_RATE=71.50
```

---

## 💼 Créditos y Autoría

Proyecto conceptualizado, diseñado y desarrollado por **EM Projects**.
Todos los derechos reservados.
