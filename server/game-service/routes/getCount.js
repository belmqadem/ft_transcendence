export default  function getCount(req, reply, db) {
  return new Promise( (resolve, reject) => {
    const userName =  req.params.userName;

    const query = `
      SELECT
        COUNT(*) AS matches_played,
        SUM(CASE WHEN game_end_result = 'Won' THEN 1 ELSE 0 END) AS matches_won,
        SUM(CASE WHEN game_end_result = 'Lost' THEN 1 ELSE 0 END) AS matches_lost
      FROM games
      WHERE user_name = ?
    `;

    db.get(query, [userName], (err, row) => {
      if (err) {
        console.error("Error fetching data:", err.message);
        reply.status(500).send({ error: "Database error" });
        return reject(err);
      }

      reply.send(row); // directly send the result
      resolve(row);
    });
  });
}
