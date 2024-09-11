let todoList = [];
let todoIterator = 0;
let todoCounter = 0;
let doneCounter = 0;

class Todo {
	constructor(name, done) {
		this.name = name;
		this.number = todoIterator;
		this.done = done;
	}

	redactName(newName){
		if (!(newName === "")) {
			this.name = newName;
		}
	}
} 

function addTodoManually() {
	let name = "Todo № ".concat((todoIterator + 1).toString());
	addTodo(name, false);
}

function addTodo(name, done){
	todoIterator++;
	todoCounter++;
	if (document.getElementById("noTasksMessage") != null) {
		removeNoTasksMessage();
	}
	let todo = new Todo(name, done);
	todoList[todoList.length] = todo;
	let constructSpan = function() {
		return "<span id=\"span" + todoIterator.toString() + "\" class=\"spanCalss\">" + name + "</span>";
	}
	let constructDeleteButton = function() {
		return "<button id=\"deleteButton" + todoIterator.toString() +
					 "\" class=\"deleteButton\" onclick=\"remove(" + 
					 todoIterator.toString() + ")\">🗑️</button>";
	}
	let constructRedactButton = function() {
		return "<button id=\"redactButton" + todoIterator.toString() +
					 "\" class=\"redactButton\" onclick=\"redact(" + todoIterator.toString() + ")\">✏️</button>";
	}
	let constructCheckbox = function() {
		let result =  "<input id=\"checkbox" + todoIterator.toString() +
					 "\" type=\"checkbox\" class=\"checkBox\" onchange=\"manageCheckboxing(" + todoIterator + ")\"";
		if (done) { 
			result += " checked>";
			doneCounter++;
		} else {
			result += ">";
		}
		return result;
	}
	let constructLi = function() {
		return "<li class=\"liClass\" id=\"li" + todoIterator.toString() + "\">" + 
				  	constructCheckbox() + constructSpan() + 
				    constructRedactButton() + constructDeleteButton() + "</li>";
	}
	let li = constructLi();
	todoUL = document.getElementById("todoUL");
	todoUL.insertAdjacentHTML("beforeend", li);
	updateProgressBar();
}

function redact(todoNumber) {
	let elementToRename = todoList.find((element) => element.number === todoNumber);
	let newName = window.prompt("Enter the name: ", elementToRename.name);
	setTimeout(function() {
		elementToRename.redactName(newName);
		let spanElementToRename = document.getElementById("span" + todoNumber.toString());
		if (newName.length > 0) {
			spanElementToRename.textContent = newName;
		}
	}, 0); 
}

function manageCheckboxing(todoNumber) {
	for (let i = 0; i < todoList.length; i++){
		if (todoNumber === todoList[i].number) {
			todoList[i].done = !todoList[i].done;
		}
	}
	updateDoneCounter();
}

function updateDoneCounter() {
	doneCounter = 0;
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].done) {
			doneCounter++;
		}
	}
	updateProgressBar();
}

function remove(todoNumber) {
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].number === todoNumber) {
			doneCounter--;
			todoCounter--;
			todoList.splice(i, 1);
		}
	}
	updateDoneCounter();
	updateProgressBar();
	todoUL.removeChild(document.getElementById("li" + todoNumber.toString()));
	if (todoCounter === 0) {
		displayNoTasksMessage();
	}
}

function invokeImportWindow() {
	importInput.click();
}

function parseInputFile() {
	let reader = new FileReader();
	reader.readAsText(importInput.files[0]);
	reader.onload = function() {
		var todoArray = JSON.parse(reader.result);
		for (let i = 0; i < todoArray.length; i++) { 
			addTodo(todoArray[i].name, todoArray[i].done);
		}
	}
	updateProgressBar();
}

function exportJson() {
	download(JSON.stringify(todoList), "TodoList", "application/json");
}

//https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { 
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function updateProgressBar() {
	let progressBar = document.getElementById("progressBar");
	if (todoCounter === 0) {
		progressBar.value = 0;
		displayEncouragingMessage();
		return;
	}
	let percentage = doneCounter / todoCounter;
	progressBar.value = percentage;
	displayEncouragingMessage();
}

let todoUL = document.getElementById("todoUL");

let addButton = document.getElementById("addTodoButton");
addButton.addEventListener("click", () => addTodoManually());

let importInput = document.getElementById("importInputID");
importInput.addEventListener("change", () => {
	if (importInput.files.length > 0) {
		parseInputFile();
	}
})

function displayNoTasksMessage() {
	todoUL = document.getElementById("todoUL");
	ulDivForTasks = document.getElementById("todoListDiv");
	ulDivForTasks.removeChild(todoUL);
	const noTasksMessage = "<p id=\"noTasksMessage\">It's time to add some new tasks!</p>";
	ulDivForTasks.insertAdjacentHTML("beforeend", noTasksMessage);
}

function removeNoTasksMessage() {
	todoUL = document.getElementById("todoUL");
	ulDivForTasks = document.getElementById("todoListDiv");
	noTaskMessage = document.getElementById("noTasksMessage");
	ulDivForTasks.removeChild(noTaskMessage);
	const ulElement = "<ul id=\"todoUL\"></ul>";
	ulDivForTasks.insertAdjacentHTML("beforeend", ulElement);
}

function displayEncouragingMessage() {
	let messageContents;
	if (doneCounter === todoCounter && todoCounter != 0) {
		if (todoCounter < 4 && todoCounter > 1) {
			messageContents = "Good job completing " + todoCounter.toString() + " tasks!";
		} else {
			messageContents = "You've done all your tasks! Great job!";
		}
	}
	else if (doneCounter === Math.ceil(todoCounter / 2) && todoCounter != 0) {
		messageContents = "Half-way through! Keep it up!";
	}else {
		messageContents = "";
	}
	let message = "<p id=\"congratulationsMessage\">" + messageContents + "</p>";
	let messageElement = document.getElementById("encouragingMessage");
	messageElement.innerHTML = message;
}

let ulDivForTasks = document.getElementById("todoListDiv");
let noTaskMessage = document.getElementById("noTasksMessage");
