# Redragon RGB Controller

A NodeJS project for sending USB HID commands to Redragon's peripherals.

This project uses the wonderful library [node-hid](https://github.com/node-hid/node-hid).

*This project was made on top of reverse engineering the peripherals USB protocols!*

## Usage
- Clone the repository
- Install the dependencies by running `npm install` or `yarn`
- Run `node index.js <target> <color>`
	- Being *target* only -> `keyboard`, `mouse` and `both`
	- Being *color* the hex representation of the desired color **withtout #** (Ex: FF00FF)
	- Ex: `node index.js both FF0000`  for setting both keyboard and mouse to the red color.
- **Windows only** Consider running it as administrator, if it doesn't work properly
- You're all set!

## Tested devices
The devices bellow were tested  and currently working, please open an Issue if your device is not supported.

|Name|Is it functional?|
|--|--|
| Kala keyboard (Lunar white) | Yes |
| Griffin mouse (Lunar white) | Yes |
| Griffin mouse (Regular black) | Yes |

## Adding new devices
If you want to support the project by adding support to new devices, here's the overall process.
- Starting USB capture WireShark with USBPCap
- Changing the color (Or other property) on the original software
- Stop the capture
- Analyse a pattern of "HOST -> DEVICE" then "DEVICE -> HOST" more than once and sequential
- Usually it starts with the profile being set, the color, and the last one is the 'apply' command
- After that is just a matter of changing the raw bytes on the code

## TODO
- [X] Reverse engineering of the Redragon mouse single color command

- [X] Reverse engineering of the Redragon keyboard single color command

- [X] Add a CLI program to interface with the library

- [ ] Reverse engineer the brightness value command

- [ ] Add audio responsive commands *(At the time, as a separated program, only working with the microphone response)*
