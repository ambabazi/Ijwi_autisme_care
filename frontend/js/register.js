const DISTRICTS = [
  'Bugesera','Burera','Gakenke','Gasabo','Gatsibo','Gicumbi','Gisagara',
  'Huye','Kamonyi','Karongi','Kayonza','Kicukiro','Kirehe','Muhanga',
  'Musanze','Ngoma','Ngororero','Nyabihu','Nyagatare','Nyamagabe',
  'Nyamasheke','Nyanza','Nyarugenge','Nyaruguru','Rubavu','Ruhango',
  'Rulindo','Rusizi','Rutsiro','Rwamagana'
];

function populateDistricts(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  DISTRICTS.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    sel.appendChild(opt);
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('input, select').forEach(e => e.classList.remove('error'));
}

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}