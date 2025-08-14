export async function getProfileById(db, id) {
  console.log("fetching profile by id...");
  return await db.get("SELECT * FROM profile WHERE userId = ?", [id]);
}

export async function searchProfile(db, id, username, email) {
  console.log("fetching profile...");
  return await db.get(
    "SELECT * FROM profile WHERE userId = ? OR username = ? OR email = ?",
    [id, username, email]
  );
}

export async function addProfile(db, id, username, email, avatar_url, gender) {
  let result;
  if (avatar_url) {
    result = await db.run(
      `INSERT INTO profile (userId, username, email, avatar_url, rank) VALUES (?, ?, ?, ?, 
        (SELECT COUNT(*) + 1 FROM profile WHERE profile.userId < ?))`,
      [id, username, email, avatar_url, id]
    );	
  } else {
    result = await db.run(
      `INSERT INTO profile (userId, username, email, gender, rank) VALUES (?, ?, ?, ?, 
        (SELECT COUNT(*) + 1 FROM profile WHERE profile.userId < ?))`,
      [id, username, email, gender, id]
    );
  }

  console.log("Profile inserted with ID:", result.lastID);
  return result.lastID;
}

export async function findDuplicateUsername(db, username) {
  console.log("Fetching duplicate username...");
  return await db.get("SELECT * FROM profile WHERE username = ?", [username]);
}

export async function findDuplicateEmail(db, email) {
  console.log("Fetching duplicate email...");
  return await db.get("SELECT * FROM profile WHERE email = ?", [email]);
}

export async function updateProfileById(db, id, updatedFields) {
  const setStatments = [];
  const values = [];

  for (const field in updatedFields) {
    setStatments.push(`${field} = ?`);
    values.push(updatedFields[field]);
  }

  const sql = `UPDATE profile SET ${setStatments.join(
    ", "
  )}, updated_at = DATETIME('now') WHERE userId = ?`;
  values.push(id);

  const result = await db.run(sql, values);

  return result.changes;
}

export async function updateAvatarUrlById(db, id, avatar_url) {
  await db.run(
    `UPDATE profile SET avatar_url = ?, updated_at = DATETIME('now') WHERE userId = ?`,
    [avatar_url, id]
  );
}

export async function updateProfileEmailById(db, id, email) {
  await db.run(
    `UPDATE profile SET email = ?, updated_at = DATETIME('now') WHERE userId = ?`,
    [email, id]
  );
}

export async function deleteProfile(db, id) {
  await db.run("DELETE FROM profile WHERE userId = ?", [id]);
}

export async function fetchAllProfiles(db) {
//   console.log("Fetching all profiles...");
  return await db.all("SELECT * FROM profile");
}


export async function updateRankById(db, userId, rank) {
  await db.run('UPDATE profile SET rank = ? WHERE userId = ?', 
    [
      rank,
      userId
    ]
  );
}