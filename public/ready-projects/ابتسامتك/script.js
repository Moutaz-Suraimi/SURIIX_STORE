document.getElementById('year').textContent = new Date().getFullYear();

function showToast(msg, type){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type||'');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>t.classList.remove('show'), 3500);
}

function whatsappBook(){
  const msg = encodeURIComponent('مرحباً، أرغب في حجز موعد في عيادة YemenSmile');
  window.open('https://wa.me/967780930635?text=' + msg, '_blank');
}

document.getElementById('bookingForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  if(!name || !phone || !service || !date){
    showToast('الرجاء تعبئة جميع الحقول','error');
    return;
  }
  showToast('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً.','success');
  this.reset();
});
