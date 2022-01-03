const spicedPg = require("spiced-pg");
const database = "imageboard";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);
console.log(`[db] connecting to:${database}`);

module.exports.addImages = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
                VALUES ($1, $2, $3, $4)
                RETURNING id`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.selectImages = () => {
    const q = "SELECT * FROM images";
    return db.query(q);
};
