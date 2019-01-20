import { readSetting, saveSetting } from "./localStorage";
import { readResxFromFile } from "./fileSystem";
import { buildTableResx, clearTable, addRow } from "./tableService";
import { Resx } from "../models/resx";
import { xmlToResxObj } from "./xmlService";

export function showElementById(id: string) {
	var element: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
	element.hidden = false;
}

export function hideElementById(id: string) {
	var element: HTMLDivElement = <HTMLDivElement>document.getElementById(id);
	element.hidden = true;
}

function showCover() {
	if (readSetting("lastFile") !== undefined) {
		var lfbtn: HTMLAnchorElement = <HTMLAnchorElement>(
			document.getElementById("lf-btn")
		);
		var path = readSetting("lastFile");
		var filename = path
			.split("\\")
			.pop()
			.split("/")
			.pop()
			.split(".")[0];
		lfbtn.innerText = filename;
		lfbtn.onclick = () => {
			var currentResx = readSetting("currentResx");
			if (currentResx === undefined) {
				try {
					currentResx = readResxFromFile(path);
				} catch (error) {
					console.log("couldn't load : " + path);
				}
			} else {
				tableView(xmlToResxObj(currentResx));
			}
		};

		showElementById("lf-container");
	} else {
		hideElementById("lf-container");
	}
	showElementById("cover");
}

function hideCover() {
	hideElementById("lf-container");
	hideElementById("cover");
}

function showTable() {
	showElementById("mainTable");
}

function hideTable() {
	hideElementById("mainTable");
}

export function tableView(resx: Resx = undefined) {
	if (resx !== undefined) {
		buildTableResx(resx);
	} else {
		clearTable();
		addRow();
	}
	hideCover();
	showTable();
	saveSetting("currentView", "tableView");
}

export function coverView() {
	hideTable();
	showCover();
	saveSetting("currentView", "coverView");
}
