import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID}) { //{sID, message}
    console.log(sID);
    vm.socketID = sID;
}

function userNotification({message}){
    vm.notifications.push(message);
}

function appendMessage(message) {
    vm.messages.push(message);
}

// create Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        notifications: [],
        typing: false,
        messages: [],
        usercount: ""
    },
    watch: {
        message(value) {
          value ? socket.emit('typing', this.nickname) : socket.emit('stoptyping');
        }
      },
    created() {
        socket.on('typing', (data) => {
          this.typing = data || "Anonymous";
        });
        socket.on('stoptyping', () => {
          this.typing = false;
        });
        socket.on('usercount', (numUsers) => {
            this.usercount = numUsers;
          });
      },

    methods: {
        dispatchMessage() {
            // emit message event from the client side
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous"});

            // reset the message field
            this.message = "";

        },
        isTyping() {
            socket.emit('typing', this.nickname);
          }
    },
    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

socket.on('connected', logConnect);
socket.on('notification', userNotification);

socket.addEventListener('chat message', appendMessage);
