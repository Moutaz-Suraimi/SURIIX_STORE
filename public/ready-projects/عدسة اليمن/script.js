// Gallery filter
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.g-item');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    items.forEach(it => {
      it.style.display = (cat === 'الكل' || it.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// Booking form
const form = document.getElementById('bookingForm');
const toast = document.getElementById('toast');
form.addEventListener('submit', e => {
  e.preventDefault();
  toast.textContent = 'تم استلام طلبك — سنتواصل خلال ٢٤ ساعة';
  toast.classList.add('show');
  form.reset();
  setTimeout(() => toast.classList.remove('show'), 3500);
});

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50 ? 'rgba(10,10,10,.85)' : 'rgba(10,10,10,.5)';
});