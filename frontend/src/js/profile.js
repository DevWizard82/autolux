import { translations } from "./translations.js";
import { toast } from "./toast.js";

const BASE_URL = "http://localhost:3000";

// State
let currentUser = null;
let currentLanguage = localStorage.getItem("language") || "en";
let rentalsData = [];

// --- INIT ---
document.addEventListener("DOMContentLoaded", async () => {
    checkAuth();
    setupLanguage();

    // Load User
    const userStr = localStorage.getItem("user");
    if (userStr) {
        currentUser = JSON.parse(userStr);
        renderUserProfile();
    }

    // Attach Listeners
    document.getElementById("profile-form").addEventListener("submit", handleProfileUpdate);
    document.getElementById("password-form").addEventListener("submit", handlePasswordUpdate);

    // Initial Tab
    window.switchTab('settings');

    // Fetch Rentals
    if (currentUser) {
        await fetchRentals();
    }
});

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }
}

// --- TABS ---
// --- TABS ---
window.switchTab = (tabName) => {
    // Hide all
    document.getElementById("content-settings").classList.add("hidden");
    document.getElementById("content-orders").classList.add("hidden");

    // Reset buttons
    // Reset buttons
    document.querySelectorAll(".sidebar-link").forEach(btn => {
        btn.classList.remove("active");
        // btn.classList.add("text-gray-400"); // Optional if you want to dim inactive
    });

    // Show active content
    document.getElementById(`content-${tabName}`).classList.remove("hidden");

    // Activate button
    const activeBtn = document.getElementById(`tab-${tabName}`);
    // activeBtn.classList.remove("text-gray-400");
    activeBtn.classList.add("active");
};

// --- RENDER PROFILE ---
function renderUserProfile() {
    document.getElementById("profile-name").textContent = `${currentUser.first_name} ${currentUser.last_name}`;
    document.getElementById("profile-email").textContent = currentUser.email;

    // Initials
    const initials = (currentUser.first_name[0] + (currentUser.last_name[0] || "")).toUpperCase();
    document.getElementById("profile-avatar").textContent = initials;

    // Fill Inputs
    document.getElementById("inp-firstname").value = currentUser.first_name || "";
    document.getElementById("inp-lastname").value = currentUser.last_name || "";
    document.getElementById("inp-email").value = currentUser.email || "";
}

// --- UPDATE PROFILE ---
async function handleProfileUpdate(e) {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    const firstName = document.getElementById("inp-firstname").value;
    const lastName = document.getElementById("inp-lastname").value;
    const email = document.getElementById("inp-email").value;

    try {
        const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUser.id,
                firstName,
                lastName,
                email
            })
        });
        const data = await res.json();

        if (data.success) {
            // Update Local Storage
            currentUser.first_name = firstName;
            currentUser.last_name = lastName;
            currentUser.email = email;
            localStorage.setItem("user", JSON.stringify(currentUser));

            renderUserProfile();
            toast.success("Profile updated successfully");
        } else {
            toast.error(data.error || "Update failed");
        }
    } catch (err) {
        console.error(err);
        toast.error("Server connection failed");
    } finally {
        btn.innerHTML = originalText;
    }
}

// --- UPDATE PASSWORD ---
async function handlePasswordUpdate(e) {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const feedback = document.getElementById("password-feedback");

    const currentPassword = document.getElementById("inp-old-pass").value;
    const newPassword = document.getElementById("inp-new-pass").value;
    const confirmPassword = document.getElementById("inp-confirm-pass").value;

    if (newPassword !== confirmPassword) {
        feedback.textContent = "Passwords do not match";
        feedback.className = "text-sm text-red-400 block";
        return;
    }

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

    try {
        const res = await fetch(`${BASE_URL}/api/auth/update-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: currentUser.id,
                currentPassword,
                newPassword
            })
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById("password-form").reset();
            feedback.textContent = "Password changed successfully";
            feedback.className = "text-sm text-green-400 block";
            toast.success("Password updated");
        } else {
            feedback.textContent = data.error || "Failed to update password";
            feedback.className = "text-sm text-red-400 block";
        }
    } catch (err) {
        toast.error("Server error");
    } finally {
        btn.innerHTML = originalText; // Reference error potential here, fixed below
        btn.textContent = "Update Password"; // Re-set text manually or capture above
    }
}

// --- RENTALS LOGIC ---
async function fetchRentals() {
    const tbody = document.getElementById("orders-table-body");
    try {
        const res = await fetch(`${BASE_URL}/api/rentals/user/${currentUser.id}`);
        if (!res.ok) {
            throw new Error("Failed to fetch rentals");
        }
        rentalsData = await res.json();

        renderRentalsTable(rentalsData);
    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-red-400">Failed to load rentals</td></tr>';
    }
}

function renderRentalsTable(data) {
    const tbody = document.getElementById("orders-table-body");

    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No rentals found.</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(rental => {
        const start = new Date(rental.rental_start).toLocaleDateString();
        const end = new Date(rental.rental_end).toLocaleDateString();
        const statusClasses = getStatusClasses(rental.status);
        const canCancel = !["cancelled", "completed"].includes(rental.status);

        return `
        <tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <img src="/assets/images/${rental.car_image}" class="w-12 h-8 object-cover rounded" onerror="this.src='https://placehold.co/100'"/>
                    <div>
                        <div class="font-medium text-white">${rental.car_make} ${rental.car_name}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-300">${start}</div>
                <div class="text-xs text-gray-500">to ${end}</div>
            </td>
            <td class="px-6 py-4 font-medium text-luxury-gold">
                ${rental.price} $
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full border ${statusClasses}">
                    ${rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                ${canCancel ?
                `<button onclick="window.cancelRental(${rental.id})" class="text-red-400 hover:text-red-300 text-sm font-medium hover:underline">Cancel</button>`
                : '<span class="text-gray-600 cursor-not-allowed text-sm">--</span>'}
            </td>
        </tr>
        `;
    }).join("");
}

function getStatusClasses(status) {
    switch (status) {
        case 'confirmed': return 'bg-green-900/20 text-green-400 border-green-900/50';
        case 'active': return 'bg-blue-900/20 text-blue-400 border-blue-900/50';
        case 'completed': return 'bg-gray-800 text-gray-400 border-gray-700';
        case 'cancelled': return 'bg-red-900/20 text-red-400 border-red-900/50';
        default: return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'; // pending/gold
    }
}

// --- ACTIONS ---
window.cancelRental = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
        const res = await fetch(`${BASE_URL}/api/rentals/cancel/${id}`, { method: "POST" });
        const data = await res.json();
        if (data.success) {
            toast.success("Rental cancelled");
            fetchRentals(); // Refresh
        } else {
            toast.error(data.error || "Cancellation failed");
        }
    } catch (err) {
        toast.error("Network error");
    }
};

window.exportCSV = () => {
    if (rentalsData.length === 0) return toast.info("No data to export");

    const headers = ["ID", "Car", "Start Date", "End Date", "Total Price", "Status"];
    const rows = rentalsData.map(r => [
        r.id,
        `${r.car_make} ${r.car_name}`,
        new Date(r.rental_start).toLocaleDateString(),
        new Date(r.rental_end).toLocaleDateString(),
        r.price,
        r.status
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `rentals_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

window.logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
};

// --- LANGUAGE ---
function setupLanguage() {
    const selector = document.getElementById("user-language-selector");
    if (selector) {
        selector.value = currentLanguage;
        selector.addEventListener("change", (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem("language", currentLanguage);
            applyTranslations();
        });
    }
    applyTranslations();
}

function applyTranslations() {
    const t = translations[currentLanguage];
    if (!t) return;

    const profileT = t.profile || {};
    // Fallbacks to loose keys if not nested, mostly we will add a 'profile' key to translations.

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        // Check profile specific first, then global
        if (profileT[key]) el.textContent = profileT[key];
        else if (t[key]) el.textContent = t[key];
        else if (translations.en.profile && translations.en.profile[key]) el.textContent = translations.en.profile[key];
    });
}
