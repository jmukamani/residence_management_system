document.addEventListener("DOMContentLoaded", () => {
	class Room {
		constructor(id, number, resident, status, amenities) {
			this.id = id;
			this.number = number;
			this.resident = resident;
			this.status = status;
			this.amenities = amenities;
		}

		render() {
			return `
                <tr>
                    <td>${this.number}</td>
                    <td>${this.resident}</td>
                    <td>${this.status}</td>
                    <td>${this.amenities.join(", ")}</td>
                </tr>
            `;
		}
	}

	class MaintenanceRequest {
		constructor(id, roomNumber, issue, status, notes) {
			this.id = id;
			this.roomNumber = roomNumber;
			this.issue = issue;
			this.status = status;
			this.notes = notes;
		}

		render() {
			return `
                <tr>
                    <td>${this.roomNumber}</td>
                    <td>${this.issue}</td>
                    <td>${this.status}</td>
                    <td>${this.notes}</td>
                </tr>
            `;
		}
	}

	class Alert {
		constructor(id, message, type, date) {
			this.id = id;
			this.message = message;
			this.type = type;
			this.date = date;
		}

		render() {
			const alertClass =
				this.type === "urgent"
					? "list-group-item-danger"
					: "list-group-item-warning";
			return `
                <li class="list-group-item ${alertClass}">
                    <strong>${this.date}:</strong> ${this.message}
                </li>
            `;
		}
	}

	class RoomManager {
		constructor() {
			this.rooms = [];
			this.maintenanceRequests = [];
			this.alerts = [];
			this.roomTableBody = document.getElementById("roomTableBody");
			this.maintenanceTableBody = document.getElementById(
				"maintenanceTableBody"
			);
			this.alertsList = document.getElementById("alertsList");
			this.filterForm = document.getElementById("filter-form");
			this.maintenanceFilterForm = document.getElementById(
				"maintenance-filter-form"
			);
			this.themeToggle = document.getElementById("themeToggle");
			this.statusChart = null;

			this.filterForm.addEventListener("submit", (event) => {
				event.preventDefault();
				this.filterRooms();
			});

			this.maintenanceFilterForm.addEventListener("submit", (event) => {
				event.preventDefault();
				this.filterMaintenanceRequests();
			});

			this.themeToggle.addEventListener("click", () => {
				this.toggleTheme(!document.body.classList.contains("dark-theme"));
			});

			this.fetchRooms();
			this.fetchMaintenanceRequests();
			this.fetchAlerts();
			this.loadTheme();
		}

		async fetchRooms() {
			try {
				const response = await $.ajax({
					url: "http://localhost:3000/rooms",
					method: "GET",
					dataType: "json",
				});

				this.rooms = response.map(
					(room) =>
						new Room(
							room.id,
							room.number,
							room.resident,
							room.status,
							room.amenities
						)
				);
				this.renderRooms(this.rooms);
				this.renderChart();
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		}

		async fetchMaintenanceRequests() {
			try {
				const response = await $.ajax({
					url: "http://localhost:3000/maintenanceRequests",
					method: "GET",
					dataType: "json",
				});

				this.maintenanceRequests = response.map(
					(request) =>
						new MaintenanceRequest(
							request.id,
							request.roomNumber,
							request.issue,
							request.status,
							request.notes
						)
				);
				this.renderMaintenanceRequests(this.maintenanceRequests);
			} catch (error) {
				console.error("Error fetching maintenance requests:", error);
			}
		}

		async fetchAlerts() {
			try {
				const response = await $.ajax({
					url: "http://localhost:3000/alerts",
					method: "GET",
					dataType: "json",
				});

				this.alerts = response.map(
					(alert) => new Alert(alert.id, alert.message, alert.type, alert.date)
				);
				this.renderAlerts(this.alerts);
			} catch (error) {
				console.error("Error fetching alerts:", error);
			}
		}

		renderRooms(rooms) {
			this.roomTableBody.innerHTML = rooms
				.map((room) => room.render())
				.join("");
		}

		renderMaintenanceRequests(requests) {
			this.maintenanceTableBody.innerHTML = requests
				.map((request) => request.render())
				.join("");
		}

		renderAlerts(alerts) {
			this.alertsList.innerHTML = alerts
				.map((alert) => alert.render())
				.join("");
		}

		filterRooms() {
			const status = document.getElementById("roomStatus").value;
			const amenities = document.getElementById("amenities").value;

			let filteredRooms = this.rooms;

			if (status) {
				filteredRooms = filteredRooms.filter((room) => room.status === status);
			}

			if (amenities) {
				filteredRooms = filteredRooms.filter((room) =>
					room.amenities.includes(amenities)
				);
			}

			this.renderRooms(filteredRooms);
		}

		filterMaintenanceRequests() {
			const status = document.getElementById("requestStatus").value;
			const roomNumber = document.getElementById("requestRoomNumber").value;

			let filteredRequests = this.maintenanceRequests;

			if (status) {
				filteredRequests = filteredRequests.filter(
					(request) => request.status === status
				);
			}

			if (roomNumber) {
				filteredRequests = filteredRequests.filter(
					(request) => request.roomNumber === roomNumber
				);
			}

			this.renderMaintenanceRequests(filteredRequests);
		}

		renderChart() {
			const statusCounts = {
				occupied: 0,
				vacant: 0,
				maintenance: 0,
			};

			this.rooms.forEach((room) => {
				if (room.status === "occupied") {
					statusCounts.occupied++;
				} else if (room.status === "vacant") {
					statusCounts.vacant++;
				} else if (room.status === "maintenance") {
					statusCounts.maintenance++;
				}
			});

			const ctx = document.getElementById("statusChart").getContext("2d");
			if (this.statusChart) {
				this.statusChart.destroy();
			}
			this.statusChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: ["Occupied", "Vacant", "Under Maintenance"],
					datasets: [
						{
							label: "Room Status",
							data: [
								statusCounts.occupied,
								statusCounts.vacant,
								statusCounts.maintenance,
							],
							backgroundColor: [
								"rgba(75, 192, 192, 0.2)",
								"rgba(255, 99, 132, 0.2)",
								"rgba(255, 206, 86, 0.2)",
							],
							borderColor: [
								"rgba(75, 192, 192, 1)",
								"rgba(255, 99, 132, 1)",
								"rgba(255, 206, 86, 1)",
							],
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		}

		toggleTheme(isDark) {
			document.body.classList.toggle("dark-theme", isDark);
			localStorage.setItem("theme", isDark ? "dark" : "light");
			this.themeToggle.setAttribute(
				"aria-label",
				`Switch to ${isDark ? "light" : "dark"} theme`
			);
			this.themeToggle.checked = isDark;
		}

		loadTheme() {
			const prefersDarkScheme = window.matchMedia(
				"(prefers-color-scheme: dark)"
			);
			const savedTheme = localStorage.getItem("theme");
			const isDark =
				savedTheme === "dark" ||
				(savedTheme === null && prefersDarkScheme.matches);
			this.toggleTheme(isDark);

			prefersDarkScheme.addListener((e) => {
				if (localStorage.getItem("theme") === null) {
					this.toggleTheme(e.matches);
				}
			});
		}
	}

	new RoomManager();
});
