document.addEventListener('DOMContentLoaded', () => {
    console.log('Website is ready!');
});

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
	let name = "Todo № ".concat(todoIterator.toString());
	addTodo(name, false);
}

function addTodo(name, done){
	todoIterator++;
	todoCounter++;
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
	todoUL.insertAdjacentHTML("beforeend", li);
	updateProgressBar();
}

function redact(todoNumber) {
	let newName = window.prompt("Enter the name: ", "Todo".concat(todoIterator.toString()));
	let elementToRename = todoList.find((element) => element.number === todoNumber);
	elementToRename.redactName(newName);
	let spanElementToRename = document.getElementById("span" + todoNumber.toString());
	if (newName.length > 0) {
		spanElementToRename.textContent = newName;
	}
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
	updateProgressBar();
	todoUL.removeChild(document.getElementById("li" + todoNumber.toString()));
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
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
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
	let percentage = doneCounter / todoCounter;
	progressBar.value = percentage;
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

