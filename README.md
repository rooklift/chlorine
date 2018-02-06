# Chlorine
Replay viewer for [Halite2](https://halite.io/), in JavaScript (Electron).

# Installation

If you have npm and [Electron](https://electron.atom.io/) installed globally, you can do:

```
npm install
electron .
```

If you only have npm, and don't want to install Electron globally, I'm told the following works instead:

```
npm install
npm install electron --save-dev --save-exact
./node_modules/.bin/electron .
```

Finally, if you're on Windows, there's a prebuilt binary in the [Releases](https://github.com/fohristiwhirl/chlorine/releases) section.

# Other dependencies
* [node-zstandard](https://www.npmjs.com/package/node-zstandard) (gets installed by `npm install`)

# Usage

Open a file from the menu, or via command line with `electron . -o filename.hlt`. Drag-and-dropping a file onto the window may also work. Once a file is opened, navigate with left and right arrow keys.

# Screenshot
![Chlorine Screenshot](https://raw.githubusercontent.com/fohristiwhirl/chlorine/master/screenshot.png)
