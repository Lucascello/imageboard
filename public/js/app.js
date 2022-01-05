import * as Vue from "./vue.js";

import firstComponent from "./firstComponent.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageSelected: false,
        };
    },
    mounted() {
        fetch("/get-images-data")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            });
    },
    components: {
        "first-component": firstComponent,
    },
    methods: {
        clickHandler: function () {
            const fd = new FormData();
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            fd.append("file", this.file);
            this.title = "";
            this.description = "";
            this.username = "";
            this.$refs.upload.value = null;
            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((result) => {
                    console.log("result: ", result);
                    this.images.unshift(result.image);
                })
                .catch((err) => {
                    console.log("error uploading new image: ", err);
                });
        },
        fileSelectHandler: function (e) {
            this.file = e.target.files[0];
        },
        selectImage(clickedImage) {
            console.log("User Clicked On A Image: ", clickedImage);
            console.log("************");
            console.log("What's this in selectImage:", this);
            console.log("************");
            console.log("What's event.target: ", event.target);
            this.imageSelected = clickedImage;
        },
        closeTemplate: function () {
            this.imageSelected = false;
        },
    },
}).mount("#main");
