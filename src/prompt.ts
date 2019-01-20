import { BrowserWindow, IpcMessageEvent } from "electron";
import * as path from "path";
import { PromptOptions } from "./models/promptOptions";

const electron = require("electron");
const ipcMain = electron.ipcMain;

var promptWindow: BrowserWindow;
var promptOptions: PromptOptions;
var promptAnswer: string;

// Creating the dialog

function promptModal(
	parent: BrowserWindow,
	options: PromptOptions,
	callback: FunctionStringCallback
) {
	promptOptions = options;
	promptWindow = new BrowserWindow({
		width: 540,
		height: 100,
		parent: parent,
		resizable: false,
		show: false,
		modal: true,
		alwaysOnTop: true,
		title: options.title,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			sandbox: false
		}
	});
	promptWindow.on("closed", () => {
		promptWindow = null;
		callback(promptAnswer);
	});

	// Load the HTML dialog box
	promptWindow.loadFile(path.join(__dirname, "../prompt.html"));
	promptWindow.once("ready-to-show", () => {
		promptWindow.show();
	});
}

// Called by the dialog box to get its parameters

ipcMain.on("openDialog", (event: IpcMessageEvent, data: string) => {
	event.returnValue = JSON.stringify(promptOptions, null, "");
});

// Called by the dialog box when closed

ipcMain.on("closeDialog", (event: IpcMessageEvent, data: string) => {
	promptAnswer = data;
});

// Called by the application to open the prompt dialog

ipcMain.on("prompt", (event: IpcMessageEvent, promptOptions: PromptOptions) => {
	promptModal(
		electron.BrowserWindow.getFocusedWindow(),
		promptOptions,
		function(data: string) {
			event.returnValue = data;
		}
	);
});
