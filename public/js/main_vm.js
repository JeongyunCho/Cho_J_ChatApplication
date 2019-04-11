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
        messages: [],
        typing: false,
        usercount: "",
        toggleTheme: false
    },
    watch: {
        message(line) {
            if(line){
                socket.emit('typing', this.nickname);
            }else{
                socket.emit('stoptyping');
            }
        }
      },
    created() {
        socket.on('typing', (name) => {
          this.typing = name || "Anonymous";
        });
        socket.on('stoptyping', () => {
          this.typing = false;
        });
        socket.on('usercount', (numUsers) => {
            this.usercount = numUsers;
          });
      },
      mounted() {
        var button = document.querySelector('#darkmode');
        button.addEventListener('click', function () {
            
        if (this.toggleTheme === false) {
            this.toggleTheme = true;
            document.querySelector("body").classList.add('dark-theme');
            document.querySelector("#light").src="/images/sunny.svg";
        }else{
            this.toggleTheme = false;
            document.querySelector("body").classList.remove('dark-theme');
            document.querySelector("#light").src="/images/moon.svg";
        }
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
        },
        
    },
    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

socket.on('connected', logConnect);
socket.on('notification', userNotification);
socket.addEventListener('chat message', appendMessage);
