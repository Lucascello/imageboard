const express = require("express");

const app = express();

const db = require("./db");

const { uploader } = require("./upload");

const s3 = require("./s3");

const moment = require("moment");

app.use(express.static("./public"));

app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        console.log("This Is My File: ", req.file);
        console.log("This is my Requsted Body: ", req.body);

        const { username, title, description } = req.body;
        const url = `https://spicedling.s3.amazonaws.com/${req.file.filename}`;

        db.addImages(url, username, title, description)
            .then(({ rows }) => {
                res.json({ success: true, image: rows[0] });
            })
            .catch((error) => {
                console.log("Error In Adding Images: ", error);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

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

app.get("/get-image-info/:imageId", (req, res) => {
    console.log(req.params);

    const date = new Date();

    db.getImageInfo(req.params.imageId)
        .then(({ rows }) => {
            console.log("imageInfo rows: ", rows);
            moment(date).format("MMM Do YY");
            console.log(moment(date).format("MMM Do YY"));
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getImageInfo: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
