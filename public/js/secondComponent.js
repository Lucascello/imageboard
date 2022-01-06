const secondComponent = {
    data() {
        return {
            heading: "Write A Comment",
            subheading: "See All Comments",
            comment: [],
            comment: "",
            username: "",
        };
    },
    props: ["imageId"],
    mounted() {
        // console.log("Second Component mounted");
        fetch(`/get-comment-info/${this.imageId}.json`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log("Whats's my data in the second component: ", data);
                this.comment = data;
            });
    },
    methods: {
        commentUpload() {
            fetch("/comments.json", {
                method: "POST",
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    img_id: this.imgId,
                }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(
                        "What's this.comment in fetch comments upload: ",
                        this.comment
                    );
                    this.comment.unshift(...data);
                    console.log("What's data now in comments upload: ", data);
                });
        },
    },
    template: `<div class="secondcomponent">
                <br><br>
                <h1>{{heading}}</h1>
                <br><br>
                <form>
            <input class="input" v-model="comment" type="text" name="comment" placeholder="Add Your Comment">
            <input class="input" v-model="username" type="text" name="username" placeholder="Username">
            <button @click.prevent="commentUpload">Submit</button>
        </form>

        <div>
        <br><br>
        <h2>{{subheading}}</h2>
        <div v-for="info in comments">
                    <h3> Comment - {{info.comment}}
                    <br><br>
                    </h3>
                    <h4> Written By {{info.username}} on {{info.created_at}} </h4>
                </div>
        </div>
    
    </div>`,
};

export default secondComponent;
