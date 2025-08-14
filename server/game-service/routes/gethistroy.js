

export default function getData(req, reply, db) {
  return new Promise( (resolve, reject) => {
    const query = "SELECT * FROM games ORDER BY id DESC LIMIT 10"; // Added ORDER BY

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err.message);
        reply.status(500).send({ error: "Database error" });
        return reject(err);
      }
      resolve(rows); // Now the route will return this
    });
  });
}