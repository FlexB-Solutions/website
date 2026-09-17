/* Cal.com wird erst nach einer bewussten Aktion geladen. */
(function () {
  const calScript = 'https://app.cal.com/embed/embed.js';
  const calOrigin = 'https://cal.com';
  const colors = {
    'cal-brand': '#187344',
    'cal-brand-emphasis': '#135e39',
    'cal-brand-text': '#ffffff',
    'cal-brand-subtle': '#dfeee3',
    'cal-text': '#405047',
    'cal-text-emphasis': '#14261f',
    'cal-text-subtle': '#6b7d73',
    'cal-text-muted': '#9aa9a0',
    'cal-bg': '#f6f5f0',
    'cal-bg-emphasis': '#ffffff',
    'cal-bg-subtle': '#edf4ef',
    'cal-bg-muted': '#f1f4ef',
    'cal-border': '#d8ded6',
    'cal-border-emphasis': '#b9cdbd',
    'cal-border-subtle': '#e3e9e2',
    radius: '8px'
  };

  function queueCal() {
    window.Cal = window.Cal || function () {
      const cal = window.Cal;
      const args = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = document.createElement('script');
        script.src = calScript;
        script.async = true;
        document.head.appendChild(script);
        // Sofort setzen: init, ui und modal kommen vor dem Laden an und dürfen das Skript nur einmal einfügen.
        cal.loaded = true;
      }
      if (args[0] === 'init') {
        const api = function () { api.q.push(arguments); };
        api.q = api.q || [];
        const namespace = args[1];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          cal.ns[namespace].q.push(args);
        } else {
          cal.q.push(args);
        }
      } else {
        cal.q = cal.q || [];
        cal.q.push(args);
      }
    };
  }

  function openCalBooking() {
    queueCal();
    window.Cal('init', { origin: calOrigin });
    window.Cal('ui', {
      theme: 'light',
      styles: { body: { background: 'transparent' }, eventTypeListItem: { background: 'transparent' } },
      cssVarsPerTheme: { light: colors, dark: colors }
    });
    window.Cal('modal', { calLink: 'flexb/kostenloses-erstgesprach', config: { theme: 'light' } });
  }

  window.openCalBooking = openCalBooking;
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-open-booking').forEach(function (button) {
      button.addEventListener('click', openCalBooking);
    });
  });
})();
