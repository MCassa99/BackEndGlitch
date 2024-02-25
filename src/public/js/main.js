const socket = io();

const chatBox = document.getElementById('chatBox');
const chat = document.getElementById('messageLogs');
let user;

Swal.fire({
     title: 'Bienvenido!',
     input: 'text',
     text: 'Ingrese su nombre de usuario',
     inputPlaceholder: 'Nombre de usuario',
     inputValidator: (value) => {
          if (!value) {
               return 'Por favor, ingrese un nombre de usuario';
          }
     },
     allowOutsideClick: false,
     allowEscapeKey: false
}).then((result) => {
     user = result.value;
     console.log(user);
});

chatBox.addEventListener('change', () => {
     if (chatBox.value.trim().length > 0) {
          socket.emit('message', { user, msg: chatBox.value , time: new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})});
          chatBox.value = '';
     }
});

socket.on('messageLogs', (msgs) => {
     chat.innerHTML = '';
     msgs.forEach(msg => {
          chat.innerHTML += `<div class='message'><strong>${msg.user}:</strong> ${msg.msg} <p class='date'> ${msg.time} </p></div>`;
     });
});