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

app.post("/comments.json", function (req, res) {
    const { img_id, username, comment } = req.body;

    db.addComments(img_id, username, comment)
        .then((data) => {
            console.log("These Are My Comment Rows: ", data.rows);
            res.json(data.rows);
        })
        .catch((error) => {
            console.log("Error In Adding Comments: ", error);
        });
});

app.get("/get-images-data", (req, res) => {
    db.selectImages()
        .then(({ rows }) => {
            console.log("imageData rows: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in selectImages: ", err);
        });
});

app.get("/get-images-data/:lowestId", (req, res) => {
    console.log("My req.params to get more images: ", req.params);

    db.selectMoreImages(req.params.lowestId)
        .then(({ rows }) => {
            console.log("imageData rows to add more images: ", rows);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in selectImages: ", err);
        });
});

app.get("/get-image-info/:imageId", (req, res) => {
    console.log("My req.params in image: ", req.params);

    db.getImageInfo(req.params.imageId)
        .then(({ rows }) => {
            console.log("imageInfo rows: ", rows);
            console.log(
                "This is the date in a better format: ",
                moment().format("MMMM Do YYYY, h:mm:ss a")
            );
            rows.forEach(function (row) {
                row.created_at = moment(row.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
                console.log("My updated Date: ", row.created_at);
            });
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in getImageInfo: ", err);
        });
});

app.get("/get-comment-info/:imageId.json", (req, res) => {
    console.log("My req.params in comments: ", req.params);

    db.selectComments(req.params.imageId)
        .then(({ rows }) => {
            console.log("Comment Info rows: ", rows);
            console.log(
                "This is the date for the comments in a better format: ",
                moment().format("MMMM Do YYYY, h:mm:ss a")
            );
            rows.forEach(function (row) {
                row.created_at = moment(row.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                );
                console.log(
                    "My updated Date in the comments: ",
                    row.created_at
                );
            });
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in selectComments: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
