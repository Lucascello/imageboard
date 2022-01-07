import secondComponent from "./secondComponent.js";

const firstComponent = {
    data() {
        return {
            heading: "This Is The Selected Picture",
            image: [],
        };
    },
    props: ["imageId"],
    components: {
        "second-component": secondComponent,
    },
    mounted() {
        fetch(`/get-image-info/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Whats's my data in the component: ", data[0]);
                this.image = data[0];
            });
    },
    methods: {
        notifyParent() {
            console.log("Parent Should Do Something");
            this.$emit("close");
        },
        commentUpload() {},
    },
    template: `<div class="heading-display">
                    <img class="insidepic" :src="image.url"> 
                    <figcaption class="figcap"> Title - {{image.title}} </figcaption>
                    <br><br>
                    <h3> Description - {{image.description}}
                    <br><br>
                    </h3>
                    <h4>Uploaded By {{image.username}} on {{image.created_at}} </h4>
                    <br><br>
                    <button @click="notifyParent" class="close"> Return To Pics</button>
                    
                    <second-component :image-id="imageId"></second-component>

                </div>`,
};

export default firstComponent;
