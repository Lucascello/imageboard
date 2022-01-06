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
                RETURNING url, username, title, description, id`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.addComments = (img_id, username, comment) => {
    const q = `INSERT INTO comments (img_id, username, comment)
                VALUES ($1, $2, $3)
                RETURNING img_id, username, comment, id, created_at`;
    const params = [img_id, username, comment];
    return db.query(q, params);
};

module.exports.selectImages = () => {
    const q = "SELECT * FROM images ORDER BY id DESC LIMIT 3";
    return db.query(q);
};

module.exports.selectComments = (img_id) => {
    const q = `SELECT * FROM comments WHERE img_id = $1 ORDER BY id desc`;
    return db.query(q, [img_id]);
};

module.exports.getImageInfo = (id) => {
    const q = "SELECT * FROM images WHERE id=$1";
    return db.query(q, [id]);
};

module.exports.getComments = (img_id) => {
    const q = "SELECT * FROM comments WHERE img_id=$1";
    return db.query(q, [img_id]);
};

module.exports.selectMoreImages = (lowestId) => {
    const q = `SELECT url, title, id, (SELECT id
    FROM images
    ORDER BY id ASC
    LIMIT 1) AS lowestId FROM images
    WHERE id < $1
    ORDER BY id DESC
    LIMIT 3`;
    return db.query(q, [lowestId]);
};
