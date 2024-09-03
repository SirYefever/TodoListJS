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

	remove(){
		todoList.splice(todoList.indexOf(this));
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
	let li = document.createElement("li");
	li.textContent = name;
	todoUL.appendChild(li);
}

let todoUL = document.getElementById("TodoUL");

let addButton = document.getElementById("addTodoButton");
addButton.addEventListener("click", () => addTodo());
