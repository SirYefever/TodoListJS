let todoList = [];
let todoIterator = 0;
let doneCounter = 0;

async function addTodoManually() {
	let name = "Todo № ".concat((todoIterator + 1).toString());
//await postTodo({
//	name: name,
//	isComplete: false
//}, name, false);
	await addItem(name, false)
	getTodoListFromDb();
}

async function getTodoListFromDb() {
	todoIterator = 0;
	let url = "http://localhost:5260/GetTodoList";
	let response = await fetch(url);
	if (response.ok) {
		let json = await response.json();
		clearPage();
		json.forEach(element => {
			displayTodo(element);
		});
		await updateDoneCounter();
	} else {
		alert("Ошибка HTTP: " + response.status);
	}
}

async function addItem(name, isComplete) {
	const url = "http://localhost:5260/AddTodo";

	const data = {
		name: name,
		isComplete: isComplete
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

	} catch (error) {
		console.error('Error adding item:', error);
		throw error;
	}
}

async function postTodo(data, name, isComplete) {
	const baseUrl = "http://localhost:5260/AddTodo?"
	const encodedObj = turnIntoQueryString(data)
	const queryWithEncodedUri = baseUrl + encodedObj
	console.log("fixedEncodedUriComponen:   " + queryWithEncodedUri)
	//const params = new URLSearchParams(data).toString();
	//console.log(params);
	//const encodedParams = encodeURIComponent(params)
	//const fullUrl = 'http://localhost:5260/AddTodo?' + encodedParams;
	try {
		//		const response = await fetch(new URLSearchParams(queryWithEncodedUri));
		const response = await fetch('http://localhost:5260/AddTodo', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
				//'Content-Type': 'application/json'
			},
			body: queryWithEncodedUri
		});
		let result = await response.json();
	}
	catch(error) {
		console.error("Error: ", error);
	}
}

function displayTodo(todo) {
	todoIterator++;
	if (document.getElementById("noTasksMessage") != null) {
		removeNoTasksMessage();
	}
	todoList[todoList.length] = todo;

	let constructSpan = function() {
		return "<span id=\"span" + todo.id + "\" class=\"spanCalss\">" + todo.name + "</span>";
	}
	let constructDeleteButton = function() { return "<button id=\"deleteButton" + todo.id.toString() +
		"\" class=\"deleteButton\" onclick=\"remove(" + 
		todo.id.toString() + ")\">🗑️</button>";
	}
	let constructRedactButton = function() {
		return "<button id=\"redactButton" + todo.id +
			"\" class=\"redactButton\" onclick=\"redact(" + todo.id + ")\">✏️</button>";
	}
	let constructCheckbox = function() {
		let result =  "<input id=\"checkbox" + todo.id.toString() +
			"\" type=\"checkbox\" class=\"checkBox\" onchange=\"manageCheckboxing(" + todo.id + ")\"";
		if (todo.isComplete) { 
			result += " checked>";
		} else {
			result += ">";
		}
		return result;
	}
	let constructLi = function() {
		return "<li class=\"liClass\" id=\"li" + todo.id.toString() + "\">" + 
			constructCheckbox() + constructSpan() + 
			constructRedactButton() + constructDeleteButton() + "</li>";
	}
	let li = constructLi();
	todoUL = document.getElementById("todoUL");
	todoUL.insertAdjacentHTML("beforeend", li);
}


async function redact(todoNumber) {
	//TODO change behaviour when redaction get canceled
	var elementToRename = todoList.find((element) => element.id === todoNumber);
	var newName = window.prompt("Enter the name: ", elementToRename.name);
	setTimeout(function() {
		elementToRename.name = newName;
		let spanElementToRename = document.getElementById("span" + todoNumber);
		if (newName.length > 0) {
			spanElementToRename.textContent = newName;
		}
	}, 0); 
	/////////////////////////////////////////////
	//const params = new URLSearchParams();
	//  params.append('id', todoNumber);
	//  params.append('newName', newName);
	//let data = {
	//	id: todoNumber,
	//	newName: newName
	//}
	//const params = new URLSearchParams(data).toString();
	//console.log(params);
	//
	//let url = 'http://localhost:5260/ChangeTodoName/' + todoNumber.toString();
	//try {
	//	const response = await fetch(url, {
	//		method: "PUT", // Specify the method
	//		headers: {
	//			"Content-Type": "application/json" // Set content type for form data
	//		},
	//		body: JSON.stringify(data)
	//	});
	//}
	//catch(error){
	//	console.error("Error: ", error);
	//}
	/////////////////////////////////////////////
	let data = {
		name: newName,
		isComplete: elementToRename.isComplete
	}
	try {
		await fetch('http://localhost:5260/ChangeTodoName/' + todoNumber.toString() , {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	}
	catch(error) {
		console.error("Error: ", error);
	}
}

async function manageCheckboxing(id) {
	try {
		let url = "http://localhost:5260/ChangeCompleteStatus/" + id;
		await fetch(url, {
			method: 'PUT'
		});
		getTodoListFromDb();
	}
	catch(error){
		console.error(error);
	}
}

async function getTodoCounter() {
	let url = "http://localhost:5260/GetTodoCounter";
	let response = await fetch(url);

	if (response.ok) {
		let json = await response.json();
		return json;
	}
}

async function updateDoneCounter() {
	let url = "http://localhost:5260/GetDoneCounter";
	let response = await fetch(url);

	if (response.ok) {
		let json = await response.json();
		doneCounter = json;
		updateProgressBar();
	}
}

async function remove(id) {
	try {
		await fetch('http://localhost:5260/DeleteTodo/' + id, {
			method: 'DELETE'
		});
		getTodoListFromDb();
	}
	catch(error) {
		console.error("Error: ", error);
	}
	try {
		await updateDoneCounter();
	}
	catch(error) {
		console.error("Error: ", error);
	}
	let todoCounter = await getTodoCounter();
	if (todoCounter === 0) {
		displayNoTasksMessage();
	}
}

function invokeImportWindow() {
	getTodoListFromDb();
}

async function updateProgressBar() {
	let progressBar = document.getElementById("progressBar");
	let todoCounter = await getTodoCounter();
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

async function displayEncouragingMessage() {
	let messageContents;
	var todoCounter = await getTodoCounter();
	if (doneCounter === todoCounter && todoCounter != 0) {
		if (todoCounter < 4 && todoCounter > 1) {
			messageContents = "Good job completing " + todoCounter.toString() + " tasks!";
		} else if (todoCounter === 1) {
			messageContents = "Done in one!";
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

async function clearPage(){
	todoUL.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function() {
	invokeImportWindow();
});

let ulDivForTasks = document.getElementById("todoListDiv");
let noTaskMessage = document.getElementById("noTasksMessage");
