document.addEventListener('DOMContentLoaded', () => {
    console.log('Website is ready!');
});

let todoList = [];
let todoCounter = 0;
let doneCounter = 0;

class Todo {
	constructor(name, done) {
		this.name = name;
		this.number = todoCounter;
		this.done = false;
	}
	
	add(){
	}

	
	getDone(){
		this.done = true;
		doneCounter++;
		// Update the progress bar
	}

	getUndone(){
		this.done = false;
		doneCounter--;
		// Update the progress bar
	}

	redact(newName){
		this.name = newName;
	}
} 

function addTodo(){
	todoCounter += 1;
	// window.promt is not available in Node.js so for now we'll keep it simple way
	let name = "Todo ".concat(todoCounter.toString());
	//let name = window.promt("Enter the name: ", "Todo".concat(toStirng(todoCounter)));
	let todo = new Todo(name, todoCounter);
	todoList[todoList.length] = todo;
	let li = "<li id=\"li" + todoCounter.toString() + "\"><span id=\"span" + todoCounter.toString() + "\">" +
				   name + "</span><button id=\"deleteButton" + todoCounter.toString() +
					 "\" class=\"deleteButton\" onclick=\"remove(" + 
					 todoCounter.toString() + ")\">🗑️</button><button id=\"redactButton" + todoCounter.toString() + "\" class=\"redactButton\" onclick=\"redact(" + todoCounter.toString() + ")\">✏️</button><input id=\"checkbox" +
				   todoCounter.toString() +"\" type=\"checkbox\"";
	//if (checked)
	//li += "checked";
	//doneCounter++;
	//else
	//li += ""
	// Class atribute does not word fsr
	li = li.concat(" class=\"checkBox\" onchange=\"updateDoneCounter()\"/></li>");
	todoUL.insertAdjacentHTML("beforeend", li);
}

function redact(todoNumber) {
	//let newName = window.promt("Enter the name: ", "Todo".concat(toStirng(todoCounter)));
	let newName = "testing";
	let elementToRename = todoList.find((element) => element.number === todoNumber);
	elementToRename.name = newName;
	let spanElementToRename = document.getElementById("span" + todoNumber.toString());
	spanElementToRename.textContent = newName;
}

function updateDoneCounter() {
	doneCounter = 0;
	for (let i = 1; i < todoCounter; i++) {
		if (document.getElementById("checkbox" + i.toString())) {
			doneCounter++;
		}
	}
}

function remove(todoNumber) {
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].number === todoNumber) {
			todoList.splice(i, 1);
		}
	}
	todoUL.removeChild(document.getElementById("li" + todoNumber.toString()));
}

let todoUL = document.getElementById("todoUL");

let addButton = document.getElementById("addTodoButton");
addButton.addEventListener("click", () => addTodo());

let importInput = document.getElementById("importInputID");
function readFile(event) { 
	//console.log(event.target.result);
	console.log("readFile() running");
}
function previewFile() {
	console.log("previewFile() running");
	var file = importInput.files[0];
	console.log("typeof file is ".concat(typeof file));
	var reader = new FileReader();
	reader.addEventListener('load', readFile);
	reader.readAsText(file);
	console.log(reader.result);
	var obj = JSON.parse(reader.result);
	console.log(obj);
	debugger;
}
importInput.addEventListener('change', previewFile);

function invokeImportWindow() {
	document.getElementById("importInputID").click();
	previewFile();
}
