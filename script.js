// LOAD AVAILABLE SEATS

async function loadSeats() {
  try {
    const response = await fetch("http://localhost:3000/seats");

    const data = await response.json();

    let output = "";

    data.forEach((seat) => {
      output += `

            <div class="seat available">

                <span>
                    Seat : ${seat.seat_number}
                </span>

                <span>
                    ${seat.status}
                </span>

            </div>

            `;
    });

    if (data.length === 0) {
      output = `
            <div class="seat booked">
                No Seats Available
            </div>
            `;
    }

    document.getElementById("seatList").innerHTML = output;
  } catch (error) {
    console.log(error);

    alert("Server Error");
  }
}

// BOOK SEAT

async function bookSeat() {
  const user_id = document.getElementById("userId").value;

  const seat_id = document.getElementById("seatId").value;

  // VALIDATION

  if (user_id === "" || seat_id === "") {
    alert("Please Enter All Fields");

    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/book",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          user_id,
          seat_id,
        }),
      }
    );

    const data = await response.text();

     alert(data);

    // CLEAR INPUTS

    document.getElementById("userId").value = "";

    document.getElementById("seatId").value = "";

    // RELOAD SEATS

    loadSeats();
  } catch (error) {
    console.log(error);

    alert("Booking Failed");
  }
}

// AUTO LOAD SEATS

loadSeats();

// AUTO REFRESH EVERY 5 SECONDS

setInterval(() => {
  loadSeats();
}, 5000);
