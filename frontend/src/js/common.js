// 3. Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeMenuBtn = document.getElementById("close-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function toggleMenu() {
  mobileMenu.classList.toggle("translate-x-full");
  document.body.classList.toggle("overflow-hidden");
}
mobileMenuBtn.addEventListener("click", toggleMenu);
closeMenuBtn.addEventListener("click", toggleMenu);

// 4. USER AUTH & AVATAR LOGIC (CRITICAL)
document.addEventListener("DOMContentLoaded", () => {
  updateNavbarUser();
});

function updateNavbarUser() {
  // Retrieve user data
  const token = localStorage.getItem("token");
  const firstname = localStorage.getItem("first_name") || "Client";
  const lastname = localStorage.getItem("last_name") || "";
  const email = localStorage.getItem("email") || "user@autolux.ma";

  // Select DOM Elements
  const navLoginBtn = document.getElementById("nav-login-btn");
  const navUserInfo = document.getElementById("nav-user-info");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");
  const mobileUserInfo = document.getElementById("mobile-user-info");

  // Logic
  if (token) {
    // --- USER IS LOGGED IN ---

    // 1. Hide Login Buttons
    if (navLoginBtn) navLoginBtn.style.display = "none";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "none";

    // 2. Prepare Avatar Data
    const initials = (firstname[0] + (lastname[0] || "")).toUpperCase();
    const fullName = `${firstname} ${lastname}`.trim();

    // 3. HTML Structure for Avatar + Dropdown
    const avatarHTML = `
            <button class="custom-avatar-btn" title="${fullName}">
                ${initials}
            </button>
            <div class="glass-dropdown">
                <div class="dropdown-header">
                    <p class="dropdown-name">${fullName}</p>
                    <p class="dropdown-email">${email}</p>
                </div>
                <div class="dropdown-body">
                    <button class="dropdown-item">
                        <i class="fa-solid fa-user"></i> Profile
                    </button>
                    <button class="dropdown-item">
                        <i class="fa-solid fa-gear"></i> Settings
                    </button>
                    <button class="dropdown-item logout" onclick="handleLogout()">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                </div>
            </div>
          `;

    // 4. Inject into Desktop Navbar
    if (navUserInfo) {
      navUserInfo.classList.remove("hidden");
      navUserInfo.classList.add("flex");
      navUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(navUserInfo);
    }

    // 5. Inject into Mobile Menu
    if (mobileUserInfo) {
      mobileUserInfo.classList.remove("hidden");
      mobileUserInfo.classList.add("flex");
      mobileUserInfo.innerHTML = avatarHTML;
      setupDropdownListeners(mobileUserInfo);
    }
  } else {
    // --- USER IS GUEST ---
    if (navLoginBtn) navLoginBtn.style.display = "block";
    if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
    if (navUserInfo) navUserInfo.classList.add("hidden");
    if (mobileUserInfo) mobileUserInfo.classList.add("hidden");
  }
}

// Helper to handle Dropdown Toggling
function setupDropdownListeners(container) {
  const btn = container.querySelector(".custom-avatar-btn");
  const dropdown = container.querySelector(".glass-dropdown");

  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close any other open dropdowns first
      document.querySelectorAll(".glass-dropdown").forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  }
}

// Handle Logout
window.handleLogout = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("first_name");
  localStorage.removeItem("last_name");
  localStorage.removeItem("email");
  window.location.reload(); // Refresh page to reset UI
};

// Close Dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".custom-avatar-btn") &&
    !e.target.closest(".glass-dropdown")
  ) {
    document.querySelectorAll(".glass-dropdown").forEach((d) => {
      d.classList.remove("active");
    });
  }
});
