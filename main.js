"use strict";

const electron = require("electron");
const windows = require("./modules/windows");
const alert = require("./modules/alert");

electron.app.on("ready", () => {
	windows.new({width: 1200, height: 800, page: "chlorine.html"});
	menu_build();
});

electron.app.on("window-all-closed", () => {
	electron.app.quit();
});

function menu_build() {
	const template = [
		{
			label: "Menu",
			submenu: [
				{
					label: "Open...",
					accelerator: "CommandOrControl+O",
					click: () => {
						let files = electron.dialog.showOpenDialog();
						if (files.length > 0) {
							windows.send("open", files[0]);
						}
					}
				},
				{
					label: "Save decompressed JSON...",
					click: () => {
						let outfilename = electron.dialog.showSaveDialog();
						if (outfilename) {
							windows.send("save", outfilename);
						}
					}
				},
				{
					type: "separator"
				},
				{
					label: "Zoom out",
					click: () => {
						windows.change_zoom(-0.1);
					}
				},
				{
					label: "Zoom in",
					click: () => {
						windows.change_zoom(0.1);
					}
				},
				{
					role: "quit"
				},
				{
					type: "separator"
				},
				{
					role: "toggledevtools"
				},
			]
		},
		{
			label: "Navigation",
			submenu: [
				{
					label: "Forward",
					accelerator: "Right",
					click: () => {
						windows.send("forward", 1);
					}
				},
				{
					label: "Back",
					accelerator: "Left",
					click: () => {
						windows.send("forward", -1);
					}
				},
			]
		},
	];

	const menu = electron.Menu.buildFromTemplate(template);
	electron.Menu.setApplicationMenu(menu);
}
