import { Resx, Datum, resxHead, resxFoot } from "../models/resx";
import { DatumsToXmlDatas } from "./xmlService";

export function buildTableResx(resx: Resx) {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	var data = resx.root.data;
	data.forEach(attribue => {
		var comment = attribue.comment ? attribue.comment._text : "";
		addRow(attribue._attributes.name, attribue.value._text, comment);
	});
	addRow();
}
export function buildTableStringArray(data: string[][]) {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	data.forEach(row => {
		addRow(row[0], row[1], row[2] ? row[2] : "");
	});
	addRow();
}

export function clearTable() {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	table.tBodies[0].remove();
	table.createTBody();
}

export function rowHasContent(i: number) {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	var rowAtI = getRowAtI(i);

	var nameField = <HTMLInputElement>rowAtI.children[1].firstElementChild;
	var valueField = <HTMLInputElement>rowAtI.children[2].firstElementChild;
	var commentField = <HTMLInputElement>rowAtI.children[3].firstElementChild;

	return nameField.value !== "" && valueField.value !== "";
}

export function getRowAtI(i: number) {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	return <HTMLTableRowElement>table.tBodies[0].children[i];
}

export function lastRow() {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	return <HTMLTableRowElement>table.tBodies[0].lastChild;
}

export function trimEmptyRows() {
	var data = currentTableData();
	clearTable();
	buildTableStringArray(data);
}

export function currentTableData() {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	var data: string[][] = [];
	for (var i = 0; i < table.tBodies[0].childElementCount - 1; i++) {
		if (rowHasContent(i)) {
			var row = getRowAtI(i);
			var nameField = <HTMLInputElement>row.children[1].firstElementChild;
			var valueField = <HTMLInputElement>(
				row.children[2].firstElementChild
			);
			var commentField = <HTMLInputElement>(
				row.children[3].firstElementChild
			);
			if (nameField.value !== "" && valueField.value !== "") {
				data.push([
					nameField.value,
					valueField.value,
					commentField.value ? commentField.value : ""
				]);
			}
		}
	}

	return data;
}

export function currentTableDatums() {
	var data = currentTableData();
	var datums: Datum[] = [];
	data.forEach(row => {
		var xmlSpace = "preserve";

		var name = row[0];
		var value = row[1];
		var comment = row[2];

		var datum: Datum = new Datum(xmlSpace, name, value, comment);

		datums.push(datum);
	});

	return datums;
}

export function currentTableToResxRaw() {
	var datums = currentTableDatums();
	var head = resxHead();
	var body = DatumsToXmlDatas(datums);
	var foot = resxFoot();

	var resxRaw = head + "\n" + body + foot;
	return resxRaw;
}

export function addRow(
	name: string = "",
	value: string = "",
	comment: string = ""
) {
	var table: HTMLTableElement = <HTMLTableElement>(
		document.getElementById("mainTable")
	);
	var i = 0;
	var lastRow = <HTMLTableRowElement>table.tBodies[0].lastElementChild;
	if (lastRow !== null) {
		var i = lastRow.rowIndex;
	}
	var row = table.tBodies[0].insertRow(i);

	var nr = row.insertCell();
	nr.innerText = (i + 1).toString();

	var nameInput = row.insertCell();
	var nameInputField = <HTMLInputElement>document.createElement("input");
	nameInputField.setAttribute("type", "text");
	nameInputField.setAttribute("id", "lastname");
	nameInputField.value = name;
	nameInput.appendChild(nameInputField);

	var valueInput = row.insertCell();
	var valueInputField = <HTMLInputElement>document.createElement("input");
	valueInputField.setAttribute("type", "text");
	valueInputField.value = value;
	valueInput.appendChild(valueInputField);

	var commentInput = row.insertCell();
	var commentInputField = <HTMLInputElement>document.createElement("input");
	commentInputField.setAttribute("type", "text");
	commentInputField.value = comment;
	commentInput.appendChild(commentInputField);

	return row;
}
