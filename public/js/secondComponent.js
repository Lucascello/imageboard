const secondComponent = {
    data() {
        return {
            heading: "Write A Comment",
            subheading: "See All Comments",
            comments: [],
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
                this.comments = data;
            });
    },
    methods: {
        commentUpload() {
            fetch("/comments.json", {
                method: "POST",
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    img_id: this.imageId,
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
                    console.log(
                        "What's comments in fetch comments upload: ",
                        this.comments
                    );
                    this.comments.unshift(data.comment);
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
        <br>
        <div v-for="comment in comments">
                    <br>
                    <h3> Comment - {{comment.comment}}
                    </h4>
                    <h4> Written By {{comment.username}} on {{comment.created_at}} </h4>
                    <br>
                <hr>
                </div>
        </div>
    
    </div>`,
};

export default secondComponent;
