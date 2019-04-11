export default {
    props: ['msg'],

    template: `
        <p class="new-message" :class="{ 'my-message' : matchedID }">
            <span>{{msg.message.name}} says:</span>
            {{msg.message.content}}
        </p>
    `,
    mounted(){
        var body = document.querySelector("body");
        var p1s = document.querySelectorAll(".new-message");
        var count = 0;
        var waypoint = new Waypoint({
            element: body,
            handler: function(direction) {
            for (var i=0;i<p1s.length;i++){
                count = i;
            }
            TweenMax.from(p1s[count], 1, {y:100,opacity:0, ease:Power2.easeOut});
                this.destroy();
            },
            offset: 0
          });
    },
    data: function() {
        return {
            matchedID: this.$parent.socketID == this.msg.id
        }
    }
}