// App.jsx, Wurzelkomponente der Startseite
function App() {
  const [introActive, setIntroActive] = React.useState(() => !window.location.hash && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Alle Termin-Buttons öffnen den veröffentlichten Cal.com-Eventtyp.
  React.useEffect(() => {
    window.openBooking = () => {
      window.openCalBooking?.();
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
