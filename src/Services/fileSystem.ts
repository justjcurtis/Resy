const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
import { saveSetting, readSetting, deleteSetting } from "./localStorage";
import { readFileSync, writeFileSync } from "fs";
import { xmlToResxObj } from "./xmlService";
import { tableView } from "./NavigationService";
import {
	currentTableToResxRaw,
	trimEmptyRows,
	datumsFromTable,
	currentTableData,
	tableToResxRaw
} from "./tableService";
import { designerPath, designerFromDatum } from "./designerCsService";
import { tableToCsv, csvToTableData } from "./csvService";

export function newFile() {
	deleteSetting("lastFile");
	deleteSetting("currentResx");
	tableView();
}

export function openFile() {
	ipcRenderer.send("showOpenDialog");
	ipcRenderer.once("openDialogResult", function(event: Event, path: string) {
		saveSetting("lastFile", path);
		var data : string;
		if(getExtensionFromPath(path)=="resx"){
			data = readResxFromFile(path);
		}else{
			data = readCsvFromFile(path);
		}
		tableView(xmlToResxObj(data));
	});
}

export function readResxFromFile(path: string) {
	var data = readFileSync(path);
	saveSetting("currentResx", data.toString());
	return data.toString();
}

export function readCsvFromFile(path: string) {
	var csv = readFileSync(path);
	var data = csvToTableData(csv.toString());
	var rawResx = tableToResxRaw(data);
	saveSetting("currentResx", rawResx);
	return rawResx;
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
	var ext = getExtensionFromPath(path);
	if(ext == "resx"){
		writeFileSync(path, currentResx);
		var desData = designerFromDatum(datumsFromTable(currentTableData()));
		writeFileSync(designerPath(), desData);
	}else{
		var csvData = tableToCsv(currentTableData());
		writeFileSync(path, csvData);
	}
}

export function getExtensionFromPath(path: string) {
	var split = path.split('.');
	return split[split.length-1];
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
