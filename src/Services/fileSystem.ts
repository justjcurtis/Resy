const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
import { saveSetting, readSetting, deleteSetting } from "./localStorage";
import { readFileSync, writeFileSync } from "fs";
import { xmlToResxObj } from "./xmlService";
import { tableView } from "./NavigationService";
import {
	currentTableToResxRaw,
	trimEmptyRows,
	currentTableDatums
} from "./tableService";
import { designerPath, designerFromDatum } from "./designerCsService";

export function newFile() {
	deleteSetting("lastFile");
	deleteSetting("currentResx");
	tableView();
}

export function openFile() {
	console.log("calling main");
	ipcRenderer.send("showOpenDialog");
	console.log("called");
	ipcRenderer.once("openDialogResult", function(event: Event, path: string) {
		saveSetting("lastFile", path);
		var data = readResxFromFile(path);
		tableView(xmlToResxObj(data));
	});
}

export function readResxFromFile(path: string) {
	var data = readFileSync(path);
	saveSetting("currentResx", data.toString());
	return data.toString();
}

export function saveFile() {
	if (readSetting("currentView") == "tableView") {
		if (readSetting("lastFile") !== undefined) {
			var path = readSetting("lastFile");
			saveTableToFile(path);
		} else {
			saveFileAs();
		}
	}
}
export function storeTable() {
	trimEmptyRows();
	var currentResx = currentTableToResxRaw();
	saveSetting("currentResx", currentResx);
	return currentResx;
}

export function saveTableToFile(path: string) {
	var currentResx = storeTable();
	writeFileSync(path, currentResx);
	var desData = designerFromDatum(currentTableDatums());
	writeFileSync(designerPath(), desData);
}

export function saveFileAs() {
	if (readSetting("currentView") == "tableView") {
		ipcRenderer.send("showSaveAsDialog");
		ipcRenderer.once("saveAsDialogResult", (event: Event, path: string) => {
			saveSetting("lastFile", path);
			saveTableToFile(path);
		});
	}
}
