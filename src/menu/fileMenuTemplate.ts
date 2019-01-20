import { rendererChannel } from "../main";

export var fileMenuTemplate = {
	label: "File",
	submenu: [
		{
			label: "New..",
			accelerator: "CmdOrCtrl+N",
			click() {
				rendererChannel().send("newFile");
			}
		},
		{
			label: "Open..",
			accelerator: "CmdOrCtrl+O",
			click() {
				rendererChannel().send("openFile");
			}
		},
		{ type: "separator" },
		{
			label: "Save",
			accelerator: "CmdOrCtrl+S",
			click() {
				rendererChannel().send("saveFile");
			}
		},
		{
			label: "Save as..",
			accelerator: "CmdOrCtrl+Shift+S",
			click() {
				rendererChannel().send("saveFileAs");
			}
		}
	]
};
