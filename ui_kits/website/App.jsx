// App.jsx, Wurzelkomponente der Startseite
function App() {
  const [introActive, setIntroActive] = React.useState(() => !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Alle Termin-Buttons öffnen den veröffentlichten Cal.com-Eventtyp.
  React.useEffect(() => {
    window.openBooking = () => {
      window.Cal('init', { origin: 'https://cal.com' });
      window.Cal('ui', { theme: 'light', hideEventTypeDetails: false, styles: { body: { background: 'transparent' }, eventTypeListItem: { background: 'transparent' } }, cssVarsPerTheme: { light: { 'cal-brand': '#187344', 'cal-brand-emphasis': '#135e39', 'cal-brand-text': '#ffffff', 'cal-brand-subtle': '#dfeee3', 'cal-text': '#405047', 'cal-text-emphasis': '#14261f', 'cal-text-subtle': '#6b7d73', 'cal-text-muted': '#9aa9a0', 'cal-bg': '#f6f5f0', 'cal-bg-emphasis': '#ffffff', 'cal-bg-subtle': '#edf4ef', 'cal-bg-muted': '#f1f4ef', 'cal-border': '#d8ded6', 'cal-border-emphasis': '#b9cdbd', 'cal-border-subtle': '#e3e9e2', 'radius': '8px' }, dark: { 'cal-brand': '#187344', 'cal-brand-emphasis': '#135e39', 'cal-brand-text': '#ffffff', 'cal-brand-subtle': '#dfeee3', 'cal-text': '#405047', 'cal-text-emphasis': '#14261f', 'cal-text-subtle': '#6b7d73', 'cal-text-muted': '#9aa9a0', 'cal-bg': '#f6f5f0', 'cal-bg-emphasis': '#ffffff', 'cal-bg-subtle': '#edf4ef', 'cal-bg-muted': '#f1f4ef', 'cal-border': '#d8ded6', 'cal-border-emphasis': '#b9cdbd', 'cal-border-subtle': '#e3e9e2', 'radius': '8px' } } });
      window.Cal('modal', { calLink: 'flexb/kostenloses-erstgesprach', config: { theme: 'light' } });
    };
    return () => { delete window.openBooking; };
  }, []);
  React.useEffect(() => {
    if (!window.location.hash) return;
    const scrollToHash = () => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView();
    };
    [120, 600, 1200].forEach(delay => setTimeout(scrollToHash, delay));
  }, []);
  return (
    <div>
      <EntrySequence onActiveChange={setIntroActive} />
      <div inert={introActive ? "" : undefined}>
      <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>
      <Nav />
      <main id="inhalt">
        <Hero />
        <Services />
        <ForWhom />
        <Results />
        <Inspiration />
        <About />
        <Contact />
      </main>
      <Footer />
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
