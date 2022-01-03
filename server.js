const express = require("express");

const app = express();

const db = require("./db");

app.use(express.static("./public"));

app.use(express.json());

app.get("/get-images-data", (req, res) => {
    db.selectImages()
        .then(({ rows }) => {
            console.log("image rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in selectImages: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
