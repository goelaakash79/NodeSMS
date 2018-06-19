const numberInput = document.getElementById('number'),
      textInput = document.getElementById('msg'),
      button = document.getElementById('button'),
      response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function(data) {
  response.innerHTML = '<p>Text Message sent to ' + data.number + '</p>';
});

function send(){
  const number = numberInput.value.replace(/\D/g,''); // no numeric character
  const text = textInput.value;

  fetch('/',{
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({number: number, text: text})
  })
  .then(function(res) {
    console.log(res);
  })
  .catch(function(err) {
    console.log(err);
  });
}
