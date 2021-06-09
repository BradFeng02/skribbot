drawing bot for pictionary game skribbl.io

current version: master  
old python version: old-python-version

old python version was janky because it actually moved my mouse to draw

current version is a chrome extension and uses game's websockets. it has built in image search too for convenience


sidenotes:
- the img server folder is for a nodejs server running CORS anywhere so i can use more images
- the bot uses contours to draw and the easiest way was using opencv which i've already used. so thats why theres a big opencv.js file.
