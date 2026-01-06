// ... imports
import {
  getCarsCount,
  getClientsCount,
  getRentalsCount,
  getRevenue,
  getAvailableCars,
  getLocationsCount, // NEW
  getClientsList,
  getFleetList,
  getRentalsList,
  getLocationsList,
  getModelsList,
  getcars,
} from "./api.js";

// ...


import { translations } from "./translations.js";

import { toast } from "./toast.js";

class SettingsManager {
  constructor() {
    // Load saved settings or defaults
    this.state = JSON.parse(localStorage.getItem("adminSettings")) || {
      emailNotifications: true,
      compactView: false,
      autoLogout: true,
    };
  }

  render() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const email = user.email || "";

    const t = translations[window.app?.language || "en"]?.admin || translations.en.admin;

    return `
      <div class="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div class="flex justify-between items-center border-b border-gray-700 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-cyan-400">${t.settings}</h2>
            <p class="text-gray-400 text-sm mt-1">Manage your account and system preferences</p>
          </div>
          <button id="save-settings-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-cyan-500/20 flex items-center">
            ${t.save_changes}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div class="lg:col-span-2 space-y-8">
            
            <div class="bg-gray-800 rounded-xl border border-gray-700/50 p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Profile Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm text-gray-400">First Name</label>
                  <input type="text" id="set-firstname" value="${firstName}" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none text-white">
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-gray-400">Last Name</label>
                  <input type="text" id="set-lastname" value="${lastName}" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none text-white">
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-gray-400">Email Address</label>
                  <input type="email" id="set-email" value="${email}" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none text-white">
                </div>
              </div>
            </div>

            <div class="bg-gray-800 rounded-xl border border-gray-700/50 p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-200 mb-6 flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Security
              </h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm text-gray-400">Current Password</label>
                  <input type="password" id="current-password" placeholder="••••••••" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm text-gray-400">New Password</label>
                    <input type="password" id="new-password" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-gray-400">Confirm New Password</label>
                    <input type="password" id="confirm-password" class="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                  </div>
                </div>
                <p id="password-msg" class="text-sm hidden"></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  attachEvents() {
    const btn = document.getElementById("save-settings-btn");
    if (btn) {
      btn.addEventListener("click", () => this.save());
    } else {
      console.error("Save button not found in DOM");
    }
  }

  async save() {
    const btn = document.getElementById("save-settings-btn");
    const passMsg = document.getElementById("password-msg");

    passMsg.className = "hidden";

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const firstName = document.getElementById("set-firstname").value;
    const lastName = document.getElementById("set-lastname").value;
    const email = document.getElementById("set-email").value;

    if (firstName || lastName || email) {
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = `<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/update-profile",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              firstName: firstName,
              lastName: lastName,
              email: email,
            }),
          }
        );

        const data = await res.json();
      } catch (err) {
        console.error(err);
      } finally {
        btn.innerHTML = originalBtnText;
      }
    }

    user.first_name = firstName;
    user.last_name = lastName;
    user.email = email;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("adminSettings", JSON.stringify(this.state));
    window.app.updateUserInfo();

    const currentPass = document.getElementById("current-password").value;
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (newPass || confirmPass || currentPass) {
      const originalBtnText = btn.innerHTML;
      btn.innerHTML = `<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

      try {
        // API CALL
        const res = await fetch(
          "http://localhost:3000/api/auth/update-password",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // If your backend uses middleware
            },
            body: JSON.stringify({
              userId: user.id,
              currentPassword: currentPass,
              newPassword: newPass,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          // Clear fields on success
          document.getElementById("current-password").value = "";
          document.getElementById("new-password").value = "";
          document.getElementById("confirm-password").value = "";
          passMsg.textContent = "Password updated successfully in Database!";
          passMsg.className = "text-sm text-green-400 block mt-2";
        } else {
          this.showError(passMsg, data.error || "Failed to update password");
        }
      } catch (err) {
        console.error(err);
        this.showError(passMsg, "Server connection failed");
      } finally {
        btn.innerHTML = originalBtnText;
      }
    }

    btn.innerHTML = `<span class="text-green-300">Saved!</span>`;
    btn.classList.add("border-green-500", "bg-green-900/20");
    setTimeout(() => {
      btn.innerHTML = "Save Changes";
      btn.classList.remove("border-green-500", "bg-green-900/20");
    }, 2000);
  }
  showError(el, msg) {
    el.textContent = msg;
    el.className = "text-sm text-red-400 block mt-2";
  }
}

class AnalyticsManager {
  render() {
    return `
      <div class="p-8 space-y-8">
        <h2 class="text-2xl font-bold text-cyan-400">Advanced Analytics</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          
          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-300 font-semibold mb-4 flex-shrink-0">Top 10 Customers</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotCustomers" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-300 font-semibold mb-4 flex-shrink-0">Top 5 Rented Models</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotTopCars" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700/50 shadow-xl lg:col-span-2 min-h-[600px] flex flex-col w-full">
            <h3 class="text-gray-300 font-semibold mb-4 flex-shrink-0">Monthly Revenue Flow</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotRevenue" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-300 font-semibold mb-4 flex-shrink-0">Avg Rental Duration (Weeks)</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotDuration" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-xl border border-gray-700/50 shadow-xl min-h-[400px] flex flex-col">
            <h3 class="text-gray-300 font-semibold mb-4 flex-shrink-0">Fleet Availability</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotFleetStatus" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async initCharts() {
    // Wait for the DOM to update layout before drawing charts
    // This prevents the "half width" bug where Plotly draws before the div expands
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.renderPlotlyCharts();
      });
    }, 100);
  }

  renderPlotlyCharts() {
    const config = { responsive: true, displayModeBar: false };

    const darkLayout = {
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { color: "#9ca3af", family: "Montserrat" },
      margin: { t: 10, l: 40, r: 20, b: 40 },
      autosize: true, // IMPORTANT
      showlegend: true,
      legend: { font: { size: 10 }, orientation: "h", y: -0.15 },
    };

    // --- MOCK DATA ---
    const customers = [
      { name: "Alice J.", count: 12 },
      { name: "Bob S.", count: 10 },
      { name: "Charlie", count: 8 },
      { name: "Diana P.", count: 5 },
      { name: "Evan H.", count: 4 },
    ];
    const revenue = [
      { month: "Jan", total: 5000 },
      { month: "Feb", total: 7500 },
      { month: "Mar", total: 6000 },
      { month: "Apr", total: 9000 },
      { month: "May", total: 11000 },
      { month: "Jun", total: 14000 },
      { month: "Jul", total: 13000 },
      { month: "Aug", total: 15000 },
      { month: "Sep", total: 17000 },
      { month: "Oct", total: 16000 },
      { month: "Nov", total: 18000 },
      { month: "Dec", total: 20000 },
    ];
    const fleet = [
      { status: "Available", count: 10 },
      { status: "Rented", count: 5 },
      { status: "Maintenance", count: 2 },
    ];

    try {
      // 1. Top 10 Customers
      Plotly.newPlot(
        "plotCustomers",
        [
          {
            type: "bar",
            orientation: "h",
            x: customers.map((c) => c.count),
            y: customers.map((c) => c.name),
            marker: { color: "#22d3ee" },
          },
        ],
        {
          ...darkLayout,
          margin: { t: 10, l: 80, r: 20, b: 30 },
          yaxis: { automargin: true },
        },
        config
      );

      // 2. Top 5 Cars
      Plotly.newPlot(
        "plotTopCars",
        [
          {
            values: [40, 25, 20, 10, 5],
            labels: ["Mercedes", "Porsche", "Lambo", "Range Rover", "Tesla"],
            type: "pie",
            marker: {
              colors: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"],
            },
            textinfo: "none",
          },
        ],
        darkLayout,
        config
      );

      // 3. Revenue (This will now take full width)
      Plotly.newPlot(
        "plotRevenue",
        [
          {
            x: revenue.map((r) => r.month),
            y: revenue.map((r) => r.total),
            type: "scatter",
            mode: "lines+markers",
            line: { shape: "spline", color: "#22d3ee", width: 3 },
            fill: "tozeroy",
            fillcolor: "rgba(34, 211, 238, 0.1)",
          },
        ],
        {
          ...darkLayout,
          xaxis: { gridcolor: "#374151" },
          yaxis: { gridcolor: "#374151" },
        },
        config
      );

      // 4. Duration
      Plotly.newPlot(
        "plotDuration",
        [
          {
            x: ["S-Class", "911", "Urus", "Ghost", "Tributo"],
            y: [2.5, 1.8, 3.2, 4.0, 1.2],
            type: "bar",
            marker: { color: "#f59e0b" },
          },
        ],
        darkLayout,
        config
      );

      // 5. Fleet Status
      Plotly.newPlot(
        "plotFleetStatus",
        [
          {
            values: fleet.map((f) => f.count),
            labels: fleet.map((f) => f.status),
            type: "pie",
            hole: 0.6,
            marker: { colors: ["#10b981", "#f59e0b", "#ef4444"] },
            textinfo: "none",
          },
        ],
        darkLayout,
        config
      );

      // FORCE RESIZE: Final safety check to make sure charts snap to container width
      window.dispatchEvent(new Event("resize"));
    } catch (err) {
      console.error("Plotly Init Error:", err);
    }
  }
}

// --- UTILS CLASS ---
class UIUtils {
  static createIcon(path, className = "w-5 h-5") {
    return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}">
              <path d="${path}" />
            </svg>`;
  }
}

// --- COMPONENT CLASSES ---

class KPIManager {
  constructor() {
    this.kpis = [
      {
        title: translations[window.app?.language || "en"]?.admin?.total_cars || "Total Cars",
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.in_fleet || "In Fleet",
        iconPath:
          "M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
        color: "cyan",
      },
      {
        title: translations[window.app?.language || "en"]?.admin?.total_clients || "Total Clients",
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.registered_users || "Registered Users",
        iconPath:
          "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
        color: "green",
      },
      {
        title: translations[window.app?.language || "en"]?.admin?.active_rentals || "Active Rentals",
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.on_road || "Currently on the road",
        iconPath:
          "M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        color: "amber",
      },
      {
        title: translations[window.app?.language || "en"]?.admin?.revenue_year || "Revenue This Year",
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.earnings_summary || "Real-time earnings summary",
        iconPath:
          "M12 1v22M17 5H7c-2.2 0-4 1.8-4 4s1.8 4 4 4h10c2.2 0 4 1.8 4 4s-1.8 4-4 4H7",
        color: "rose",
      },
      {
        title: translations[window.app?.language || "en"]?.admin?.available_cars || "Available Cars",
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.ready_booking || "Ready for booking",
        iconPath: "M22 11.08V12a10 10 0 1 1-5.93-8.5M22 4L12 14.01l-3-3",
        color: "teal",
      },
      {
        title: translations[window.app?.language || "en"]?.admin?.total_locations || "Total Locations", // NEW
        value: "...",
        description: translations[window.app?.language || "en"]?.admin?.global_presence || "Global presence",
        iconPath: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
        color: "indigo",
      },
    ];
  }

  async fetchData() {
    try {
      const [cars, clients, rentals, revenue, available, locations] = await Promise.all([
        getCarsCount(),
        getClientsCount(),
        getRentalsCount(),
        getRevenue(),
        getAvailableCars(),
        getLocationsCount(), // NEW
      ]);

      this.kpis[0].value = cars;
      this.kpis[1].value = clients;
      this.kpis[2].value = rentals;
      this.kpis[3].value = `${Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(revenue)} €`;
      this.kpis[4].value = available;
      this.kpis[5].value = locations; // NEW
    } catch (err) {
      console.error("API Error:", err);
      this.kpis[0].value = "Err";
    }
  }

  renderCard(kpi) {
    const colorClass = `text-${kpi.color}-400`;
    const bgClass = `bg-${kpi.color}-900/30`;
    return `
            <div class="flex flex-col p-5 bg-gray-800 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300 transform hover:scale-[1.01] border border-gray-700/50">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-400 mb-1">${kpi.title
      }</p>
                  <div class="text-3xl font-bold text-gray-100">${kpi.value
      }</div>
                </div>
                <div class="p-3 rounded-full ${bgClass} ${colorClass}">
                  ${UIUtils.createIcon(kpi.iconPath, "w-6 h-6")}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">${kpi.description}</p>
            </div>`;
  }

  render() {
    const t = translations[window.app?.language || "en"]?.admin;
    if (t) {
      if (this.kpis[0]) {
        this.kpis[0].title = t.total_cars;
        this.kpis[0].description = t.in_fleet;
      }
      if (this.kpis[1]) {
        this.kpis[1].title = t.total_clients;
        this.kpis[1].description = t.registered_users;
      }
      if (this.kpis[2]) {
        this.kpis[2].title = t.active_rentals;
        this.kpis[2].description = t.on_road;
      }
      if (this.kpis[3]) {
        this.kpis[3].title = t.revenue_year;
        this.kpis[3].description = t.earnings_summary;
      }
      if (this.kpis[4]) {
        this.kpis[4].title = t.available_cars;
        this.kpis[4].description = t.ready_booking;
      }
      if (this.kpis[5]) {
        this.kpis[5].title = t.total_locations;
        this.kpis[5].description = t.global_presence;
      }
    }

    return `<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            ${this.kpis.map((kpi) => this.renderCard(kpi)).join("")}
          </section>`;
  }
}

class TableManager {
  constructor() {
    this.tables = {};
  }

  registerTable(id, config) {
    // initialize filters object
    this.tables[id] = {
      ...config,
      searchTerm: "",
      filters: {}, // Store active filters here { colKey: value }
      currentPage: 1,
      itemsPerPage: 10,
      sortColumn: null,
      sortDirection: "asc",
    };
  }

  // --- MODIFIED: Data Processing (Search + Sort + Filters) ---
  getProcessedData(table) {
    let processed = [...table.data];

    // 1. Apply Search
    if (table.searchTerm) {
      const lowerCaseSearch = table.searchTerm.toLowerCase();
      processed = processed.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    // 2. Apply Dropdown Filters (NEW)
    if (table.filters) {
      Object.entries(table.filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          processed = processed.filter((item) => {
            // Handle partial matches for things like "gmail" in email
            const itemValue = String(item[key] || "").toLowerCase();
            return itemValue.includes(value.toLowerCase());
          });
        }
      });
    }

    // 3. Apply Sort
    if (table.sortColumn) {
      processed.sort((a, b) => {
        let valA = a[table.sortColumn];
        let valB = b[table.sortColumn];

        if (typeof valA === "number" && typeof valB === "number") {
          return table.sortDirection === "asc" ? valA - valB : valB - valA;
        }

        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();

        if (valA < valB) return table.sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return table.sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return processed;
  }

  // --- NEW: Handle Filter Changes ---
  handleFilter(id, key, value) {
    const table = this.tables[id];
    if (!table) return;

    // Update the specific filter
    table.filters[key] = value;
    table.currentPage = 1; // Reset to page 1 on filter change
    this.updateTableUI(id);
  }

  // --- NEW: Export to CSV ---
  exportToCSV(id, filename = "export.csv") {
    const table = this.tables[id];
    if (!table) return;

    const data = this.getProcessedData(table);
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Get headers from the first object keys (excluding complex objects if any)
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(","), // Header row
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            let val = row[fieldName] || "";
            // Escape quotes and wrap in quotes if contains comma
            val = String(val).replace(/"/g, '""');
            if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
            return val;
          })
          .join(",")
      ),
    ].join("\n");

    // Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  handleSort(id, key) {
    const table = this.tables[id];
    if (!table) return;
    if (table.sortColumn === key) {
      table.sortDirection = table.sortDirection === "asc" ? "desc" : "asc";
    } else {
      table.sortColumn = key;
      table.sortDirection = "asc";
    }
    this.updateTableUI(id);
  }

  handleSearch(id, term) {
    if (this.tables[id]) {
      this.tables[id].searchTerm = term;
      this.tables[id].currentPage = 1;
      this.updateTableUI(id);
    }
  }

  handlePaginationClick(id, direction) {
    const table = this.tables[id];
    if (!table) return;
    const filteredData = this.getProcessedData(table);
    const totalPages = Math.ceil(filteredData.length / table.itemsPerPage);

    if (direction === "prev" && table.currentPage > 1) {
      table.currentPage--;
    } else if (direction === "next" && table.currentPage < totalPages) {
      table.currentPage++;
    }
    this.updateTableUI(id);
  }

  handleItemsPerPageChange(id, value) {
    const table = this.tables[id];
    if (!table) return;
    table.itemsPerPage = parseInt(value);
    table.currentPage = 1;
    this.updateTableUI(id);
  }

  updateTableUI(id) {
    const table = this.tables[id];
    if (!table) return;

    const processedData = this.getProcessedData(table);
    const totalPages = Math.ceil(processedData.length / table.itemsPerPage);

    if (table.currentPage > totalPages && totalPages > 0) {
      table.currentPage = totalPages;
    }

    const startIndex = (table.currentPage - 1) * table.itemsPerPage;
    const paginatedData = processedData.slice(
      startIndex,
      startIndex + table.itemsPerPage
    );

    // Update Header Sort Icons
    const headerCells = document.querySelectorAll(`#${id}-thead th svg`);
    headerCells.forEach((svg) => svg.classList.add("text-gray-600"));

    if (table.sortColumn) {
      const activeHeader = document.getElementById(
        `${id}-header-${table.sortColumn}`
      );
      if (activeHeader) {
        const icon = activeHeader.querySelector("svg");
        if (icon) {
          icon.classList.remove("text-gray-600");
          icon.classList.add("text-cyan-400");
          icon.style.transform =
            table.sortDirection === "desc" ? "rotate(180deg)" : "rotate(0deg)";
        }
      }
    }

    const tbody = document.getElementById(`${id}-tbody`);
    if (tbody) {
      tbody.innerHTML =
        paginatedData.length > 0
          ? paginatedData
            .map(
              (item) =>
                `<tr class="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50 transition">${table.renderRowContent(
                  item
                )}</tr>`
            )
            .join("")
          : '<tr><td colspan="10" class="text-center py-4 text-gray-500">No data found.</td></tr>';
    }

    // Update Pagination
    const prevBtn = document.getElementById(`${id}-prev-btn`);
    const nextBtn = document.getElementById(`${id}-next-btn`);
    const pageInfo = document.getElementById(`${id}-page-info`);

    if (prevBtn) {
      prevBtn.disabled = table.currentPage <= 1;
      prevBtn.className =
        table.currentPage <= 1
          ? "px-3 py-2 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
          : "px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition";
    }

    if (nextBtn) {
      nextBtn.disabled = table.currentPage >= totalPages;
      nextBtn.className =
        table.currentPage >= totalPages
          ? "px-3 py-2 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
          : "px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition";
    }

    if (pageInfo) {
      pageInfo.textContent = `Page ${table.currentPage} of ${totalPages || 1}`;
    }
  }

  // --- MODIFIED RENDER: Now accepts filterOptions ---
  render(id, title, data, columns, renderRowContent, filterOptions = []) {
    const settings = JSON.parse(localStorage.getItem("adminSettings")) || {};
    const isCompact = settings.compactView;

    if (!this.tables[id]) {
      this.registerTable(id, { data, renderRowContent });
    } else {
      // --- ADD THIS ELSE BLOCK ---
      // If table exists, update the data and renderer with the fresh values
      this.tables[id].data = data;
      this.tables[id].renderRowContent = renderRowContent;
      // Trigger a UI update immediately to show the new data
      setTimeout(() => this.updateTableUI(id), 0);
    }

    // Generate Dropdown HTML based on filterOptions array
    const filtersHtml = filterOptions
      .map(
        (opt) => `
      <select onchange="window.app.tableManager.handleFilter('${id}', '${opt.key
          }', this.value)" 
              class="px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-cyan-500 text-sm outline-none">
        <option value="all">${opt.label}</option>
        ${opt.options
            .map((val) => `<option value="${val}">${val}</option>`)
            .join("")}
      </select>
    `
      )
      .join("");

    setTimeout(() => this.updateTableUI(id), 0);

    return `
      <div class="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h3 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2 flex justify-between items-center">
            ${title}
            <button onclick="window.app.tableManager.exportToCSV('${id}', '${title}.csv')" 
                    class="text-sm bg-gray-700 hover:bg-gray-600 text-cyan-400 px-3 py-1.5 rounded flex items-center gap-2 border border-gray-600 transition">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
               Export CSV
            </button>
        </h3>
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div class="relative w-full md:w-64">
             <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
             </div>
             <input type="text" placeholder="Search records..." 
                 oninput="window.app.tableManager.handleSearch('${id}', this.value)" 
                 class="w-full pl-10 p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-cyan-500 placeholder-gray-500 outline-none" />
          </div>

          <div class="flex gap-2 w-full md:w-auto">
             ${filtersHtml}
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-700">
          <table class="w-full text-sm text-left text-gray-400 ${isCompact ? "compact-table" : ""
      }">
            <thead id="${id}-thead" class="text-xs text-gray-200 uppercase bg-gray-700/80">
              <tr>
                ${columns
        .map((c) => {
          const isSortable = c.key !== "actions" && c.key !== "image";
          const cursor = isSortable
            ? "cursor-pointer hover:bg-gray-700 hover:text-white"
            : "";
          const clickEvent = isSortable
            ? `onclick="window.app.tableManager.handleSort('${id}', '${c.key}')"`
            : "";
          return `
                    <th id="${id}-header-${c.key
            }" class="px-6 py-3 transition select-none ${cursor}" ${clickEvent}>
                      <div class="flex items-center gap-2">
                        ${c.label}
                        ${isSortable
              ? `<svg class="w-3 h-3 text-gray-600 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24"><path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/></svg>`
              : ""
            }
                      </div>
                    </th>`;
        })
        .join("")}
              </tr>
            </thead>
            <tbody id="${id}-tbody" class="${isCompact ? "text-xs" : "text-sm"
      }"></tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4">
          <div class="flex items-center gap-4 mb-4 sm:mb-0">
            <span class="text-sm text-gray-400" id="${id}-page-info">Page 1 of 1</span>
            <select onchange="window.app.tableManager.handleItemsPerPageChange('${id}', this.value)" class="px-3 py-1 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg text-sm outline-none">
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button id="${id}-prev-btn" onclick="window.app.tableManager.handlePaginationClick('${id}', 'prev')" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">Prev</button>
            <button id="${id}-next-btn" onclick="window.app.tableManager.handlePaginationClick('${id}', 'next')" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>`;
  }
}

class Sidebar {
  constructor(router) {
    this.router = router;
    this.menuItems = [
      {
        name: "Dashboard",
        route: "dashboard",
        iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14V8M15 12h-3",
      },
      {
        name: "Cars (CRUD)",
        route: "cars",
        iconPath:
          "M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
      },
      {
        name: "Clients (CRUD)",
        route: "clients",
        iconPath:
          "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
      },
      {
        name: "Rentals",
        route: "rentals",
        iconPath:
          "M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      },
      {
        name: "Locations",
        route: "locations",
        iconPath:
          "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z",
      },
      {
        name: "Models (3D)",
        route: "models",
        iconPath:
          "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      },
      {
        name: "Graphs / Analytics",
        route: "analytics",
        iconPath: "M12 20V10M18 20V4M6 20V16",
      },

      {
        name: "Settings",
        route: "settings",
        iconPath:
          "M12.22 2h-.44a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM18 12.22h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2zM6 12.22h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0 2-2 2 2 0 0 0 2 2v.44a2 2 0 0 0-2 2zM12.22 22h-.44a2 2 0 0 0-2-2v-2a2 2 0 0 0 2-2 2 2 0 0 0 2 2v2a2 2 0 0 0-2 2z",
      },
    ];

    this.sidebarEl = document.getElementById("sidebar");
    this.overlayEl = document.getElementById("sidebar-overlay");
    this.mainContentEl = document.getElementById("main-content");
    this.navEl = document.getElementById("sidebar-nav");

    this.attachEventListeners();
  }

  updateMenuItems() {
    const lang = window.app?.language || "en";
    const t = translations[lang]?.admin || translations.en.admin;

    this.menuItems = [
      {
        name: t.dashboard,
        route: "dashboard",
        iconPath: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14V8M15 12h-3",
      },
      {
        name: t.fleet, // "Cars (CRUD)" -> Fleet Management
        route: "cars",
        iconPath:
          "M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
      },
      {
        name: t.users, // "Clients (CRUD)" -> Users
        route: "clients",
        iconPath:
          "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
      },
      {
        name: t.rentals,
        route: "rentals",
        iconPath:
          "M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      },
      {
        name: t.locations, // Locations
        route: "locations",
        iconPath:
          "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z",
      },
      {
        name: t.manage_vehicle, // "Models (3D)" -> Manage Vehicle (or Models)
        route: "models",
        iconPath:
          "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      },
      {
        name: t.analytics,
        route: "analytics",
        iconPath: "M12 20V10M18 20V4M6 20V16",
      },
      {
        name: t.settings,
        route: "settings",
        iconPath:
          "M12.22 2h-.44a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM18 12.22h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 0-2 2v.44a2 2 0 0 0-2 2zM6 12.22h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0 2-2 2 2 0 0 0 2 2v.44a2 2 0 0 0-2 2zM12.22 22h-.44a2 2 0 0 0-2-2v-2a2 2 0 0 0 2-2 2 2 0 0 0 2 2v2a2 2 0 0 0-2 2z",
      },
    ];
  }

  render() {
    this.updateMenuItems();
    this.navEl.innerHTML = this.menuItems
      .map((item) => this.createMenuItem(item))
      .join("");
  }

  createMenuItem(item) {
    const isActive = item.route === this.router.currentRoute;
    const menuClass = isActive
      ? "bg-cyan-700/50 text-cyan-400 font-semibold shadow-inner shadow-cyan-500/20"
      : "text-gray-400 hover:bg-gray-700 hover:text-gray-100";

    return `
            <div class="flex items-center p-3 rounded-xl transition duration-200 cursor-pointer group ${menuClass}" 
                 onclick="window.app.router.navigate('${item.route}')" title="${item.name
      }">
              ${UIUtils.createIcon(item.iconPath, "flex-shrink-0 w-5 h-5")}
              <span class="ml-3 whitespace-nowrap overflow-hidden sidebar-text transition-all duration-300">
                ${item.name}
              </span>
              <span class="hidden lg:group-hover:block absolute left-full ml-3 px-3 py-1 bg-gray-700 text-xs rounded-lg text-gray-100 z-50 shadow-md">
                ${item.name}
              </span>
            </div>`;
  }

  toggle(force) {
    const isOpen =
      typeof force === "boolean"
        ? force
        : this.sidebarEl.classList.contains("translate-x-0") &&
        window.innerWidth < 1024;

    if (isOpen) {
      this.sidebarEl.classList.remove("w-0", "-translate-x-full", "lg:w-20");
      this.sidebarEl.classList.add("w-64", "translate-x-0", "lg:w-20");
      this.overlayEl.classList.remove("hidden");
    } else {
      this.sidebarEl.classList.add("w-0", "-translate-x-full", "lg:w-20");
      this.sidebarEl.classList.remove("w-64", "translate-x-0");
      this.overlayEl.classList.add("hidden");
    }

    if (window.innerWidth >= 1024) {
      if (isOpen) this.mainContentEl.classList.remove("lg:ml-20");
      else this.mainContentEl.classList.add("lg:ml-20");
    } else {
      this.mainContentEl.classList.remove("lg:ml-20");
    }

    const sidebarTextElements = document.querySelectorAll(".sidebar-text");
    sidebarTextElements.forEach((el) => {
      if (window.innerWidth < 1024 && !isOpen)
        el.classList.add("opacity-0", "max-w-0");
      else if (window.innerWidth < 1024 && isOpen)
        el.classList.add("opacity-100", "max-w-full");
    });
  }

  attachEventListeners() {
    document
      .getElementById("sidebar-toggle-mobile")
      .addEventListener("click", () => this.toggle(true));
    document
      .getElementById("sidebar-close-mobile")
      .addEventListener("click", () => this.toggle(false));
    this.overlayEl.addEventListener("click", () => this.toggle(false));
  }
}

class DetailsRenderer {
  static renderHeader(title, onBack) {
    return `
      <div class="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <div class="flex items-center gap-4">
          <button onclick="${onBack}" class="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 class="text-2xl font-bold text-cyan-400">${title}</h2>
        </div>
        <button onclick="window.app.exportToPDF()" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition border border-gray-600">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Export PDF
        </button>
      </div>`;
  }

  static renderCarDetails(car) {
    const carStr = JSON.stringify(car).replace(/"/g, "&quot;");

    // Parse JSON fields safely
    let locations = "N/A";
    let desc = "No description available.";
    try {
      const locObj =
        typeof car.locations === "string"
          ? JSON.parse(car.locations)
          : car.locations;
      locations = locObj?.en || Object.values(locObj)[0] || "N/A";

      const descObj =
        typeof car.description === "string"
          ? JSON.parse(car.description)
          : car.description;
      desc = descObj?.en || Object.values(descObj)[0] || desc;
    } catch (e) { }

    const imgUrl = car.image
      ? `/assets/images/${car.image}`
      : "http://localhost:3000/assets/images/placeholder.png";

    return `
      <div class="p-8 max-w-6xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(
      `Vehicle Details: ${car.make} ${car.name}`,
      "window.app.router.navigate('cars')"
    )}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-gray-800 rounded-xl p-2 border border-gray-700 shadow-lg">
              <img src="${imgUrl}" class="w-full h-64 object-cover rounded-lg" onerror="this.src='http://localhost:3000/assets/images/placeholder.png'">
            </div>
            
            <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
               <h3 class="text-gray-400 text-sm uppercase tracking-wider mb-4">Status & Pricing</h3>
               <div class="flex justify-between items-center mb-4">
                  <span class="text-gray-300">Daily Rate</span>
                  <span class="text-2xl font-bold text-cyan-400">$${car.price
      }</span>
               </div>
               <div class="flex justify-between items-center">
                  <span class="text-gray-300">Status</span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-white capitalize border border-gray-600">
                    ${car.status}
                  </span>
               </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <div class="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
              <h3 class="text-xl font-bold text-white mb-6">Technical Specifications</h3>
              
              <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p class="text-gray-500 text-sm">Vehicle ID (DB)</p>
                  <p class="text-white font-medium">#${car.id}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">VIN / Registration</p>
                  <p class="text-white font-medium">${car.vin || "N/A"}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Make</p>
                  <p class="text-white font-medium">${car.make}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Model</p>
                  <p class="text-white font-medium">${car.name}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Color</p>
                  <div class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full border border-gray-500" style="background-color: ${car.color
      }"></span>
                    <span class="text-white font-medium capitalize">${car.color
      }</span>
                  </div>
                </div>
                 <div>
                  <p class="text-gray-500 text-sm">Location</p>
                  <p class="text-white font-medium">${locations}</p>
                </div>
              </div>

              <div class="border-t border-gray-700 pt-6">
                <p class="text-gray-500 text-sm mb-2">Description</p>
                <p class="text-gray-300 leading-relaxed">${desc}</p>
              </div>
            </div>

            <div class="flex gap-4 justify-end pt-4" data-html2canvas-ignore="true">
              <button onclick="window.app.deleteVehicle(${car.id
      })" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
              </button>
              <button onclick="window.app.openCarModal(${carStr})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static renderRentalDetails(rental) {
    const rentalStr = JSON.stringify(rental).replace(/"/g, "&quot;");
    const startDate = new Date(rental.rental_start).toLocaleDateString();
    const endDate = new Date(rental.rental_end).toLocaleDateString();
    const createdDate = new Date(rental.created_at).toLocaleDateString();

    // Status Color Logic
    let statusColor = "text-yellow-400 border-yellow-400";
    if (rental.status === "completed")
      statusColor = "text-green-400 border-green-400";
    if (rental.status === "cancelled")
      statusColor = "text-red-400 border-red-400";

    return `
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(
      `Rental #${rental.id} - Details`,
      "window.app.router.navigate('rentals')"
    )}

        <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden relative">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
             <span class="text-9xl font-bold text-white uppercase transform -rotate-12">${rental.status
      }</span>
          </div>

          <div class="p-8 border-b border-gray-700 bg-gray-900/50 flex justify-between items-start">
            <div>
               <h1 class="text-3xl font-bold text-white mb-2">INVOICE</h1>
               <p class="text-gray-400 text-sm">Issued Date: ${createdDate}</p>
               <p class="text-gray-400 text-sm">Transaction ID: #${rental.id
      }</p>
            </div>
            <div class="text-right">
                <div class="inline-block px-4 py-2 border-2 rounded-lg font-bold uppercase tracking-wider ${statusColor}">
                    ${rental.status}
                </div>
            </div>
          </div>

          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h4 class="text-cyan-400 font-semibold uppercase tracking-wider text-xs mb-4">Billed To</h4>
               <p class="text-xl text-white font-bold">${rental.first_name} ${rental.last_name
      }</p>
               <p class="text-gray-400">${rental.email}</p>
               <p class="text-gray-500 text-sm mt-2">Client ID: #${rental.id
      }</p>
            </div>

            <div>
               <h4 class="text-cyan-400 font-semibold uppercase tracking-wider text-xs mb-4">Rental Info</h4>
               <div class="flex justify-between mb-2">
                  <span class="text-gray-400">Pick-up Date:</span>
                  <span class="text-white">${startDate}</span>
               </div>
               <div class="flex justify-between mb-2">
                  <span class="text-gray-400">Return Date:</span>
                  <span class="text-white">${endDate}</span>
               </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-400">Duration:</span>
                  <span class="text-white">
                    ${Math.ceil(
        (new Date(rental.rental_end) -
          new Date(rental.rental_start)) /
        (1000 * 60 * 60 * 24)
      )} Days
                  </span>
               </div>
            </div>
          </div>

          <div class="p-8">
             <table class="w-full text-left text-sm">
                <thead>
                   <tr class="border-b border-gray-600 text-gray-400">
                      <th class="pb-3">Vehicle Description</th>
                      <th class="pb-3">VIN</th>
                      <th class="pb-3 text-right">Total Amount</th>
                   </tr>
                </thead>
                <tbody class="text-gray-200">
                   <tr class="border-b border-gray-700">
                      <td class="py-4">
                         <div class="flex items-center gap-4">
                            <img src="/assets/images/${rental.car_image
      }" class="w-16 h-10 object-cover rounded border border-gray-600">
                            <div>
                               <p class="font-bold">${rental.car_make} ${rental.car_name
      }</p>
                               <p class="text-xs text-gray-500">Premium Rental Service</p>
                            </div>
                         </div>
                      </td>
                      <td class="py-4">${rental.vin}</td>
                      <td class="py-4 text-right font-bold text-lg text-emerald-400">$${rental.price
      }</td>
                   </tr>
                </tbody>
             </table>
          </div>

          <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
             <button onclick="window.app.deleteRental(${rental.id
      })" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Delete Record
             </button>
             <button onclick="window.app.promptRentalStatus(${rental.id}, '${rental.status
      }')" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Update Status
             </button>
          </div>
        </div>
      </div>
    `;
  }

  static renderClientDetails(client) {
    const clientStr = JSON.stringify(client).replace(/"/g, "&quot;");

    return `
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(
      `Client Profile: ${client.first_name} ${client.last_name}`,
      "window.app.router.navigate('clients')"
    )}

        <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-6 mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                ${client.first_name[0]}${client.last_name[0]}
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">${client.first_name
      } ${client.last_name}</h3>
                <p class="text-cyan-400">Client ID: #${client.id}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-700 pt-8">
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500 block">Email Address</label>
                  <span class="text-lg text-gray-200">${client.email}</span>
                </div>
                <div>
                  <label class="text-sm text-gray-500 block">Phone Number</label>
                  <span class="text-lg text-gray-200">${client.phone || "Not Provided"
      }</span>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500 block">Account Created</label>
                  <span class="text-lg text-gray-200">${new Date().toLocaleDateString()}</span> </div>
                 <div>
                  <label class="text-sm text-gray-500 block">Membership Status</label>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
            <button onclick="window.app.deleteClient(${client.id
      })" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
            </button>
            <button onclick="window.app.openClientModal(${clientStr})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static renderLocationDetails(location) {
    const locStr = JSON.stringify(location).replace(/"/g, "&quot;");

    return `
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(
      `Location Details: ${location.city_name}`,
      "window.app.router.navigate('locations')"
    )}

        <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-6 mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"></path></svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">${location.city_name
      }</h3>
                <p class="text-cyan-400">Location ID: #${location.id}</p>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-400 mb-2">Map Location</h4>
                <div class="w-full h-80 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  <iframe 
                    src="${location.map_embed_url}" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-400 mb-2">Embed URL</h4>
                <code class="block w-full bg-gray-900 p-3 rounded text-xs text-gray-400 font-mono break-all">
                  ${location.map_embed_url}
                </code>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
            <button onclick="window.app.deleteLocation(${location.id
      })" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
            </button>
            <button onclick="window.app.openLocationModal(${locStr})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static renderModelDetails(model) {
    const modelStr = JSON.stringify(model).replace(/"/g, "&quot;");

    return `
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(
      `Model Details: ${model.car_make} ${model.car_name}`,
      "window.app.router.navigate('models')"
    )}

<div class="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
  <div class="p-8">
    <div class="flex items-center gap-6 mb-8">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
      </div>
      <div>
        <h3 class="text-2xl font-bold text-white">${model.car_make} ${model.car_name
      }</h3>
        <p class="text-cyan-400">Model ID: #${model.id} | Car ID: #${model.car_id
      }</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div>
          <h4 class="text-sm font-medium text-gray-400 mb-2">3D File</h4>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
            <span class="text-gray-300 font-mono text-sm truncate mr-4">${model.file_path
      }</span>
            <a href="/assets/models/${model.file_path
      }" download class="text-cyan-400 hover:text-cyan-300 text-sm font-bold">Download</a>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-700/30 p-4 rounded-lg">
            <label class="text-xs text-gray-400 uppercase tracking-wider">Scale X</label>
            <p class="text-2xl font-bold text-white mt-1">${model.scale_x}</p>
          </div>
          <div class="bg-gray-700/30 p-4 rounded-lg">
            <label class="text-xs text-gray-400 uppercase tracking-wider">Rotation Y</label>
            <p class="text-2xl font-bold text-white mt-1">${model.rot_y}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
    <button onclick="window.app.deleteModel(${model.id
      })" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
      Supprimer (Delete)
    </button>
    <button onclick="window.app.openModelModal(${modelStr})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
      Modifier (Edit)
    </button>
  </div>
</div>
      </div >
  `;
  }
}

// --- CORE APP CLASS ---

class App {
  constructor() {
    // 1. Security Check First
    this.checkAuth();
    this.language = localStorage.getItem("adminLanguage") || "en"; // Load Language
    this.fleetData = [];
    this.clientsData = [];
    this.clientsData = [];
    this.rentalsData = [];
    this.locationsData = [];
    this.modelsData = [];
    this.carsData = [];

    // 2. Initialize UI Components
    this.updateUserInfo();

    // 3. Initialize Managers
    this.kpiManager = new KPIManager();
    this.tableManager = new TableManager();
    this.analyticsManager = new AnalyticsManager();
    this.settingsManager = new SettingsManager();

    // 4. Setup Router
    this.router = {
      currentRoute: "dashboard",
      navigate: (route) => {
        this.router.currentRoute = route;
        this.sidebar.render();
        this.renderContent();
        if (window.innerWidth < 1024) this.sidebar.toggle(false);
      },
    };
    this.sidebar = new Sidebar(this.router);

    // 5. Global Access
    window.app = this;

    // 6. Start Background Tasks
    this.initAutoLogout();
    this.initLanguageSelector();
    this.updateStaticTranslations();
  }

  initLanguageSelector() {
    const selector = document.getElementById("admin-language-selector");
    if (selector) {
      selector.value = this.language;
      selector.addEventListener("change", (e) => this.changeLanguage(e.target.value));
    }
  }

  changeLanguage(lang) {
    this.language = lang;
    localStorage.setItem("adminLanguage", lang);
    this.updateStaticTranslations();
    this.sidebar.render(); // Update Sidebar text
    this.renderContent(); // Re-render current view (tables/settings)
  }

  updateStaticTranslations() {
    const t = translations[this.language]?.admin || translations.en.admin;

    // Fixed Header Elements
    // Note: Some elements might need specific IDs added in HTML if not present
    // For now, assuming dynamic re-renders handle most, but Logout tooltip/text
    // could be updated if we had direct access. Be careful with DOM Elements.
  }

  injectRentalModal() {
    if (document.getElementById("rentalModal")) return;

    const modalHTML = `
      <div id="rentalModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="rentalModalBackdrop" class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity opacity-0 transition-opacity duration-300"></div>
        
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="rentalModalPanel" class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-700">
              
              <form id="rentalForm" onsubmit="window.app.handleRentalSubmit(event)">
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-400 mb-4">Create New Rental</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Select Client</label>
                      <select id="rentalClientSelect" name="client_id" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                         <option value="">Loading clients...</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Select Vehicle Model</label>
                      <select id="rentalCarSelect" name="car_id" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                         <option value="">Loading cars...</option>
                      </select>
                      <p class="text-xs text-gray-500 mt-1">Only shows models with available units.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                        <input type="date" name="rental_start" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                        <input type="date" name="rental_end" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Confirm Booking</button>
                  <button type="button" onclick="window.app.closeRentalModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 ring-1 ring-inset ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  async openRentalModal() {
    // 1. Reset Form
    const form = document.getElementById("rentalForm");
    if (form) form.reset();

    const clientSelect = document.getElementById("rentalClientSelect");
    const carSelect = document.getElementById("rentalCarSelect");

    // 2. Load Data if dropdowns are empty
    // We reuse the existing data loaded in fetchTableData if available, otherwise fetch
    if (!this.clientsData.length || !this.fleetData.length) {
      await this.fetchTableData();
    }

    // Populate Clients
    clientSelect.innerHTML = '<option value="">-- Select Client --</option>';
    this.clientsData.forEach((c) => {
      clientSelect.innerHTML += `<option value="${c.id}">${c.first_name} ${c.last_name} (${c.email})</option>`;
    });

    // Populate Cars (Extract unique models from fleet data or use separate API)
    // Here we use a Set to get unique car models from the fleet list
    const uniqueCars = new Map();
    this.fleetData.forEach((unit) => {
      if (!uniqueCars.has(unit.car_id)) {
        uniqueCars.set(unit.car_id, { name: unit.name, make: unit.make });
      }
    });

    carSelect.innerHTML = '<option value="">-- Select Vehicle --</option>';
    uniqueCars.forEach((val, key) => {
      carSelect.innerHTML += `<option value="${key}">${val.make} ${val.name}</option>`;
    });

    // 3. Show Modal
    const modal = document.getElementById("rentalModal");
    const backdrop = document.getElementById("rentalModalBackdrop");
    const panel = document.getElementById("rentalModalPanel");

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
    }, 10);
  }

  closeRentalModal() {
    const modal = document.getElementById("rentalModal");
    const backdrop = document.getElementById("rentalModalBackdrop");
    const panel = document.getElementById("rentalModalPanel");

    backdrop.classList.add("opacity-0");
    panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
    panel.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  async handleRentalSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Booking...";
    btn.disabled = true;

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("http://localhost:3000/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Rental created successfully!");
        this.closeRentalModal();
        this.fetchTableData(); // Refresh tables
        this.kpiManager.fetchData(); // Refresh KPIs (Revenue/Active rentals)
      } else {
        toast.error("Error: " + (result.error || "Failed to create rental"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  // 2. RENDER RENTALS TABLE (With Filters)
  renderRentalsTable() {
    const formattedData = this.rentalsData.map((r) => ({
      ...r,
      full_name: `${r.first_name} ${r.last_name} `,
      formatted_date: new Date(r.rental_start).toLocaleDateString(),
      formatted_price: `$${r.price} `,
    }));

    // --- FILTERS: Status & Car Make ---
    const uniqueMakes = [...new Set(formattedData.map((r) => r.car_make))];

    const t = translations[this.language].admin;
    const filterOptions = [
      {
        key: "status",
        label: t.status,
        options: ["rented", "completed", "cancelled"], // Matches DB values
      },
      {
        key: "car_make",
        label: t.make,
        options: uniqueMakes,
      },
    ];

    const getActions = (rental) => {
      const rentalStr = JSON.stringify(rental).replace(/"/g, "&quot;");
      return `
        <div class="flex gap-2">
            <button onclick="window.app.viewDetails('rental', ${rentalStr})" class="text-emerald-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-emerald-600" title="Invoice">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </button>
            <button onclick="window.app.promptRentalStatus(${rental.id}, '${rental.status}')" class="text-cyan-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-cyan-600" title="Update Status">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button onclick="window.app.deleteRental(${rental.id})" class="text-red-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>`;
    };

    // const t declared above

    return this.tableManager.render(
      "rentals-table",
      t.rentals,
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "full_name", label: t.name }, // Using 'Name' or we could add 'Client Name'
        { key: "car_name", label: t.manage_vehicle }, // Vehicle
        { key: "car_make", label: t.make },
        { key: "formatted_date", label: "Date" }, // We might need a key for Date
        { key: "formatted_price", label: t.price },
        { key: "status", label: t.status },
        { key: "actions", label: "" },
      ],
      (r) => {
        let badge = "bg-gray-700 text-gray-400";
        if (r.status === "rented" || r.status === "active")
          badge = "bg-green-900/30 text-green-400 border border-green-900/50";
        if (r.status === "cancelled")
          badge = "bg-red-900/30 text-red-400 border border-red-900/50";
        if (r.status === "completed")
          badge = "bg-blue-900/30 text-blue-400 border border-blue-900/50";

        return `
          <td class="px-6 py-4 text-gray-400">#${r.id}</td>
          <td class="px-6 py-4 font-medium text-white">${r.first_name} ${r.last_name}</td>
          <td class="px-6 py-4 text-gray-300">${r.car_make} ${r.car_name}</td>
          <td class="px-6 py-4 text-gray-400">${r.car_make}</td>
          <td class="px-6 py-4 text-gray-400">${r.formatted_date}</td>
          <td class="px-6 py-4 font-bold text-cyan-400">${r.formatted_price}</td>
          <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs font-bold uppercase ${badge}">${r.status}</span></td>
          <td class="px-6 py-4">${getActions(r)}</td>
        `;
      },
      filterOptions
    );
  }

  // 3. EDIT RENTAL STATUS (Prompt)
  async promptRentalStatus(id, currentStatus) {
    // Simple prompt for now, could be a modal
    const newStatus = prompt(
      "Update Rental Status (rented, completed, cancelled):",
      currentStatus
    );

    if (newStatus && newStatus !== currentStatus) {
      if (
        !["rented", "completed", "cancelled"].includes(newStatus.toLowerCase())
      ) {
        toast.error("Invalid status. Use: rented, completed, or cancelled");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/rentals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus.toLowerCase() }),
        });

        if (res.ok) {
          toast.success("Status updated!");
          this.fetchTableData(); // Refresh UI
          // If we are in detail view, refresh detail view
          if (this.router.currentRoute === "rental-details") {
            // We'd need to re-fetch specific rental, but for now navigate back
            this.router.navigate("rentals");
          }
        } else {
          toast.error("Failed to update status");
        }
      } catch (e) {
        console.error(e);
        toast.error("Network error");
      }
    }
  }

  // 4. DELETE RENTAL
  async deleteRental(id) {
    if (
      !confirm("Are you sure? This will delete the rental record permanently.")
    )
      return;

    try {
      const res = await fetch(`http://localhost:3000/api/rentals/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Rental deleted!");
        this.fetchTableData();
        if (this.router.currentRoute === "rental-details")
          this.router.navigate("rentals");
      } else {
        toast.error("Failed to delete rental");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  }

  // --- NEW: View Details Logic ---
  viewDetails(type, data) {
    const mainContent = document.getElementById("main-content");

    // Switch Content based on type
    if (type === "car") {
      mainContent.innerHTML = DetailsRenderer.renderCarDetails(data);
    } else if (type === "client") {
      mainContent.innerHTML = DetailsRenderer.renderClientDetails(data);
    } else if (type === "rental") {
      mainContent.innerHTML = DetailsRenderer.renderRentalDetails(data);
    } else if (type === "location") {
      mainContent.innerHTML = DetailsRenderer.renderLocationDetails(data);
    } else if (type === "model") {
      mainContent.innerHTML = DetailsRenderer.renderModelDetails(data);
    }

    // Update Router state manually so we know we are in a sub-view
    this.router.currentRoute = `${type}-details`;
  }

  // --- NEW: Export to PDF Logic ---
  exportToPDF() {
    const element = document.getElementById("printable-area");
    const btn = event.currentTarget; // The export button
    const originalText = btn.innerHTML;

    btn.innerHTML = "Generating...";

    const opt = {
      margin: [0.5, 0.5],
      filename: `Autolux_Report_${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#111827" }, // Dark bg for PDF
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Use html2pdf library
    if (typeof html2pdf !== "undefined") {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          btn.innerHTML = originalText;
          toast.success("PDF Downloaded!");
        });
    } else {
      alert(
        "PDF Library not loaded. Please ensure html2pdf.js is in index.html"
      );
      btn.innerHTML = originalText;
    }
  }

  // 2. Open the Modal
  openClientModal(client = null) {
    // If client is null, we are CREATING. If client exists, we are EDITING.
    if (client) {
      document.getElementById("clientUnitId").value = client.id;
      document.getElementById("clientFirstName").value =
        client.first_name || "";
      document.getElementById("clientLastName").value = client.last_name || "";
      document.getElementById("clientEmail").value = client.email || "";
      document.getElementById("clientPhone").value = client.phone || "";
    } else {
      // Clear form for new client
      document.getElementById("clientForm").reset();
      document.getElementById("clientUnitId").value = "";
    }

    // Show Modal Animation
    const modal = document.getElementById("clientModal");
    const backdrop = document.getElementById("clientModalBackdrop");
    const panel = document.getElementById("clientModalPanel");

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
    }, 10);
  }

  // 3. Close the Modal
  closeClientModal() {
    const modal = document.getElementById("clientModal");
    const backdrop = document.getElementById("clientModalBackdrop");
    const panel = document.getElementById("clientModalPanel");

    backdrop.classList.add("opacity-0");
    panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
    panel.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  // 4. Handle Form Submit
  async handleClientSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Saving...";
    btn.disabled = true;

    const clientId = document.getElementById("clientUnitId").value;
    const data = {
      first_name: document.getElementById("clientFirstName").value,
      last_name: document.getElementById("clientLastName").value,
      email: document.getElementById("clientEmail").value,
      phone: document.getElementById("clientPhone").value,
    };

    // Determine URL and Method based on if we have an ID
    const url = clientId
      ? `http://localhost:3000/api/clients/${clientId}`
      : `http://localhost:3000/api/clients`;

    const method = clientId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        this.closeClientModal();
        this.fetchTableData(); // Refresh table
        toast.success(
          clientId
            ? "Client updated successfully!"
            : "Client created successfully!"
        );
      } else {
        const errData = await res.json();
        toast.error("Error: " + (errData.error || "Operation failed"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  fillModelFields(data) {
    document.getElementById("carMake").value = data.make || "";
    document.getElementById("carName").value = data.name || "";
    document.getElementById("carPrice").value = data.price || "";

    // Handle Description & Locations (JSONB)
    try {
      // If coming from DB, it might be an object. If from cache, might be string.
      const descObj =
        typeof data.description === "string"
          ? JSON.parse(data.description)
          : data.description;
      const locObj =
        typeof data.locations === "string"
          ? JSON.parse(data.locations)
          : data.locations;

      // Prefer English ('en'), fallback to first available language
      const descText =
        descObj?.en || (descObj ? Object.values(descObj)[0] : "") || "";
      const locText =
        locObj?.en || (locObj ? Object.values(locObj)[0] : "") || "";

      document.getElementById("carDescription").value = descText;
      document.getElementById("carLocation").value = locText;
    } catch (e) {
      console.warn("JSON Parse Error (Ignore if creating new):", e);
      document.getElementById("carDescription").value = "";
      document.getElementById("carLocation").value = "";
    }
  }

  // 2. HANDLE DROPDOWN CHANGE
  // CALLED BY: onchange event in HTML Select Element
  handleModelSelect(val) {
    const overlay = document.getElementById("modelLockOverlay");

    if (val === "NEW") {
      // Unlock and Clear
      overlay.classList.add("hidden");
      [
        "carMake",
        "carName",
        "carPrice",
        "carDescription",
        "carLocation",
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
    } else {
      // Find model in cache and Fill
      const model = this.modelsCache.find((m) => m.id == val);
      if (model) {
        this.fillModelFields(model);
        overlay.classList.remove("hidden"); // Lock fields
      }
    }
  }

  // 3. LOAD MODELS FOR DROPDOWN
  async loadModelsForDropdown() {
    try {
      const res = await fetch("http://localhost:3000/api/cars");
      const data = await res.json();
      this.modelsCache = data.data || data;

      const select = document.getElementById("modelSelect");
      if (!select) return;

      let html = `<option value="NEW" class="text-cyan-400 font-bold">+ Create New Model</option>`;
      this.modelsCache.forEach((m) => {
        html += `<option value="${m.id}">${m.make} ${m.name}</option>`;
      });
      select.innerHTML = html;
    } catch (e) {
      console.error("Error loading models", e);
    }
  }

  // 4. OPEN MODAL
  // CALLED BY: "Add Vehicle" button or "Edit" button in table
  async openCarModal(car = null) {
    // A. Always load latest models list first
    await this.loadModelsForDropdown();

    const select = document.getElementById("modelSelect");
    const overlay = document.getElementById("modelLockOverlay");

    // Reset Form
    document.getElementById("carForm").reset();
    document.getElementById("carUnitId").value = "";

    if (car) {
      // --- EDIT MODE ---
      // 1. Lock Dropdown (Cannot change model of existing unit easily)
      select.innerHTML = `<option value="${car.car_id}" selected>${car.make} ${car.name}</option>`;
      select.disabled = true;

      // 2. Fill Unit Data (VIN, Color, etc.)
      document.getElementById("carUnitId").value = car.id; // Unit ID from Fleet table
      document.getElementById("carVin").value = car.vin || "";
      document.getElementById("carColor").value = car.color || "#ffffff";
      document.getElementById("colorPicker").value = car.color || "#ffffff";

      const statusSelect = document.getElementById("carStatus");
      if (statusSelect) statusSelect.value = car.status || "available";

      // 3. Fill Model Data & Lock it
      // Note: 'car' object from fleet table usually has make/name/price joined.
      // We pass the whole 'car' object to fillModelFields.
      this.fillModelFields(car);
      overlay.classList.remove("hidden");
    } else {
      // --- CREATE MODE ---
      select.disabled = false;
      select.value = "NEW";
      this.handleModelSelect("NEW"); // Ensure fields are cleared/unlocked
    }

    // Show Modal
    const modal = document.getElementById("carModal");
    const backdrop = document.getElementById("modalBackdrop");
    const panel = document.getElementById("modalPanel");

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
    }, 10);
  }

  closeCarModal() {
    const modal = document.getElementById("carModal");
    const backdrop = document.getElementById("modalBackdrop");
    const panel = document.getElementById("modalPanel");

    backdrop.classList.add("opacity-0");
    panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
    panel.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  unlockModelFields() {
    document.getElementById("modelLockOverlay").classList.add("hidden");
    toast.error(
      "Warning: Changing these details will update the catalog for ALL cars of this model."
    );
  }

  // 5. SUBMIT HANDLER
  async handleCarSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Saving...";
    btn.disabled = true;

    const formData = new FormData(event.target);
    const unitId = formData.get("unitId");

    const url = unitId
      ? `http://localhost:3000/api/cars/${unitId}`
      : `http://localhost:3000/api/cars`;
    const method = unitId ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (res.ok) {
        this.closeCarModal();
        this.fetchTableData(); // Refresh table
        toast.success("Success!");
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  // 6. DELETE VEHICLE
  async deleteVehicle(unitId) {
    if (!confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/cars/${unitId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Vehicle deleted successfully!");
        this.fetchTableData(); // Refresh table
      } else {
        const data = await res.json();
        toast.error("Error: " + (data.error || "Failed to delete vehicle"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    }
  }

  // --- LOCATIONS MODAL & LOGIC ---

  injectLocationModal() {
    if (document.getElementById("locationModal")) return;

    const modalHTML = `
      <div id="locationModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="locationModalBackdrop" class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity opacity-0 transition-opacity duration-300"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="locationModalPanel" class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-700">
              
              <form id="locationForm" onsubmit="window.app.handleLocationSubmit(event)">
                <input type="hidden" name="locationId" id="locationId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-400 mb-4" id="locationModalTitle">Add Location</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">City Name</label>
                      <input type="text" name="city_name" id="locCityName" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Map Embed URL (Google Maps)</label>
                      <textarea name="map_embed_url" id="locMapUrl" rows="3" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500 font-mono text-xs"></textarea>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Location</button>
                  <button type="button" onclick="window.app.closeLocationModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 ring-1 ring-inset ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  openLocationModal(location = null) {
    const form = document.getElementById("locationForm");
    const title = document.getElementById("locationModalTitle");

    if (location) {
      // Edit Mode
      document.getElementById("locationId").value = location.id;
      document.getElementById("locCityName").value = location.city_name;
      document.getElementById("locMapUrl").value = location.map_embed_url;
      title.textContent = "Edit Location";
    } else {
      // Create Mode
      form.reset();
      document.getElementById("locationId").value = "";
      title.textContent = "Add New Location";
    }

    // Animation
    const modal = document.getElementById("locationModal");
    const backdrop = document.getElementById("locationModalBackdrop");
    const panel = document.getElementById("locationModalPanel");

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
    }, 10);
  }

  closeLocationModal() {
    const modal = document.getElementById("locationModal");
    const backdrop = document.getElementById("locationModalBackdrop");
    const panel = document.getElementById("locationModalPanel");

    backdrop.classList.add("opacity-0");
    panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
    panel.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  async handleLocationSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Saving...";
    btn.disabled = true;

    const id = document.getElementById("locationId").value;
    const data = {
      city_name: document.getElementById("locCityName").value,
      map_embed_url: document.getElementById("locMapUrl").value,
    };

    const url = id
      ? `http://localhost:3000/api/locations/${id}`
      : `http://localhost:3000/api/locations`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success(id ? "Location updated!" : "Location added!");
        this.closeLocationModal();
        this.fetchTableData();
      } else {
        const err = await res.json();
        toast.error("Error: " + (err.error || "Request failed"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  async deleteLocation(id) {
    if (!confirm("Are you sure you want to delete this location?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/locations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Location deleted!");
        this.fetchTableData();
      } else {
        toast.error("Failed to delete location");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  }

  // --- CLIENT MODAL & LOGIC ---

  // 1. Create the Modal HTML dynamically
  injectClientModal() {
    if (document.getElementById("clientModal")) return; // Prevent duplicates

    const modalHTML = `
      <div id="clientModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="clientModalBackdrop" class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity opacity-0 transition-opacity duration-300"></div>
        
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="clientModalPanel" class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-700">
              
              <form id="clientForm" onsubmit="window.app.handleClientSubmit(event)">
                <input type="hidden" name="clientId" id="clientUnitId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-400 mb-4">Edit Client</h3>
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                        <input type="text" name="first_name" id="clientFirstName" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                        <input type="text" name="last_name" id="clientLastName" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input type="email" name="email" id="clientEmail" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                      <input type="text" name="phone" id="clientPhone" class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                    </div>
                  </div>
                </div>

                <div class="bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Changes</button>
                  <button type="button" onclick="window.app.closeClientModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 ring-1 ring-inset ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // --- DELETE CLIENT ---
  async deleteClient(clientId) {
    if (!confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Client deleted successfully!");
        this.fetchTableData(); // Refresh table to show real DB data
      } else {
        const data = await res.json();
        toast.error("Error: " + (data.error || "Failed to delete client"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    }
  }

  checkAuth() {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      window.location.href = "login.html";
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user.role !== "admin") {
        window.location.href = "index.html";
      }
    } catch (e) {
      localStorage.clear();
      window.location.href = "login.html";
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }

  updateUserInfo() {
    const userString = localStorage.getItem("user");
    if (!userString) return;

    try {
      const user = JSON.parse(userString);
      const firstname = user.first_name || "Admin";
      const lastname = user.last_name || "";

      const initials = (firstname[0] + (lastname[0] || "")).toUpperCase();
      const fullName = `${firstname} ${lastname}`.trim();

      const avatarEl = document.getElementById("admin-avatar");
      const nameEl = document.getElementById("admin-name");

      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl) nameEl.textContent = fullName;
    } catch (e) {
      console.error("Error parsing user for header:", e);
    }
  }

  // Called in Constructor to handle inactivity
  initAutoLogout() {
    let timeout;

    const resetTimer = () => {
      // Check if the feature is actually enabled in settings
      const settings = JSON.parse(localStorage.getItem("adminSettings")) || {};
      if (!settings.autoLogout) return;

      clearTimeout(timeout);

      // Set timer for 15 minutes (15 * 60 * 1000)
      timeout = setTimeout(() => {
        toast.error("Session expired due to inactivity.");
        this.logout();
      }, 15 * 60 * 1000);
    };

    // Listen for activity
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onclick = resetTimer;
  }

  async init() {
    this.injectClientModal();
    this.injectRentalModal();
    this.injectLocationModal();
    this.injectModelModal();
    this.sidebar.render();
    this.renderContent();

    await Promise.all([this.kpiManager.fetchData(), this.fetchTableData()]);

    if (this.router.currentRoute === "dashboard") {
      this.renderContent();
    }
  }

  async fetchTableData() {
    try {
      // 1. Fetch all data in parallel
      const [clients, fleet, rentals, locationsRes, modelsRes, carsRes] =
        await Promise.all([
          getClientsList(),
          getFleetList(),
          getRentalsList(),
          getLocationsList(),
          getModelsList(),
          getcars(),
        ]);

      // 2. Assign data to class properties
      this.clientsData = clients || [];
      this.fleetData = fleet || [];
      this.rentalsData = rentals || [];
      this.modelsData = modelsRes?.data || [];
      this.carsData = carsRes || [];

      // Process locations
      const rawLocations = locationsRes.data || [];
      this.locationsData = rawLocations.map((l) => ({
        ...l,
        short_url:
          l.map_embed_url && l.map_embed_url.length > 40
            ? l.map_embed_url.substring(0, 40) + "..."
            : l.map_embed_url,
      }));

      // 3. Update "Clients" Table if it exists
      if (this.tableManager.tables["clients-table"]) {
        this.tableManager.tables["clients-table"].data = this.clientsData;
        this.tableManager.updateTableUI("clients-table");
      }

      // 4. Update "Cars" Table if it exists
      if (this.tableManager.tables["cars-table"]) {
        this.tableManager.tables["cars-table"].data = this.fleetData;
        this.tableManager.updateTableUI("cars-table");
      }

      // 5. Update "Rentals" Table if it exists
      if (this.tableManager.tables["rentals-table"]) {
        this.tableManager.tables["rentals-table"].data = this.rentalsData;
        this.tableManager.updateTableUI("rentals-table");
      }

      // 6. Update "Locations" Table if it exists
      if (this.tableManager.tables["locations-table"]) {
        this.tableManager.tables["locations-table"].data = this.locationsData;
        this.tableManager.updateTableUI("locations-table");
      }

      // 7. Update "Models" Table if it exists
      if (this.tableManager.tables["models-table"]) {
        this.tableManager.tables["models-table"].data = this.modelsData;
        this.tableManager.updateTableUI("models-table");
      }
    } catch (err) {
      console.error("Failed to load table data", err);
      toast.error("Network error: Could not load data.");
    }
  }
  renderCarsTable() {
    const formattedData = this.fleetData.map((car) => ({
      ...car,
      availability: car.status.charAt(0).toUpperCase() + car.status.slice(1),
    }));

    // --- 1. Define Filter Options ---
    // Extract unique makes from data for the dropdown
    const uniqueMakes = [...new Set(formattedData.map((c) => c.make))];
    const uniqueStatus = ["available", "rented", "maintenance"];

    const filterOptions = [
      { key: "make", label: "All Makes", options: uniqueMakes },
      { key: "status", label: "All Statuses", options: uniqueStatus },
    ];

    const getActionBtns = (car) => {
      const carStr = JSON.stringify(car).replace(/"/g, "&quot;");
      return `
            <div class="flex gap-2">
              <button onclick="window.app.viewDetails('car', ${carStr})" class="text-emerald-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
              <button onclick="window.app.openCarModal(${carStr})" class="text-cyan-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="window.app.deleteVehicle(${car.id})" class="text-red-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-red-600" title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
        `;
    };

    // --- 2. Pass filterOptions to render ---
    const t = translations[this.language].admin; // Access translation keys

    return this.tableManager.render(
      "cars-table",
      t.fleet, // "Fleet Management"
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "image", label: t.image },
        { key: "name", label: t.name },
        { key: "make", label: t.make },
        { key: "price", label: t.price },
        { key: "color", label: t.color },
        { key: "status", label: t.status },
        { key: "actions", label: "" },
      ],
      (car) => {
        const imgUrl = car.image ? `/assets/images/${car.image}` : "";
        const imgHtml = imgUrl
          ? `<img src="${imgUrl}" alt="${car.name}" class="w-10 h-10 object-cover rounded border border-gray-600" onerror="this.src='http://localhost:3000/assets/images/placeholder.png'">`
          : "-";

        let badgeColor = "bg-green-900/30 text-green-400";
        if (car.status === "rented")
          badgeColor = "bg-amber-900/30 text-amber-400";
        if (car.status === "maintenance")
          badgeColor = "bg-red-900/30 text-red-400";

        return `
        <td class="px-6 py-4 font-medium text-white">${car.id}</td>
        <td class="px-6 py-4">${imgHtml}</td>
        <td class="px-6 py-4 font-medium text-white">${car.name}</td>
        <td class="px-6 py-4">${car.make}</td>
        <td class="px-6 py-4">$${car.price}</td>
        <td class="px-6 py-4"><span class="inline-block w-6 h-6 rounded-full border border-gray-300" style="background-color: ${car.color
          }"></span></td>
        <td class="px-6 py-4"><span class="px-2 py-1 rounded-full text-xs ${badgeColor}">${car.status
          }</span></td>
        <td class="px-6 py-4">${getActionBtns(car)}</td>
        `;
      },
      filterOptions // <--- Passed here
    );
  }

  renderClientsTable() {
    // 1. Process data to add derived fields for filtering
    const formattedData = this.clientsData.map((c) => {
      // Derive Email Provider logic
      let provider = "Other";
      const email = (c.email || "").toLowerCase();
      if (email.includes("@gmail")) provider = "Gmail";
      else if (
        email.includes("@hotmail") ||
        email.includes("@outlook") ||
        email.includes("@live")
      ) {
        provider = "Microsoft";
      } else if (email.includes("@yahoo")) {
        provider = "Yahoo";
      }

      // --- LOGIC FIX: Changed "Verified" to "Provided" ---
      const phoneStatus =
        c.phone && c.phone.trim().length > 0 ? "Provided" : "Missing";

      return {
        ...c,
        fullName: `${c.first_name} ${c.last_name}`,
        provider: provider,
        phoneStatus: phoneStatus, // Used for filtering
      };
    });

    // 2. Define Filter Options
    const filterOptions = [
      {
        key: "provider",
        label: "Email Provider",
        options: ["Gmail", "Microsoft", "Yahoo", "Other"],
      },
      {
        key: "phoneStatus",
        label: "Phone Availability", // Renamed for clarity
        options: ["Provided", "Missing"], // Renamed options
      },
    ];

    const getClientActions = (client) => {
      const clientStr = JSON.stringify(client).replace(/"/g, "&quot;");
      return `
            <div class="flex gap-2">
              <button onclick="window.app.viewDetails('client', ${clientStr})" 
                      class="text-emerald-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-emerald-600"
                      title="View Details">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>

              <button onclick="window.app.openClientModal(${clientStr})" 
                      class="text-cyan-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-cyan-600"
                      title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              
              <button onclick="window.app.deleteClient(${client.id})" 
                      class="text-red-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-red-600"
                      title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
        `;
    };

    const t = translations[this.language].admin;

    return this.tableManager.render(
      "clients-table",
      t.users, // "Clients Management" or "Users"
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "fullName", label: t.name },
        { key: "email", label: t.email }, // "Email Address"
        { key: "phone", label: t.phone },
        { key: "actions", label: "" },
      ],
      (c) => `
          <td class="px-6 py-4 text-gray-400">#${c.id}</td>
          <td class="px-6 py-4 font-medium text-white">
            ${c.first_name} ${c.last_name}
          </td>
          <td class="px-6 py-4 text-cyan-400">${c.email}</td>
          <td class="px-6 py-4">
            ${c.phone
          ? `<span class="text-gray-300 font-mono text-xs">${c.phone}</span>`
          : `<span class="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-900/30">Missing</span>`
        }
          </td>
          <td class="px-6 py-4">${getClientActions(c)}</td>
      `,
      filterOptions
    );
  }

  renderLocationsTable() {
    // We use this.locationsData which is ALREADY formatted from fetchTableData
    // Add derived field 'first_letter' for filtering
    const formattedData = this.locationsData.map((l) => ({
      ...l,
      first_letter: l.city_name.charAt(0).toUpperCase(),
    }));

    const uniqueCities = [...new Set(formattedData.map((l) => l.city_name))];
    const uniqueLetters = [
      ...new Set(formattedData.map((l) => l.first_letter)),
    ].sort();

    const filterOptions = [
      { key: "city_name", label: "Select City", options: uniqueCities },
      { key: "first_letter", label: "Alphabetical", options: uniqueLetters },
    ];

    const getActions = (location) => {
      // Safe object creation for the buttons
      // We recreate the object with just what we need to avoid quote issues
      const locData = {
        id: location.id,
        city_name: location.city_name,
        map_embed_url: location.map_embed_url,
      };
      // Use single quotes for the JSON string to avoid conflicts with HTML attributes
      const locStr = JSON.stringify(locData).replace(/"/g, "&quot;");

      return `
        <div class="flex gap-2">
           <button onclick="window.app.viewDetails('location', ${locStr})" class="text-emerald-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
           </button>
           <button onclick="window.app.openLocationModal(${locStr})" class="text-cyan-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
           </button>
           <button onclick="window.app.deleteLocation(${location.id})" class="text-red-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      `;
    };

    const t = translations[this.language].admin;

    return this.tableManager.render(
      "locations-table",
      t.locations, // "Agency Locations"
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "city_name", label: "City" }, // Add key "City" if missing, or use a literal if needed
        { key: "short_url", label: "Map Source" },
        { key: "actions", label: "" },
      ],
      (l) => `
          <td class="px-6 py-4 text-gray-400">#${l.id}</td>
          <td class="px-6 py-4 font-bold text-white text-lg">${l.city_name}</td>
          <td class="px-6 py-4 text-cyan-400 font-mono text-xs">
            <a href="${l.map_embed_url
        }" target="_blank" class="hover:underline truncate block w-64">${l.short_url
        }</a>
          </td>
          <td class="px-6 py-4">${getActions(l)}</td>
      `,
      filterOptions
    );
  }
  renderModelsTable() {
    const formattedData = this.modelsData;

    // --- 1. Define Filter Options ---
    const uniqueMakes = [...new Set(formattedData.map((m) => m.car_make))];
    const uniqueNames = [...new Set(formattedData.map((m) => m.car_name))];

    const filterOptions = [
      { key: "car_make", label: "All Makes", options: uniqueMakes },
      { key: "car_name", label: "All Models", options: uniqueNames },
    ];

    const getActions = (model) => {
      const modelStr = JSON.stringify(model).replace(/"/g, "&quot;");
      return `
        <div class="flex gap-2">
           <button onclick="window.app.viewDetails('model', ${modelStr})" class="text-emerald-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
           </button>
           <button onclick="window.app.openModelModal(${modelStr})" class="text-cyan-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
           </button>
           <button onclick="window.app.deleteModel(${model.id})" class="text-red-400 hover:text-white transition p-2 bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      `;
    };

    const t = translations[this.language].admin;

    return this.tableManager.render(
      "models-table",
      t.manage_vehicle, // "3D Models Management"
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "car_name", label: t.name }, // Car Model -> Name
        { key: "file_path", label: "File Path" },
        { key: "scale_x", label: "Scale X" },
        { key: "rot_y", label: "Rot Y" },
        { key: "actions", label: "" },
      ],
      (m) => `
          <td class="px-6 py-4 text-gray-400">#${m.id}</td>
          <td class="px-6 py-4 font-medium text-white">${m.car_make} ${m.car_name
        }</td>
          <td class="px-6 py-4 text-cyan-400 font-mono text-xs truncate max-w-[200px]">${m.file_path
        }</td>
          <td class="px-6 py-4 text-gray-300">${m.scale_x}</td>
          <td class="px-6 py-4 text-gray-300">${m.rot_y}</td>
          <td class="px-6 py-4">${getActions(m)}</td>
      `,
      filterOptions
    );
  }

  // --- MODEL MODAL & LOGIC ---

  injectModelModal() {
    if (document.getElementById("modelModal")) return;

    const modalHTML = `
      <div id="modelModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="modelModalBackdrop" class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity opacity-0 transition-opacity duration-300"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="modelModalPanel" class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-700">
              
              <form id="modelForm" onsubmit="window.app.handleModelSubmit(event)">
                <input type="hidden" name="modelId" id="modelId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-400 mb-4" id="modelModalTitle">Add Model</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Select Car</label>
                      <select name="car_id" id="modelCarId" required class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                         <option value="">Loading cars...</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-400 mb-1">Model File (.glb)</label>
                      <input type="file" name="file" id="modelFile" accept=".glb,.gltf" class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500 text-sm">
                      <p id="currentModelFile" class="text-xs text-gray-500 mt-1 hidden"></p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-400 mb-1">Scale X</label>
                        <input type="number" step="0.01" name="scale_x" id="modelScaleX" value="1.0" class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                      <div>
                         <label class="block text-sm font-medium text-gray-400 mb-1">Rotation Y</label>
                         <input type="number" step="0.01" name="rot_y" id="modelRotY" value="0.0" class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Model</button>
                  <button type="button" onclick="window.app.closeModelModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 ring-1 ring-inset ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  openModelModal(model = null) {
    const form = document.getElementById("modelForm");
    const title = document.getElementById("modelModalTitle");
    const carSelect = document.getElementById("modelCarId");

    // Populate Car Select
    carSelect.innerHTML = '<option value="">-- Select Car --</option>';
    this.carsData.forEach((c) => {
      carSelect.innerHTML += `<option value="${c.id}">${c.make} ${c.name}</option>`;
    });

    if (model) {
      document.getElementById("modelId").value = model.id;
      carSelect.value = model.car_id;
      // Show current file
      const currentFileEl = document.getElementById("currentModelFile");
      currentFileEl.textContent = `Current: ${model.file_path}`;
      currentFileEl.classList.remove("hidden");

      document.getElementById("modelScaleX").value = model.scale_x;
      document.getElementById("modelRotY").value = model.rot_y;
      title.textContent = "Edit Model";
    } else {
      form.reset();
      document.getElementById("modelId").value = "";
      document.getElementById("modelScaleX").value = "1.0";
      document.getElementById("modelRotY").value = "0.0";

      const currentFileEl = document.getElementById("currentModelFile");
      currentFileEl.textContent = "";
      currentFileEl.classList.add("hidden");

      title.textContent = "Add New Model";
    }

    const modal = document.getElementById("modelModal");
    const backdrop = document.getElementById("modelModalBackdrop");
    const panel = document.getElementById("modelModalPanel");

    modal.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      panel.classList.remove(
        "opacity-0",
        "translate-y-4",
        "sm:translate-y-0",
        "sm:scale-95"
      );
      panel.classList.add("opacity-100", "translate-y-0", "sm:scale-100");
    }, 10);
  }

  closeModelModal() {
    const modal = document.getElementById("modelModal");
    const backdrop = document.getElementById("modelModalBackdrop");
    const panel = document.getElementById("modelModalPanel");

    backdrop.classList.add("opacity-0");
    panel.classList.remove("opacity-100", "translate-y-0", "sm:scale-100");
    panel.classList.add(
      "opacity-0",
      "translate-y-4",
      "sm:translate-y-0",
      "sm:scale-95"
    );

    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  async handleModelSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Saving...";
    btn.disabled = true;

    const id = document.getElementById("modelId").value;
    const formData = new FormData();
    formData.append("car_id", document.getElementById("modelCarId").value);
    formData.append("scale_x", document.getElementById("modelScaleX").value);
    formData.append("rot_y", document.getElementById("modelRotY").value);

    // Append file if selected
    const fileInput = document.getElementById("modelFile");
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    } else if (!id) {
      // If adding new, file is required
      toast.error("Please upload a 3D model file");
      btn.innerHTML = originalText;
      btn.disabled = false;
      return;
    }

    const url = id
      ? `http://localhost:3000/api/models/${id}`
      : `http://localhost:3000/api/models`;
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        // No Content-Type header for FormData, browser sets it
        body: formData,
      });

      if (res.ok) {
        toast.success(id ? "Model updated!" : "Model added!");
        this.closeModelModal();
        this.fetchTableData();
      } else {
        const err = await res.json();
        toast.error("Error: " + (err.error || "Request failed"));
      }
    } catch (e) {
      console.error(e);
      toast.error("Network Error");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  async deleteModel(id) {
    if (!confirm("Are you sure you want to delete this model?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/models/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Model deleted!");
        this.fetchTableData();
      } else {
        toast.error("Failed to delete model");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    }
  }

  renderContent() {
    const mainContentEl = document.getElementById("main-content");
    let contentHtml = "";
    const t = translations[this.language]?.admin || translations.en.admin;

    switch (this.router.currentRoute) {
      case "cars":
        contentHtml = `
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${t.fleet}</h2>
                 <button onclick="window.app.openCarModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    ${t.add_vehicle}
                 </button>
             </div>
             ${this.renderCarsTable()}
          </div>
        `;
        break;

      case "clients":
        contentHtml = `
          <div class="p-8 space-y-6">
              <div class="flex justify-between items-center">
                  <h2 class="text-2xl font-bold text-cyan-400">${t.clients_management}</h2>
                  <button onclick="window.app.openClientModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                     ${t.add_client}
                  </button>
              </div>
              ${this.renderClientsTable()}
          </div>
        `;
        break;

      case "rentals":
        contentHtml = `
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${t.rentals_management}</h2>
                 <button onclick="window.app.openRentalModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    ${t.add_rental}
                 </button>
             </div>
             ${this.renderRentalsTable()}
          </div>
        `;
        break;
      case "locations":
        contentHtml = `
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${t.locations_management}</h2>
                 <button onclick="window.app.openLocationModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    ${t.add_location}
                 </button>
             </div>
             ${this.renderLocationsTable()}
          </div>
        `;
        break;

      case "models":
        contentHtml = `
            <div class="p-8 space-y-6">
               <div class="flex justify-between items-center">
                   <h2 class="text-2xl font-bold text-cyan-400">${t.models_management}</h2>
                   <button onclick="window.app.openModelModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      ${t.add_model}
                   </button>
               </div>
               ${this.renderModelsTable()}
            </div>
          `;
        break;

      case "analytics":
        mainContentEl.innerHTML = this.analyticsManager.render();
        this.analyticsManager.initCharts();
        return;

      case "settings":
        mainContentEl.innerHTML = this.settingsManager.render();
        setTimeout(() => {
          this.settingsManager.attachEvents();
        }, 0);
        return;

      case "dashboard":
      default:
        contentHtml = `
          <div class="p-8 space-y-8">
            ${this.kpiManager.render()}
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              ${this.renderCarsTable()}
              ${this.renderClientsTable()}
            </section>
          </div>`;
        break;
    }
    // Update DOM for non-manager routes
    mainContentEl.innerHTML = contentHtml;
  }
}

// --- INITIALIZATION ---
window.onload = () => {
  const app = new App();
  app.init();
};
