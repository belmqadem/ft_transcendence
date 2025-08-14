

export default function getLastMatchByUser(req, reply, db){
  return new Promise( (resolve, reject) => {
    const userName = req.params.userName; // Assuming playerId is passed as a parameter
    const query = `
        SELECT * FROM games
        WHERE user_name = ?
        ORDER BY created_at DESC
        LIMIT 1
    `; // Added ORDER BY

	db.all(query, [userName], (err, rows) => {
      if (err) {
        console.error("Error fetching data:", err.message);
        reply.status(500).send({ error: "Database error" });
        return reject(err);
      }
      console.log(rows);
      resolve(rows); // Now the route will return this
    });
  });
 }