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

	class RoomManager {
		constructor() {
			this.rooms = [];
			this.maintenanceRequests = [];
			this.roomTableBody = document.getElementById("roomTableBody");
			this.maintenanceTableBody = document.getElementById(
				"maintenanceTableBody"
			);
			this.filterForm = document.getElementById("filter-form");
			this.maintenanceFilterForm = document.getElementById(
				"maintenance-filter-form"
			);
			this.statusChart = null;

			this.filterForm.addEventListener("submit", (event) => {
				event.preventDefault();
				this.filterRooms();
			});

			this.maintenanceFilterForm.addEventListener("submit", (event) => {
				event.preventDefault();
				this.filterMaintenanceRequests();
			});

			this.fetchRooms();
			this.fetchMaintenanceRequests();
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
			this.renderChart(filteredRooms);
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

		renderChart(filteredRooms = this.rooms) {
			const statusCounts = filteredRooms.reduce((counts, room) => {
				counts[room.status] = (counts[room.status] || 0) + 1;
				return counts;
			}, {});

			const labels = Object.keys(statusCounts);
			const data = Object.values(statusCounts);

			if (this.statusChart) {
				this.statusChart.destroy();
			}

			const ctx = document.getElementById("statusChart").getContext("2d");
			this.statusChart = new Chart(ctx, {
				type: "bar",
				data: {
					labels: labels,
					datasets: [
						{
							label: "Room Status Distribution",
							data: data,
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
	}

	new RoomManager();
});
