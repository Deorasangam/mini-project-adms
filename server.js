const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/seats", (req, res) => {
  const query = `
    SELECT * FROM seats
    WHERE status='AVAILABLE'`;

  db.query(query, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});
app.post("/book", (req, res) => {
  const { user_id, seat_id } = req.body;

  db.beginTransaction((err) => {
    if (err) throw err;

    const lockSeatQuery = `
        SELECT * FROM seats
        WHERE seat_id=?
        FOR UPDATE`;

    db.query(lockSeatQuery, [seat_id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.send("Lock Error");
        });
      }

      if (result.length === 0) {
        return db.rollback(() => {
          res.send("Seat Not Found");
        });
      }

      if (result[0].status === "BOOKED") {
        return db.rollback(() => {
          res.send("Seat Already Booked");
        });
      }
      const updateSeatQuery = `
            UPDATE seats
            SET status='BOOKED'
            WHERE seat_id=?`;

      db.query(updateSeatQuery, [seat_id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.send("Seat Update Failed");
          });
        }
        const bookingQuery = `
                INSERT INTO bookings
                (user_id,seat_id,status)
                VALUES (?,?,?)`;

        db.query(bookingQuery, [user_id, seat_id, "SUCCESS"], (err) => {
          if (err) {
            return db.rollback(() => {
              res.send("Booking Failed");
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.send("Commit Failed");
              });
            }

            res.send("Seat Booked Successfully");
          });
        });
      });
    });
  });
});
// ROLLBACK DEMO API
app.post("/payment-fail", (req, res) => {
  db.beginTransaction((err) => {
    if (err) throw err;

    const query = `
        UPDATE seats
        SET status='LOCKED'
        WHERE seat_id=1`;

    db.query(query, (err) => {
      if (err) {
        return db.rollback(() => {
          res.send("Error");
        });
      }
      // PAYMENT FAILED
      db.rollback(() => {
        res.send("Payment Failed Rollback Success");
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server Started on Port 3000");
});