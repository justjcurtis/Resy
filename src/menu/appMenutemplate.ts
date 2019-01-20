import { app } from "electron";
import { rendererChannel } from "../main";

export var appMenuTemplate = {
	label: app.getName(),
	submenu: [
		{
			label: "About...",
			click: function() {
				const { shell } = require("electron");
				shell.openExternal("https://github.com/justjcurtis/Resy");
			}
		},
		{
			label: "Quit",
			accelerator: "CmdOrCtrl+q",
			click: function() {
				rendererChannel().send("closing");
				app.quit();
			}
		}
	]
};
