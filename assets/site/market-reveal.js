const marketRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal, .curve-card, .card, .ladder').forEach((element) => {
  marketRevealObserver.observe(element);
});
