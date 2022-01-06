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
            showMore: true,
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
        addMore: function () {
            const latsImage = this.images[this.images.length - 1].id;
            console.log("This is my last image showing: ", latsImage);
            console.log("This is my lowestId: ", this.images);
            fetch(`/get-images-data/${latsImage}`)
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("What's the new data", this.images);
                    if (
                        data[data.length - 1].id ===
                        data[data.length - 1].lowestid
                    ) {
                        this.showMore = false;
                    }
                    this.images.push(...data);
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
