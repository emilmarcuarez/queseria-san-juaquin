export const STORE_OFFICIAL_DATA = {
  storeName: 'Quesería San Joaquín',
  storeSubtitle: 'Mercado & Charcutería',
  phoneNumber: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016',
  formattedPhone: '+58 414-6770016',
  fullAddress: import.meta.env.VITE_STORE_ADDRESS || 'Av. 10 con Calle 66, al lado de Ame-Zulia, Maracaibo, Venezuela 4002',
  shortAddress: 'Av. 10 con Calle 66, al lado de Ame-Zulia, Maracaibo',
  city: 'Maracaibo',
  state: 'Zulia',
  country: 'Venezuela',
  zipCode: '4002',
  scheduleSummary: 'Lun a Vie: 7:00 AM - 7:00 PM | Sáb: 7:00 AM - 6:00 PM',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+10+con+Calle+66,+Maracaibo,+Venezuela',
  wazeUrl: 'https://waze.com/ul?q=Av.+10+con+Calle+66,+Maracaibo',
  embedMapQuery: 'Av.+10+con+Calle+66,+Maracaibo,+Zulia,+Venezuela'
};

export const getStoreCurrentScheduleStatus = () => {
  try {
    const venezuelaDateString = new Date().toLocaleString('en-US', {
      timeZone: 'America/Caracas'
    });
    const currentDateInVenezuela = new Date(venezuelaDateString);

    const dayOfWeek = currentDateInVenezuela.getDay();
    const currentHour = currentDateInVenezuela.getHours();
    const currentMinute = currentDateInVenezuela.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const weekdayOpenMinutes = 7 * 60;
    const weekdayCloseMinutes = 19 * 60;
    const saturdayCloseMinutes = 18 * 60;

    let isOpen = false;
    let closingTimeText = '';

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (currentTotalMinutes >= weekdayOpenMinutes && currentTotalMinutes < weekdayCloseMinutes) {
        isOpen = true;
        closingTimeText = '7:00 PM';
      }
    } else if (dayOfWeek === 6) {
      if (currentTotalMinutes >= weekdayOpenMinutes && currentTotalMinutes < saturdayCloseMinutes) {
        isOpen = true;
        closingTimeText = '6:00 PM';
      }
    }

    if (isOpen) {
      return {
        isOpen: true,
        statusBadgeText: 'Abierto Ahora',
        statusDetailText: `Atendiendo despachos hasta las ${closingTimeText}`,
        accentColorClass: 'text-emerald-400',
        badgeBgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotPulseClass: 'bg-emerald-400'
      };
    }

    let nextOpeningMessage = 'Abre mañana a las 7:00 AM — ¡Deja tu pedido programado!';
    if (dayOfWeek === 0) {
      nextOpeningMessage = 'Abrimos el lunes a las 7:00 AM — ¡Deja tu pedido programado!';
    } else if (currentTotalMinutes < weekdayOpenMinutes) {
      nextOpeningMessage = 'Abrimos hoy a las 7:00 AM — ¡Puedes armar tu pedido!';
    } else if (dayOfWeek === 6 && currentTotalMinutes >= saturdayCloseMinutes) {
      nextOpeningMessage = 'Abrimos el lunes a las 7:00 AM — ¡Deja tu pedido programado!';
    }

    return {
      isOpen: false,
      statusBadgeText: 'Cerrado en este momento',
      statusDetailText: nextOpeningMessage,
      accentColorClass: 'text-amber-400',
      badgeBgClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dotPulseClass: 'bg-amber-400'
    };
  } catch (scheduleCalculationError) {
    return {
      isOpen: true,
      statusBadgeText: 'Abierto',
      statusDetailText: 'Lun a Vie: 7:00 AM - 7:00 PM | Sáb: 7:00 AM - 6:00 PM',
      accentColorClass: 'text-emerald-400',
      badgeBgClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotPulseClass: 'bg-emerald-400'
    };
  }
};
