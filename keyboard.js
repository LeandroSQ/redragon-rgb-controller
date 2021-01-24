// IMPORTANT! This needs to be run as Administrator

// Imports
const HID = require("node-hid");

// Constants
const VENDOR_ID = 0x0c45;
const PRODUCT_ID = 0x5004;
const RELEASE = 0x107;
const INTERFACE = 0x1;
const USAGE_PAGE = 0xFF1C;
const COLOR = "#FF0000";

// Configuration
HID.setDriverType("libusb");

// Utility methods
function hexToRgb(hex) {
    let [red, green, blue] = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
    return { red, green, blue };
}

function enumerateDevices() {
    return HID.devices()
        .filter(x => x.vendorId === VENDOR_ID)
        .filter(x => x.productId === PRODUCT_ID)
        .filter(x => x.release === RELEASE)
        .filter(x => x.interface === INTERFACE)
        .filter(x => x.usagePage === USAGE_PAGE)
        .filter(x => /USB DEVICE/gi.test(x.product))
        .filter(x => /sonix/gi.test(x.manufacturer));
}

function sendChangeColorCommand(device, { red, green, blue }) {
    device.write([0x04, 0x0c, 0x02, 0x06, 0x03, 0x05, 0x00, 0x00, red, green, blue, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
}

function sendApplyChangesCommand(device) {
    device.write([0x04, 0x02, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
}

function openDevice(deviceInfo, color) {
    try {
        let device = new HID.HID(deviceInfo.path);

        sendChangeColorCommand(device, color);
        sendApplyChangesCommand(device);

        device.close();
    } catch (error) {
        console.error(error);
    }
}

// Execution
function main() {
    // Convert the hex color to rgb
    const color = hexToRgb(COLOR);

    // List all hid devices that match the specified filter
    let devices = enumerateDevices();

    // For each device, open it and send the commands
    devices.forEach(x => openDevice(x, color));
}

main();