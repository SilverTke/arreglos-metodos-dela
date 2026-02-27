// @unocss-include
import "./style.css";
import "virtual:uno.css";

/** @type {HTMLTableElement} */
const taskTable = document.querySelector("#taskTable");

/** @type {HTMLButtonElement}*/
const todoButton = document.querySelector("#todoInsertButton");
/** @type {HTMLInputElement} */
const todoField = document.querySelector("#todoInsertName");

const totalTasksSpan = document.querySelector("#totalTasks");
const doneTasksSpan = document.querySelector("#doneTasks");

const tareas = [
	{
		id: 0,
		name: "Comprar pan",
		done: false,
	},
	{
		id: 1,
		name: "Hacer el arroz",
		done: false,
	},
	{
		id: 2,
		name: "Contar cosas locas en Discord",
		done: false,
	},
];

const contenidoTarea = (tarea) => `<tr data-id="${tarea.id}">
			<td>${tarea.id}</td>
			<td>${tarea.name}</td>
			<td><input class="rounded-md text-indigo-500 checked:ring-none focus:ring-none" data-id="${tarea.id}" type="checkbox"${tarea.done ? " checked" : ""}></td>
			<td><button class="border-none hover:text-red bg-none" data-id="${tarea.id}"><div class="i-lucide-delete text-2xl"></div></button></td>
		</tr>`;

taskTable.querySelector("tbody").innerHTML = tareas
	.map(contenidoTarea)
	.join("\n");

updateTotal();
updateDone();
for (const tarea of tareas) {
	setupButtons(tarea);
}

todoButton.addEventListener("click", () => {
	const name = todoField.value;
	const id = tareas[tareas.length - 1]?.id + 1 || 0;
	tareas.push({ name, id, done: false });
	const tarea = tareas.find((t) => t.id === id);
	const ele = new DOMParser()
		.parseFromString(
			`<table><tr data-id="${tarea.id}">
			<td>${tarea.id}</td>
			<td>${tarea.name}</td>
			<td><input class="rounded-md text-indigo-500 checked:ring-none focus:ring-none" data-id="${tarea.id}" type="checkbox"></td>
			<td><button class="border-none hover:text-red bg-none" data-id="${tarea.id}"><div class="i-lucide-delete text-2xl"></div></button></td>
		</tr></table>`,
			"text/html",
		)
		.body.firstChild.querySelector("tr");
	document.body.append(ele);
	taskTable.querySelector("tbody").appendChild(ele);
	updateTotal();
	updateDone();
	setupButtons(tarea);
});

function setupButtons(tarea) {
	const row = Array.from(
		/** @type {NodeListOf<HTMLTableRowElement>}*/(
			taskTable.querySelectorAll("tbody > tr[data-id]")
		),
	).find((r) => Number(r.getAttribute("data-id")) === tarea.id);
	const delButton = row.querySelector("button");
	delButton.addEventListener("click", () => {
		const idx = tareas.findIndex((t) => t.id === tarea.id);
		tareas.splice(idx, 1);
		taskTable.deleteRow(row.rowIndex);
		updateTotal();
		updateDone();
	});

	const checkbox = Array.from(
		/** @type {NodeListOf<HTMLInputElement>}*/(
			taskTable.querySelectorAll("input[type=checkbox][data-id]")
		),
	).find((cb) => Number(cb.getAttribute("data-id")) === tarea.id);
	checkbox.addEventListener("change", () => {
		tarea.done = checkbox.checked;
		updateDone();
	});
}

function updateTotal() {
	totalTasksSpan.innerHTML = tareas.length;
}

function updateDone() {
	doneTasksSpan.innerHTML = tareas.filter((t) => t.done).length;
}
