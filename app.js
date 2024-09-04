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
	let li = "<li>" + name + "<button id=\"deleteButton" + todoCounter.toString() + "\" class=\"deleteButton\" onclick=\"remove(" + todoCounter.toString() + ")\">🗑️</button></li>";
	todoUL.insertAdjacentHTML("beforeend", li);
}

function remove(todoNumber) {
	todoList.splice(todoList.find((element) => element.number === todoNumber));
}
// Try to rewrite function so it adds "onclick" property to a button which would call remove(number) funciton.

function constructDeletionScript(todoCounter) {
	result = "<script>" +
					 "let indexToRemove = todoList.splice(todoList.find((element) => element.number === todoCounter));\n" +
					 "todoList.splice(something);\n" + 
				   "currentButton = document.getElementById(\"deleteButton" + todoCounter.toString() + "\");\n" +
					 "currentButton.parentNode.remove();\n" + 
					 "</script>"
	return result;
}

function test() {
	alert("TESING ALERT");
}

let todoUL = document.getElementById("todoUL");

let addButton = document.getElementById("addTodoButton");
addButton.addEventListener("click", () => addTodo());
