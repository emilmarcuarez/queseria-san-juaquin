import 'driver.js/dist/driver.css';
import { driver } from 'driver.js';

const isMobile = () => window.innerWidth < 1024;

export const launchShoppingTour = ({ openCartDrawer }) => {
  const STEP_INDEX_WEIGHT_MODAL = 6;
  const STEP_INDEX_CART_BUTTON  = 7;

  let activeListeners = [];

  const addListener = (eventName, handler, options) => {
    window.addEventListener(eventName, handler, options);
    activeListeners.push({ eventName, handler });
  };

  const removeListener = (eventName, handler) => {
    window.removeEventListener(eventName, handler);
    activeListeners = activeListeners.filter(
      (entry) => !(entry.eventName === eventName && entry.handler === handler)
    );
  };

  const cleanupAllListeners = () => {
    activeListeners.forEach(({ eventName, handler }) => {
      window.removeEventListener(eventName, handler);
    });
    activeListeners = [];
  };


  const clearRingHighlights = () => {
    document.querySelectorAll('.tour-highlight-ring').forEach(
      (highlightedEl) => highlightedEl.classList.remove('tour-highlight-ring')
    );
  };

  const ringHighlight = (getElement) => {
    clearRingHighlights();
    const targetEl = typeof getElement === 'function' ? getElement() : getElement;
    if (targetEl) targetEl.classList.add('tour-highlight-ring');
  };

  const getSearchElement = () => {
    if (!isMobile()) return document.getElementById('tour-search-bar');
    const mobileInput = document.getElementById('mobile-header-search-input');
    if (mobileInput) return mobileInput;
    return document.getElementById('tour-header-wrapper');
  };

  const getCartButtonElement = () =>
    isMobile()
      ? document.getElementById('mobile-floating-cart-button')
      : document.getElementById('tour-cart-button');

  const handleCartScroll = () => {
    if (tourDriver?.isActive()) {
      tourDriver.refresh();
    }
  };

  const scrollElementIntoCartCenter = (targetSelectorOrElement) => {
    const scrollContainerElement = document.getElementById('tour-cart-scroll-container');
    if (!scrollContainerElement) {
      return null;
    }

    const targetElement = typeof targetSelectorOrElement === 'string'
      ? document.querySelector(targetSelectorOrElement)
      : targetSelectorOrElement;

    if (!targetElement) {
      return null;
    }

    const containerRect = scrollContainerElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const currentScrollTop = scrollContainerElement.scrollTop;
    const relativeTargetTop = targetRect.top - containerRect.top + currentScrollTop;

    let desiredViewportYCoordinate = containerRect.top + (scrollContainerElement.clientHeight / 2) - (targetRect.height / 2);

    if (isMobile()) {
      const popoverBottomOffset = 230;
      const footerTopOffset = window.innerHeight - 180;
      const availableVerticalSpace = Math.max(0, footerTopOffset - popoverBottomOffset);
      desiredViewportYCoordinate = popoverBottomOffset + (availableVerticalSpace / 2) - (targetRect.height / 2);
    }

    const calculatedScrollTop = relativeTargetTop + containerRect.top - desiredViewportYCoordinate;
    scrollContainerElement.scrollTop = Math.max(0, calculatedScrollTop);
    return targetElement;
  };

  const tourDriver = driver({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    allowClose: true,
    overlayOpacity: 0.45,
    stagePadding: 10,
    stageRadius: 16,
    progressText: 'Paso {{current}} de {{total}}',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Atrás',
    doneBtnText: '¡Listo!',
    popoverClass: 'sj-tour-popover',
    onDestroyed: () => {
      cleanupAllListeners();
      clearRingHighlights();
      const scrollContainerElement = document.getElementById('tour-cart-scroll-container');
      if (scrollContainerElement) {
        scrollContainerElement.removeEventListener('scroll', handleCartScroll);
      }
      const confirmButtonElement = document.getElementById('tour-weight-modal-confirm-btn');
      if (confirmButtonElement) confirmButtonElement.classList.remove('tour-btn-pulse');
    },
    onHighlighted: () => {
      if (isMobile()) {
        clearRingHighlights();
        const activeElement = tourDriver.getActiveElement();
        if (activeElement) activeElement.classList.add('tour-highlight-ring');
      }
    },
    steps: [

      // ── Paso 1: Bienvenida ──
      {
        popover: {
          title: 'Bienvenido al tutorial',
          description: 'Te mostramos paso a paso cómo hacer tu pedido. Puedes cerrar el tutorial en cualquier momento con la X.',
          align: 'center'
        }
      },

      // ── Paso 2: Búsqueda ──
      {
        element: getSearchElement,
        popover: {
          title: 'Barra de búsqueda',
          description: isMobile()
            ? 'La barra de búsqueda está en la parte superior. Escribe el nombre del producto que necesitas y los resultados aparecen al instante.'
            : 'Escribe aquí el nombre del producto que buscas. Los resultados aparecen al instante mientras escribes.',
          side: 'bottom',
          align: 'center'
        }
      },

      // ── Paso 3: Navegación a Tienda ──
      {
        element: () =>
          isMobile()
            ? document.getElementById('tour-mobile-menu-btn')
            : document.getElementById('tour-nav-store'),
        popover: {
          title: isMobile() ? 'Menú de navegación' : 'Ir a la Tienda',
          description: isMobile()
            ? 'Toca este botón para abrir el menú. Desde ahí puedes ir a Tienda y ver todos los productos por departamento.'
            : 'Toca Tienda para ver el catálogo completo organizado por departamento: Quesería, Charcutería, Víveres y más.',
          side: 'bottom',
          align: 'start'
        }
      },

      // ── Paso 4: Tarjeta de producto ──
      {
        element: () => document.querySelector('[data-product-card]'),
        popover: {
          title: 'Tarjeta de producto',
          description: 'Cada tarjeta muestra el nombre, precio en dólares, equivalente en bolívares a tasa BCV, y el stock disponible.',
          side: isMobile() ? 'bottom' : 'right',
          align: 'start'
        }
      },

      // ── Paso 5: Stock badge ──
      {
        element: () => document.querySelector('[data-product-card] .rounded-full'),
        popover: {
          title: 'Stock disponible',
          description: 'Este indicador muestra cuánto hay disponible. Verde = hay cantidad. Rojo = queda poco. Agotado = no disponible por ahora.',
          side: 'bottom',
          align: 'start'
        }
      },

      // ── Paso 6: Botón Agregar en tarjeta ──
      {
        element: () => document.querySelector('[data-product-card] button[aria-label*="Agregar"]:not([disabled])'),
        popover: {
          title: 'Toca el botón Agregar',
          description: 'Toca el botón Agregar en cualquier tarjeta para continuar.\n\nEl tutorial seguirá automáticamente.',
          side: 'top',
          align: 'center',
          showButtons: ['previous', 'close']
        },
        onHighlightStarted: () => {
          cleanupAllListeners();

          if (isMobile()) {
            requestAnimationFrame(() => {
              const addButtonElement = document.querySelector(
                '[data-product-card] button[aria-label*="Agregar"]:not([disabled])'
              );
              if (addButtonElement) {
                addButtonElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            });
          }

          const onWeightModalOpened = () => {
            removeListener('sj:weight-modal-opened', onWeightModalOpened);
            removeListener('sj:product-added-to-cart', onDirectAdd);
            setTimeout(() => tourDriver.moveTo(STEP_INDEX_WEIGHT_MODAL), 150);
          };

          const onDirectAdd = () => {
            removeListener('sj:product-added-to-cart', onDirectAdd);
            removeListener('sj:weight-modal-opened', onWeightModalOpened);
            setTimeout(() => tourDriver.moveTo(STEP_INDEX_CART_BUTTON), 600);
          };

          addListener('sj:weight-modal-opened', onWeightModalOpened, { once: true });
          addListener('sj:product-added-to-cart', onDirectAdd, { once: true });
        },
        onDeselected: () => {
          cleanupAllListeners();
        }
      },

      {
        element: () => document.getElementById('tour-weight-modal-container'),
        popover: {
          title: 'Selecciona el peso',
          description: isMobile()
            ? 'Elige 250g, 500g, 1 Kg o personalizado. Luego toca el botón verde Agregar.'
            : 'Elige la porción que necesitas:\n250g · 500g · 1 Kg · o personaliza al gramo exacto.\n\nTambién puedes ajustar cuántos paquetes quieres.\n\nCuando estés listo, toca el botón verde Agregar.\n\nEl tutorial seguirá automáticamente.',
          side: 'top',
          align: 'center',
          showButtons: ['previous', 'close'],
          popoverClass: isMobile() ? 'sj-tour-popover sj-popover-top' : 'sj-tour-popover'
        },
        onHighlightStarted: () => {
          cleanupAllListeners();

          if (!isMobile()) {
            const confirmButtonElement = document.getElementById('tour-weight-modal-confirm-btn');
            if (confirmButtonElement) confirmButtonElement.classList.add('tour-btn-pulse');
          }

          const onProductAdded = () => {
            removeListener('sj:product-added-to-cart', onProductAdded);
            const confirmButtonElement = document.getElementById('tour-weight-modal-confirm-btn');
            if (confirmButtonElement) confirmButtonElement.classList.remove('tour-btn-pulse');
            setTimeout(() => tourDriver.moveTo(STEP_INDEX_CART_BUTTON), 600);
          };

          addListener('sj:product-added-to-cart', onProductAdded, { once: true });
        },
        onDeselected: () => {
          cleanupAllListeners();
          const confirmButtonElement = document.getElementById('tour-weight-modal-confirm-btn');
          if (confirmButtonElement) confirmButtonElement.classList.remove('tour-btn-pulse');
        }
      },

      // ── Paso 8 (7 en índice): Botón del carrito ──
      {
        element: getCartButtonElement,
        popover: {
          title: 'Tu carrito de compras',
          description: 'El número muestra cuántos ítems llevas. Tócalo para ver tu lista completa y proceder al pedido.',
          side: isMobile() ? 'top' : 'bottom',
          align: isMobile() ? 'center' : 'end'
        }
      },

      // ── Paso 9 (8 en índice): Lista del carrito (abre drawer) ──
      {
        element: '#tour-cart-items-list',
        popover: {
          title: 'Tu lista de productos',
          description: 'Aquí aparecen todos los productos que agregaste.\n\nUsa – y + para ajustar cantidades, o el ícono de basura para eliminar un artículo.',
          side: isMobile() ? 'bottom' : 'left',
          align: 'center'
        },
        onHighlightStarted: () => {
          openCartDrawer();
          setTimeout(() => {
            const scrollContainerElement = document.getElementById('tour-cart-scroll-container');
            if (scrollContainerElement) {
              scrollContainerElement.addEventListener('scroll', handleCartScroll, { passive: true });
            }
          }, 450);
          return new Promise((resolve) => setTimeout(resolve, 420));
        }
      },

      // ── Paso 10 (9 en índice): Nota o preferencia ──
      {
        element: () => {
          scrollElementIntoCartCenter('[data-tour="add-note-btn"]');
          return document.querySelector('[data-tour="add-note-btn"]');
        },
        popover: {
          title: 'Añadir nota o preferencia',
          description: 'En cada producto puedes agregar una indicación especial.\n\nPor ejemplo: "Rebanar extra fino", "Empaque sellado por separado", "Punto de sal bajo".\n\nEsta nota llega directamente al equipo que prepara tu pedido.',
          side: 'top',
          align: 'start'
        },
        onHighlightStarted: () => {
          scrollElementIntoCartCenter('[data-tour="add-note-btn"]');
          tourDriver.refresh();
        }
      },

      {
        element: () => {
          const scrollContainerElement = document.getElementById('tour-cart-scroll-container');
          if (scrollContainerElement) {
            scrollContainerElement.scrollTop = 0;
          }
          return document.getElementById('tour-clear-cart-btn');
        },
        popover: {
          title: 'Vaciar el carrito',
          description: 'Si quieres empezar de cero, toca Vaciar todo. Esto elimina todos los productos de la lista de una sola vez.',
          side: 'bottom',
          align: 'end'
        },
        onHighlightStarted: () => {
          const scrollContainerElement = document.getElementById('tour-cart-scroll-container');
          if (scrollContainerElement) {
            scrollContainerElement.scrollTop = 0;
          }
          tourDriver.refresh();
        }
      },

      {
        element: () => {
          scrollElementIntoCartCenter('#tour-fulfillment-toggle');
          return document.getElementById('tour-fulfillment-toggle');
        },
        popover: {
          title: 'Delivery o retiro en tienda',
          description: 'Elige cómo recibirás tu pedido:\n\nDelivery: te lo llevamos a tu dirección en Maracaibo.\n\nRetiro en tienda: pasas a buscarlo, sin costo adicional.',
          side: 'top',
          align: 'center'
        },
        onHighlightStarted: () => {
          scrollElementIntoCartCenter('#tour-fulfillment-toggle');
          tourDriver.refresh();
          requestAnimationFrame(() => {
            scrollElementIntoCartCenter('#tour-fulfillment-toggle');
            tourDriver.refresh();
          });
        },
        onHighlighted: () => {
          scrollElementIntoCartCenter('#tour-fulfillment-toggle');
          tourDriver.refresh();
        }
      },

      {
        element: () => {
          scrollElementIntoCartCenter('#tour-customer-name-section');
          return document.getElementById('tour-customer-name-section') || document.getElementById('tour-customer-name-input');
        },
        popover: {
          title: 'Tus datos de contacto',
          description: 'Escribe tu nombre completo y, si elegiste delivery, tu dirección de entrega.\n\nEstos datos se incluirán automáticamente en el mensaje de WhatsApp.',
          side: 'top',
          align: 'center',
          popoverClass: isMobile() ? 'sj-tour-popover sj-popover-top' : 'sj-tour-popover'
        },
        onHighlightStarted: () => {
          scrollElementIntoCartCenter('#tour-customer-name-section');
          tourDriver.refresh();
          requestAnimationFrame(() => {
            scrollElementIntoCartCenter('#tour-customer-name-section');
            tourDriver.refresh();
          });
        },
        onHighlighted: () => {
          scrollElementIntoCartCenter('#tour-customer-name-section');
          tourDriver.refresh();
        }
      },

      // ── Paso 14 (13 en índice): Botón WhatsApp ──
      {
        element: '#tour-whatsapp-btn',
        popover: {
          title: 'Enviar pedido por WhatsApp',
          description: 'Cuando tengas todo listo, toca este botón.\n\nSe abrirá WhatsApp con tu pedido completo ya escrito. Solo envía el mensaje y nos encargamos del resto.',
          side: 'top',
          align: 'center'
        }
      }

    ]
  });

  tourDriver.drive();
};
