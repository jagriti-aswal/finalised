// Mobile Menu Toggle
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  menuBtn.innerHTML = navLinks.classList.contains("active")
    ? '<i data-lucide="x"></i>'
    : '<i data-lucide="menu"></i>';
  lucide.createIcons();
});
