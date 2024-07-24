document.addEventListener("DOMContentLoaded", () => {
	class Room {
		constructor(number, resident, status, amenities) {
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

	class RoomManager {
		constructor() {
			this.rooms = [];
			this.roomTableBody = document.getElementById("roomTableBody");
			this.filterForm = document.getElementById("filter-form");
			this.statusChart = null;

			this.filterForm.addEventListener("submit", (event) => {
				event.preventDefault();
				this.filterRooms();
			});

			this.fetchRooms();
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
						new Room(room.number, room.resident, room.status, room.amenities)
				);
				this.renderRooms(this.rooms);
				this.renderChart();
			} catch (error) {
				console.error("Error fetching rooms:", error);
			}
		}

		renderRooms(rooms) {
			this.roomTableBody.innerHTML = rooms
				.map((room) => room.render())
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
								"rgba(255, 159, 64, 0.2)",
								"rgba(255, 99, 132, 0.2)",
							],
							borderColor: [
								"rgba(75, 192, 192, 1)",
								"rgba(255, 159, 64, 1)",
								"rgba(255, 99, 132, 1)",
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

	const roomManager = new RoomManager();
});
