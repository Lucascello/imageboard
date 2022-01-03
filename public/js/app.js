import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
    mounted() {
        fetch("/get-images-data")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            });
    },
    methods: {},
}).mount("#main");
