"use strict";

const electron = require("electron");
const url = require("url");
const assign_without_overwrite = require("./utils").assign_without_overwrite;

const all = [];

exports.new = (params = {}) => {

    let defaults = {width: 600, height: 400, resizable: true, page: "index.html"};
    assign_without_overwrite(params, defaults);

    // The screen may be zoomed, we can compensate...

    let zoom_factor = 1 / electron.screen.getPrimaryDisplay().scaleFactor;

    let win = new electron.BrowserWindow({
        width: params.width * zoom_factor,
        height: params.height * zoom_factor,
        backgroundColor: "#000000",
        useContentSize: true,
        resizable: params.resizable,
        webPreferences: { zoomFactor: zoom_factor, webSecurity: false }
    });

    win.loadURL(url.format({
        protocol: "file:",
        pathname: params.page,
        slashes: true
    }));

    all.push(win);

    win.on("closed", () => {
        let n;
        for (n = 0; n < all.length; n += 1) {
            if (all[n] === win) {
                all.splice(n, 1);
                break;
            }
        }
    });
};

exports.change_zoom = (diff) => {
    let n;
    for (n = 0; n < all.length; n += 1) {
        let contents = all[n].webContents;
        contents.getZoomFactor((val) => {
            if (val + diff >= 0.2) {
                contents.setZoomFactor(val + diff);
            }
        });
    }
};

exports.set_zoom = (val) => {
    let n;
    for (n = 0; n < all.length; n += 1) {
        let contents = all[n].webContents;
        contents.setZoomFactor(val);
    }
};

exports.send = (channel, msg) => {
    let n;
    for (n = 0; n < all.length; n += 1) {
        let contents = all[n].webContents;
        contents.send(channel, msg);
    }
};
