import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";
import { editMenuTemplate } from "./menu/editMenuTemplate";
import { devMenuTemplate } from "./menu/devMenuTemplate";
import { appMenuTemplate } from "./menu/appMenutemplate";
import { fileMenuTemplate } from "./menu/fileMenuTemplate";

let mainWindow: Electron.BrowserWindow, menu;

function createWindow() {
	require("./Services/dialogService");
	require("./prompt");
	// Create the browser window.
	mainWindow = new BrowserWindow({
		height: 800,
		width: 1000
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, "../index.html"));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
}

export function rendererChannel() {
	return BrowserWindow.getFocusedWindow().webContents;
}

function createMenu() {
	if (process.platform === "darwin") {
		var menus: any[] = [appMenuTemplate];
		menus.push(fileMenuTemplate);
		menus.push(editMenuTemplate);
		Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
	} else {
		var menus: any[] = [fileMenuTemplate];
		menus.push(editMenuTemplate);
		Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
	createWindow();
	createMenu();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		rendererChannel().send("closing");
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it"s common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
