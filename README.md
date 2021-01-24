# Redragon RGB Controller
A NodeJS implementation for sending commands to Redragon peripherals using USB HID protocol.

**Attention:** *This was made on top of reverse engineering of the peripherals USB protocols!*

This project uses the wonderful library (node-hid)[https://github.com/node-hid/node-hid]

# Usage
- Install the dependencies `npm install`
- (WINDOWS) Start a terminal instance on admin privileges
- Change the constant 'COLOR' to your preferred color on the files 'keyboard.js' and 'mouse.js'
- Run the specified target
    - Run `node keyboard.js` if you want to control your keyboard
    - Run `node mouse.js` if you want to control your mouse
- You're done!

# Available devices
Currently tested with:
- REDRAGON Griffin mouse *(Both lunar white and regular)*
- REDRAGON Kala keyboard *(Lunar white, but should work the same with the black regular version)*

*Both of them, my own devices that I used for revering the communication.*

# Adding new devices
It should be trivial to add other devices being the overall and over simplified process:
- Starting USB capture WireShark with USBPCap
- Changing the color (Or other property) on the original software
- Stop the caputre
- Analyse a pattern of "HOST -> DEVICE" then "DEVICE -> HOST" more than once and sequential
- Usually it starts with the profile being set, the color, and the last one is the 'apply' command
- After that is just a matter of changing the raw bytes on the code

# TODO
[x] - Reverse engineer the Redragon mouse single color command

[x] - Reverse engineer the Redragon keybaord single color command

[ ] - Reverse enginner the brightness value command

[ ] - Add a command line argument parser, for passing the color as an argument
