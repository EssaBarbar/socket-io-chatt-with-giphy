//make connection
//just the socket for the front end not to mix in with the other.
const socket = io.connect('http://localhost:3000');

availebeCommands = ["gif", "etc"]

//Query DOM
const message = document.getElementById('message')
const nameOfThePerson = document.getElementById('nameOfThePerson')
const sendButton = document.getElementById('send')
const output = document.getElementById('output');
const feedback = document.getElementById('feedback');
let commandsButtons = document.getElementById('commandsButtons');

//Emit event when someone click send. When someone click send, we fire back a function.

sendButton.addEventListener('click', function () {
    socket.emit('chat', {
        message: message.value,
        nameOfThePerson: nameOfThePerson.value
    });
    message.value = "";
});

message.addEventListener('keypress', function () {
    socket.emit('typing', nameOfThePerson.value);
})

message.addEventListener("input", (event) => {
    commandsButtons.innerHTML = ""
    console.log(event)
    if (message.value == "/") {
        listCommands()
    }
    else if (message.value.startsWith("/gif")) {
        const searchWord = message.value.substring(5)
        doGiphyFetch(searchWord)
    }
});

// listens when someone is typing message.

//Listen for events
socket.on('chat', function (data) {
    if (data.type == "img") {
        feedback.innerHTML = "";
        output.innerHTML += '<p><strong>' + data.nameOfThePerson + ': </strong></p><img class="gif2" src="' +
            data.message + '"/>';
    } else {
        feedback.innerHTML = "";
        output.innerHTML += '<p><strong>' + data.nameOfThePerson + ': </strong>' + data.message + '</p>';
    }
});

socket.on('typing', function (data) {
    feedback.innerHTML = '<p><em>' + data + ' skriver...</em></p>';
});

function listCommands() {
    commandsButtons.innerHTML = ""
    availebeCommands.forEach(command => {
        let triggedCommand = document.createElement("button")
        triggedCommand.innerText = command + " [Your search word for the gif]"
        commandsButtons.appendChild(triggedCommand)
        triggedCommand.onclick = function () {
            message.value = "/" + command + " "
            commandsButtons.innerHTML = ""
        }
    });
}
async function doGiphyFetch(searchWord) {

    let apiKey = "q7ItJUQNFTI0rmImSi6qBytYEn0GxBGF"
    let giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + searchWord + "&api_key=" + apiKey + "&limit=4"
    let response = await fetch(giphyUrl)
    let result = await response.json()

    commandsButtons.innerHTML = ""
    result.data.forEach(object => {
        let newGifUrl = object.images.original.url
        let img = new Image()
        img.src = newGifUrl
        img.style.width = "170px"
        img.style.height = "170px"
        img.style.objectFit = "cover"
        img.onclick = function sendThisAsMsg() {
            socket.emit('chat', {
                message: newGifUrl,
                type: "img",
                nameOfThePerson: nameOfThePerson.value
            });
            message.value = "";
            commandsButtons.innerHTML = ""
        }
        commandsButtons.appendChild(img)
    });
}