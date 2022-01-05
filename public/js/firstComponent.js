const firstComponent = {
    data() {
        return {
            heading: "This Is The Selected Picture",
            image: [],
            greetee: "",
            count: 1,
        };
    },
    props: ["imageId"],
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

                </div>`,
};

export default firstComponent;
