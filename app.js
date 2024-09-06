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
		if (!newName === "") {
			this.name = newName;
		}
	}
} 

function addTodoManually() {
	// window.promt is not available in Node.js so for now we'll keep it simple way
	let name = "Todo ".concat(todoIterator.toString());
	//let name = window.promt("Enter the name: ", "Todo".concat(toStirng(todoIterator)));
	addTodo(name, false);
}

function addTodo(name, done){
	todoIterator++;
	todoCounter++;
	// window.promt is not available in Node.js so for now we'll keep it simple way
	let todo = new Todo(name, done);
	todoList[todoList.length] = todo;
	//<li id="li1">
	//<span id="span1">Todo 0</span>
	//<button id="deleteButton1" class="deleteButton" onclick="remove(1)">🗑️</button>
	//<button id="redactButton1" class="redactButton" onclick="redact(1)">✏️</button>
	//<input id="checkbox1" type="checkbox" class="checkBox" onchange="updateDoneCounter()">
	//</li>
	let constructSpan = function() {
		return "<span id=\"span" + todoIterator.toString() + "\">" + name + "</span>";
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
					 "\" type=\"checkbox\" class=\"checkBox\" onchange=\"updateDoneCounter()\"";
		if (done) { 
			result += " checked>";
			doneCounter++;
		} else {
			result += ">";
		}
		return result;
	}
	let constructLi = function() {
		return "<li id=\"li" + todoIterator.toString() + "\">" + constructSpan() + 
					 constructDeleteButton() + constructRedactButton() + constructCheckbox() +
				   "</li>";
	}
	let li = constructLi();
	todoUL.insertAdjacentHTML("beforeend", li);
}

function redact(todoNumber) {
	//let newName = window.promt("Enter the name: ", "Todo".concat(toStirng(todoIterator)));
	let newName = "testing";
	let elementToRename = todoList.find((element) => element.number === todoNumber);
	elementToRename.redactName(newName);
	let spanElementToRename = document.getElementById("span" + todoNumber.toString());
	spanElementToRename.textContent = newName;
}

function updateDoneCounter() {
	doneCounter = 0;
	for (let i = 1; i < todoIterator; i++) {
		if (document.getElementById("checkbox" + i.toString())) {
			doneCounter++;
		}
	}
}

function remove(todoNumber) {
	for (let i = 0; i < todoList.length; i++) {
		if (todoList[i].number === todoNumber) {
			doneCounter--;
			todoCounter--;
			todoList.splice(i, 1);
		}
	}
	todoUL.removeChild(document.getElementById("li" + todoNumber.toString()));
}

function invokeImportWindow() {
	importInput.click();
}

function parseInputFile() {
	let reader = new FileReader();
	reader.readAsText(importInput.files[0]);
	reader.onload = function() {
		var todoArray = JSON.parse(reader.result).todos;
		for (let i = 0; i < todoArray.length; i++) { 
			addTodo(todoArray[i].name, todoArray[i].done);
			todoIterator++;
			todoCounter++;
		}
	}
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

// To export we need:
//	 1. Create .json file;
//	 2. Fill .json file with info;
//	 3. Save .json file on computer.
function exportJson() {
	download(JSON.stringify(todoList), "testing", "application/json");
}

//https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
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

