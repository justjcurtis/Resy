import { readSetting } from "./Services/localStorage";
import { coverView } from "./Services/NavigationService";
import { lastRow, rowHasContent, addRow } from "./Services/tableService";
import {
	newFile,
	openFile,
	saveFile,
	saveFileAs,
	storeTable
} from "./Services/fileSystem";
const electron = require("electron");
const ipc = electron.ipcRenderer;

function init() {
	coverView();
	document.onkeydown = function(evt) {
		if (readSetting("currentView") == "tableView") {
			if (rowHasContent(lastRow().rowIndex - 1)) {
				addRow();
			}
		}
	};
}

if (document !== undefined) {
	init();
}

// main proccess listners

ipc.on("newFile", function() {
	newFile();
});
ipc.on("openFile", () => {
	openFile();
});
ipc.on("saveFile", () => {
	saveFile();
});
ipc.on("saveFileAs", () => {
	saveFileAs();
});
ipc.on("closing", () => {
	storeTable();
});
