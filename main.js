"use strict";

const alert = require("./modules/alert");
const electron = require("electron");
const ipcMain = require("electron").ipcMain;
const path = require("path");
const windows = require("./modules/windows");

// -------------------------------------------------------

electron.app.on("ready", () => {

	windows.new("renderer", {
		title: "Chlorine", show: true, width: 1200, height: 800, resizable: true, page: path.join(__dirname, "chlorine_renderer.html")
	});

	windows.new("info", {
		title: "Info", show: false, width: 400, height: 600, resizable: true, page: path.join(__dirname, "chlorine_info.html")
	});

	windows.new("events", {
		title: "Events", show: false, width: 400, height: 800, resizable: true, page: path.join(__dirname, "chlorine_info.html")
	});

	electron.Menu.setApplicationMenu(make_main_menu());
});

electron.app.on("window-all-closed", () => {
	electron.app.quit();
});

// -------------------------------------------------------

ipcMain.on("renderer_ready", () => {

	// Load a file via command line with -o filename.

	let filename = "";
	for (let i = 0; i < process.argv.length - 1; i++) {
		if (process.argv[i] === "-o") {
			filename = process.argv[i + 1];
		}
	}
	if (filename !== "") {
		windows.send("renderer", "open", filename);
	} else if (process.argv.length === 2) {						// Or, if exactly 1 arg, assume it's a filename...
		windows.send("renderer", "open", process.argv[1]);
	}
});

ipcMain.on("relay", (event, msg) => {
	windows.send(msg.receiver, msg.channel, msg.content);		// Messages from one browser window to another...
});

// -------------------------------------------------------

function make_main_menu() {
	const template = [
		{
			label: "File",
			submenu: [
				{
					label: "Open...",
					accelerator: "CommandOrControl+O",
					click: () => {
						let files = electron.dialog.showOpenDialog();
						if (files && files.length > 0) {
							windows.send("renderer", "open", files[0]);
						}
					}
				},
				{
					type: "separator"
				},
				{
					label: "Save decompressed JSON...",
					accelerator: "CommandOrControl+S",
					click: () => {
						let outfilename = electron.dialog.showSaveDialog();
						if (outfilename) {
							windows.send("renderer", "save", outfilename);
						}
					}
				},
				{
					label: "Save current entities...",
					click: () => {
						let outfilename = electron.dialog.showSaveDialog();
						if (outfilename) {
							windows.send("renderer", "save_frame", outfilename);
						}
					}
				},
				{
					label: "Save current moves...",
					click: () => {
						let outfilename = electron.dialog.showSaveDialog();
						if (outfilename) {
							windows.send("renderer", "save_moves", outfilename);
						}
					}
				},
				{
					type: "separator"
				},
				{
					accelerator: "CommandOrControl+Q",
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
						windows.send("renderer", "forward", 1);
					}
				},
				{
					label: "Back",
					accelerator: "Left",
					click: () => {
						windows.send("renderer", "forward", -1);
					}
				},
				{
					type: "separator"
				},
				{
					label: "Move To Start",
					accelerator: "Home",
					click: () => {
						windows.send("renderer", "forward", -99999);
					}
				},
				{
					label: "Move To End",
					accelerator: "End",
					click: () => {
						windows.send("renderer", "forward", 99999);
					}
				},
			]
		},
		{
			label: "View",
			submenu: [
				{
					label: "Toggle Weapon Ranges",
					click: () => {
						windows.send("renderer", "toggle", "weapon_ranges");
					}
				},
				{
					label: "Toggle Docking Ranges",
					click: () => {
						windows.send("renderer", "toggle", "docking_ranges");
					}
				},
				{
					type: "separator"
				},
				{
					label: "Toggle Tails",
					click: () => {
						windows.send("renderer", "toggle", "tails");
					}
				},
				{
					label: "Toggle Pointers",
					click: () => {
						windows.send("renderer", "toggle", "pointers");
					}
				},
				{
					label: "Toggle Deaths",
					click: () => {
						windows.send("renderer", "toggle", "deaths");
					}
				},
				{
					type: "separator"
				},
				{
					label: "Toggle Selection Crosshair",
					click: () => {
						windows.send("renderer", "toggle", "crosshair");
					}
				},
				{
					label: "Toggle High Precision Coordinates",
					click: () => {
						windows.send("renderer", "toggle", "precise");
					}
				},
				{
					type: "separator"
				},
				{
					label: "Toggle Angle Message Interpretation",		// Consider angles >= 360 as encoding a number...
					click: () => {
						windows.send("renderer", "toggle", "angle_messages");
					}
				},
				{
					label: "About Angle Messages...",
					click: () => {
						about_angle_messages();
					}
				},
			]
		},
		{
			label: "Windows",
			submenu: [
				{
					label: "Renderer",
					click: () => {
						windows.show("renderer");
					}
				},
				{
					label: "Info",
					click: () => {
						windows.show("info");
					}
				},
				{
					label: "Events",
					click: () => {
						windows.show("events");
					}
				},
			]
		},
	];

	return electron.Menu.buildFromTemplate(template);
}

function about_angle_messages() {

	let s = `
Want your ships to write messages directly into the game replay? \
Of course you do! Introducing Chlorine's patented Angle Message \
system! Exploit the redundancy inherent in angles to send messages \
to yourself!

How it works:

A Halite angle is an unsigned int16. There are just over 180 ways \
of sending the same angle. Chlorine can interpret ship movements \
with angles over 359 as messages, where each message is a number \
in the range 0..180.

To encode:

    def new_angle_with_message(angle, message):
        return ((message + 1) * 360) + angle

Then use the new angle when sending the ship's thrust to the server. \
Chlorine can show the message in the ship info. You can also edit \
messages.json to display text rather than numbers.`;

	alert(s);
}
