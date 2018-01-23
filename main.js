"use strict";

const alert = require("./modules/alert");
const electron = require("electron");
const ipcMain = require("electron").ipcMain;
const path = require("path");
const windows = require("./modules/windows");

let about_message = `Chlorine: Replay viewer for Halite 2\n` +
					`--\n` +
					`Electron ${process.versions.electron}\n` +
					`Node ${process.versions.node}\n` +
					`V8 ${process.versions.v8}`

// -------------------------------------------------------

electron.app.on("ready", () => {

	windows.new("renderer", {
		title: "Chlorine", show: true, width: 1200, height: 800, resizable: true, page: path.join(__dirname, "chlorine_renderer.html")
	});

	windows.new("info", {
		title: "Info", show: false, width: 400, height: 800, resizable: true, page: path.join(__dirname, "chlorine_info.html")
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
	}

/*
	else if (process.argv.length === 2) {						// Or, if exactly 1 arg, assume it's a filename. Only good for standalone release.
		windows.send("renderer", "open", process.argv[1]);
	}
*/

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
					label: "About...",
					click: () => {
						alert(about_message);
					}
				},
				{
					role: "toggledevtools"
				},
				{
					type: "separator"
				},
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
					label: "Move to Start",
					accelerator: "Home",
					click: () => {
						windows.send("renderer", "forward", -99999);
					}
				},
				{
					label: "Move to End",
					accelerator: "End",
					click: () => {
						windows.send("renderer", "forward", 99999);
					}
				},
				{
					type: "separator"
				},
				{
					label: "Go To Next Event",
					accelerator: "Enter",
					click: () => {
						windows.send("renderer", "go_to_next_event", null);
					}
				},
			]
		},
		{
			label: "View",
			submenu: [
				{
					label: "Reset Zoom / Scroll",
					accelerator: "F1",
					click: () => {
						windows.send("renderer", "reset_zoom", null);
					}
				},
				{
					type: "separator"
				},
				{
					label: "Weapon Ranges",
					click: () => {
						windows.send("renderer", "toggle", "weapon_ranges");
					},
					type: "checkbox",
					checked: false,
				},
				{
					label: "Tactical Ranges (13)",
					submenu: [
						{
							label: "Pink",
							accelerator: "1",
							click: () => {
								windows.send("renderer", "toggle", "tactical_ranges_0");
							},
							type: "checkbox",
							checked: false,
						},
						{
							label: "Blue",
							accelerator: "2",
							click: () => {
								windows.send("renderer", "toggle", "tactical_ranges_1");
							},
							type: "checkbox",
							checked: false,
						},
						{
							label: "Yellow",
							accelerator: "3",
							click: () => {
								windows.send("renderer", "toggle", "tactical_ranges_2");
							},
							type: "checkbox",
							checked: false,
						},
						{
							label: "Green",
							accelerator: "4",
							click: () => {
								windows.send("renderer", "toggle", "tactical_ranges_3");
							},
							type: "checkbox",
							checked: false,
						},
					]
				},
				{
					label: "Docking Ranges",
					click: () => {
						windows.send("renderer", "toggle", "docking_ranges");
					},
					type: "checkbox",
					checked: false,
				},
				{
					type: "separator"
				},
				{
					label: "Planets",
					click: () => {
						windows.send("renderer", "toggle", "show_planets");
					},
					type: "checkbox",
					checked: true,
				},
				{
					type: "separator"
				},
				{
					label: "Tails",
					accelerator: "T",
					click: () => {
						windows.send("renderer", "toggle", "tails");
					},
					type: "checkbox",
					checked: true,
				},
				{
					label: "Pointers",
					accelerator: "P",
					click: () => {
						windows.send("renderer", "toggle", "pointers");
					},
					type: "checkbox",
					checked: false,
				},
				{
					label: "Deaths",
					click: () => {
						windows.send("renderer", "toggle", "deaths");
					},
					type: "checkbox",
					checked: true,
				},
				{
					type: "separator"
				},
				{
					label: "Selection Crosshair",
					click: () => {
						windows.send("renderer", "toggle", "crosshair");
					},
					type: "checkbox",
					checked: true,
				},
				{
					label: "High Precision Coordinates",
					click: () => {
						windows.send("renderer", "toggle", "precise");
					},
					type: "checkbox",
					checked: false,
				},
				{
					type: "separator"
				},
				{
					label: "Angle Message Interpretation",		// Consider angles >= 360 as encoding a number...
					click: () => {
						windows.send("renderer", "toggle", "angle_messages");
					},
					type: "checkbox",
					checked: true,
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
