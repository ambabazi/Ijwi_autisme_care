document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  if (user) {
    navLinks.innerHTML = `
      <a href="/dashboard.html">Dashboard</a>
      <a href="/screening.html">Screen a child</a>
      <a href="/awareness.html">Awareness</a>
      <span style="color:#4b5563;font-size:14px;padding:6px 8px">👤 ${user.name}</span>
      <button class="btn-nav" onclick="logout()" style="background:#dc2626;border:none;cursor:pointer;color:#fff;padding:6px 16px;border-radius:6px;font-size:14px;font-weight:600">Logout</button>
    `;
  } else {
    navLinks.innerHTML = `
      <a href="/awareness.html">Awareness</a>
      <a href="/login.html">Login</a>
      <a href="/register.html" class="btn-nav">Register</a>
    `;
  }
});