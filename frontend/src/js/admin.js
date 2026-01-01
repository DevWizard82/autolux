import {
  getCarsCount,
  getClientsCount,
  getRentalsCount,
  getRevenue,
  getAvailableCars,
  getClientsList,
  getFleetList,
} from "./api.js";

const MOCK_CARS = [
  {
    id: 1,
    name: "S-Class",
    model: "Mercedes-Benz",
    year: 2024,
    price: 550,
    availability: "Available",
  },
  {
    id: 2,
    name: "Ghost",
    model: "Rolls-Royce",
    year: 2023,
    price: 980,
    availability: "Rented",
  },
  {
    id: 3,
    name: "911 Turbo",
    model: "Porsche",
    year: 2024,
    price: 720,
    availability: "Available",
  },
  {
    id: 4,
    name: "Urus",
    model: "Lamborghini",
    year: 2022,
    price: 850,
    availability: "Maintenance",
  },
  {
    id: 5,
    name: "F8 Tributo",
    model: "Ferrari",
    year: 2023,
    price: 1100,
    availability: "Available",
  },
  {
    id: 6,
    name: "Model S",
    model: "Tesla",
    year: 2024,
    price: 400,
    availability: "Available",
  },
  {
    id: 7,
    name: "F-Type",
    model: "Jaguar",
    year: 2023,
    price: 450,
    availability: "Rented",
  },
];

const MOCK_CLIENTS = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "555-0101",
    totalRentals: 14,
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "555-0102",
    totalRentals: 5,
  },
  {
    id: 103,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "555-0103",
    totalRentals: 21,
  },
  {
    id: 104,
    name: "Diana Prince",
    email: "diana@example.com",
    phone: "555-0104",
    totalRentals: 8,
  },
  {
    id: 105,
    name: "Ethan Hunt",
    email: "ethan@example.com",
    phone: "555-0105",
    totalRentals: 3,
  },
  {
    id: 106,
    name: "Fiona Glenanne",
    email: "fiona@example.com",
    phone: "555-0106",
    totalRentals: 10,
  },
];

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

    return `
      <div class="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div class="flex justify-between items-center border-b border-gray-700 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-cyan-400">Settings</h2>
            <p class="text-gray-400 text-sm mt-1">Manage your account and system preferences</p>
          </div>
          <button id="save-settings-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-cyan-500/20 flex items-center">
            Save Changes
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
        title: "Total Cars",
        value: "...",
        description: "In Fleet",
        iconPath:
          "M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
        color: "cyan",
      },
      {
        title: "Total Clients",
        value: "...",
        description: "Registered Users",
        iconPath:
          "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
        color: "green",
      },
      {
        title: "Active Rentals",
        value: "...",
        description: "Currently on the road",
        iconPath:
          "M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        color: "amber",
      },
      {
        title: "Revenue This Year",
        value: "...",
        description: "Real-time earnings summary",
        iconPath:
          "M12 1v22M17 5H7c-2.2 0-4 1.8-4 4s1.8 4 4 4h10c2.2 0 4 1.8 4 4s-1.8 4-4 4H7",
        color: "rose",
      },
      {
        title: "Available Cars",
        value: "...",
        description: "Ready for booking",
        iconPath: "M22 11.08V12a10 10 0 1 1-5.93-8.5M22 4L12 14.01l-3-3",
        color: "teal",
      },
    ];
  }

  async fetchData() {
    try {
      const [cars, clients, rentals, revenue, available] = await Promise.all([
        getCarsCount(),
        getClientsCount(),
        getRentalsCount(),
        getRevenue(),
        getAvailableCars(),
      ]);

      this.kpis[0].value = cars;
      this.kpis[1].value = clients;
      this.kpis[2].value = rentals;
      this.kpis[3].value = `${Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(revenue)} €`;
      this.kpis[4].value = available;
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
                  <p class="text-sm font-medium text-gray-400 mb-1">${
                    kpi.title
                  }</p>
                  <div class="text-3xl font-bold text-gray-100">${
                    kpi.value
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
    return `<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            ${this.kpis.map((kpi) => this.renderCard(kpi)).join("")}
          </section>`;
  }
}

class TableManager {
  constructor() {
    this.tables = {}; // Stores state for multiple tables
  }

  registerTable(id, config) {
    this.tables[id] = {
      ...config,
      searchTerm: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
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

    let filteredData = table.data;
    if (table.searchTerm) {
      const lowerCaseSearch = table.searchTerm.toLowerCase();
      filteredData = table.data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

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
    table.currentPage = 1; // Reset to first page
    this.updateTableUI(id);
  }

  goToPage(id, pageNum) {
    const table = this.tables[id];
    if (!table) return;

    let filteredData = table.data;
    if (table.searchTerm) {
      const lowerCaseSearch = table.searchTerm.toLowerCase();
      filteredData = table.data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    const totalPages = Math.ceil(filteredData.length / table.itemsPerPage);

    if (pageNum >= 1 && pageNum <= totalPages) {
      table.currentPage = pageNum;
      this.updateTableUI(id);
    }
  }

  updateTableUI(id) {
    const table = this.tables[id];
    if (!table) return;

    let filteredData = table.data;
    if (table.searchTerm) {
      const lowerCaseSearch = table.searchTerm.toLowerCase();
      filteredData = table.data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    const totalPages = Math.ceil(filteredData.length / table.itemsPerPage);
    const startIndex = (table.currentPage - 1) * table.itemsPerPage;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + table.itemsPerPage
    );

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
          : '<tr><td colspan="10" class="text-center py-4">No data found.</td></tr>';
    }

    // Update pagination controls
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

  render(id, title, data, columns, renderRowContent, initialSortKey) {
    const settings = JSON.parse(localStorage.getItem("adminSettings")) || {};
    const isCompact = settings.compactView;
    const paddingClass = isCompact ? "px-6 py-2" : "px-6 py-4";

    if (!this.tables[id]) {
      this.registerTable(id, { data, renderRowContent });
    }

    setTimeout(() => this.updateTableUI(id), 0);

    return `
      <div class="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700/50">
        <h3 class="text-xl font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">${title}</h3>
        <div class="flex justify-between items-center mb-4">
          <input type="text" placeholder="Search..." oninput="window.app.tableManager.handleSearch('${id}', this.value)" class="w-64 p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-cyan-500" />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-400 ${
            isCompact ? "compact-table" : ""
          }">
            <thead class="text-xs text-gray-200 uppercase bg-gray-700/50">
              <tr>${columns
                .map((c) => `<th class="px-6 py-3">${c.label}</th>`)
                .join("")}</tr>
            </thead>
            <tbody id="${id}-tbody" class="${
      isCompact ? "text-xs" : "text-sm"
    }"></tbody>
          </table>
        </div>
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-400">
              <span id="${id}-page-info">Page 1 of 1</span>
            </div>
            <select onchange="window.app.tableManager.handleItemsPerPageChange('${id}', this.value)" class="px-3 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:ring-cyan-500 text-sm">
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button id="${id}-prev-btn" onclick="window.app.tableManager.handlePaginationClick('${id}', 'prev')" class="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
              ← Previous
            </button>
            <button id="${id}-next-btn" onclick="window.app.tableManager.handlePaginationClick('${id}', 'next')" class="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
              Next →
            </button>
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

  render() {
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
                 onclick="window.app.router.navigate('${item.route}')" title="${
      item.name
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

// --- CORE APP CLASS ---

class App {
  constructor() {
    // 1. Security Check First
    this.checkAuth();
    this.fleetData = [];
    this.clientsData = [];

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
  }

  // --- AUTHENTICATION & USER INFO ---

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
        alert("Session expired due to inactivity.");
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
    this.sidebar.render();
    this.renderContent();

    await Promise.all([this.kpiManager.fetchData(), this.fetchTableData()]);

    if (this.router.currentRoute === "dashboard") {
      this.renderContent();
    }
  }

  async fetchTableData() {
    try {
      const [clients, fleet] = await Promise.all([
        getClientsList(),
        getFleetList(),
      ]);

      this.clientsData = clients;
      this.fleetData = fleet;

      // 🔥 UPDATE TABLE DATA IF ALREADY REGISTERED
      if (this.tableManager.tables["clients-table"]) {
        this.tableManager.tables["clients-table"].data = this.clientsData;
        this.tableManager.updateTableUI("clients-table");
      }

      if (this.tableManager.tables["cars-table"]) {
        this.tableManager.tables["cars-table"].data = this.fleetData;
        this.tableManager.updateTableUI("cars-table");
      }
    } catch (err) {
      console.error("Failed to load table data", err);
    }
  }
  renderCarsTable() {
    // Map Database columns to Table columns
    // DB returns: status. Table expects: availability (or we change the key)
    const formattedData = this.fleetData.map((car) => ({
      ...car,
      availability: car.status.charAt(0).toUpperCase() + car.status.slice(1), // Capitalize 'available' -> 'Available'
    }));

    return this.tableManager.render(
      "cars-table",
      "Fleet Management (Real Data)",
      formattedData,
      [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "make", label: "Make" },
        { key: "price", label: "Price/day" },
        { key: "color", label: "Color" },
        { key: "status", label: "Status" }, // Add status column
      ],
      (car) => {
        // Dynamic Badge Color based on status
        let badgeColor = "bg-green-900/30 text-green-400";
        if (car.status === "rented")
          badgeColor = "bg-amber-900/30 text-amber-400";
        if (car.status === "maintenance")
          badgeColor = "bg-red-900/30 text-red-400";

        return `
        <td class="px-6 py-4 font-medium text-white">${car.vin}</td>
        <td class="px-6 py-4 font-medium text-white">${car.name}</td>
        <td class="px-6 py-4">${car.make}</td>
        <td class="px-6 py-4">$${car.price}</td>
        <td class="px-6 py-4">
          <span
            class="inline-block w-6 h-6 rounded-full border border-gray-300"
            style="background-color: ${car.color}"
          title="${car.color}"
          ></span>
        </td>
        <td class="px-6 py-4">
            <span class="px-2 py-1 rounded-full text-xs ${badgeColor}">
                ${car.status}
            </span>
        </td>
        `;
      },
      "id"
    );
  }

  renderClientsTable() {
    // Combine first_name and last_name for the table
    const formattedData = this.clientsData.map((c) => ({
      ...c,
      fullName: `${c.first_name} ${c.last_name}`,
    }));

    return this.tableManager.render(
      "clients-table",
      "Recent Clients (Real Data)",
      formattedData,
      [
        { key: "fullName", label: "Client Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
      ],
      (c) =>
        `<td class="px-6 py-4 font-medium text-white">${c.first_name} ${c.last_name}</td>
         <td class="px-6 py-4">${c.email}</td>
         <td class="px-6 py-4">${c.phone}</td>
         `,
      "id"
    );
  }

  renderContent() {
    const mainContentEl = document.getElementById("main-content");
    let contentHtml = "";

    switch (this.router.currentRoute) {
      case "cars":
        // Reuse the real data table
        contentHtml = `<div class="p-8">${this.renderCarsTable()}</div>`;
        break;

      case "clients":
        // Reuse the real data table
        contentHtml = `<div class="p-8">${this.renderClientsTable()}</div>`;
        break;

      case "rentals":
        contentHtml = `
          <div class="p-8">
            <h2 class="text-2xl font-bold mb-6 text-cyan-400">Rentals Management</h2>
            <div class="bg-gray-800 p-10 rounded-xl border border-dashed border-gray-600 text-center">
              <p class="text-gray-400">Rentals table coming soon...</p>
            </div>
          </div>`;
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
