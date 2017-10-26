# chlorine
Replay viewer for [Halite2](https://halite.io/), in JavaScript (Electron).

# Installation

You must install Electron. Once that's done, assuming you also have npm, you can do:

```
npm install
electron .
```

# Dependencies
* node-zstandard (will be installed by npm)

# Usage

Open a file from the menu, or via command line with `electron . -o filename.hlt`. Drag-and-dropping a file onto the window may also work. Once a file is opened, navigate with left and right arrow keys. (Todo: autoplay.)

# Screenshot
![Chlorine Screenshot](https://raw.githubusercontent.com/fohristiwhirl/chlorine/master/screenshot.png)
