import { dialog, IpcMain, IpcMessageEvent } from "electron";

const electron = require("electron");
const ipcMain = electron.ipcMain;

ipcMain.on("showOpenDialog", (event: IpcMessageEvent) => {
	dialog.showOpenDialog(
		{
			title: "Open Resx",
			properties: ["openFile"],
			filters: [{ name: "Resx", extensions: ["resx", "csv"] }]
		},
		paths => {
			if (paths !== undefined) {
				var path = paths[0];
				event.sender.send("openDialogResult", path);
			}
		}
	);
});

ipcMain.on("showSaveAsDialog", (event: IpcMessageEvent) => {
	dialog.showSaveDialog(
		{
			title: "Save as..",
			filters: [{ name: "Resx", extensions: ["resx", "csv"] }]
		},
		path => {
			if (path !== undefined) {
				event.sender.send("saveAsDialogResult", path);
			}
		}
	);
});
