// IMPORTANT! This needs to be run as Administrator

// Imports
const HID = require("node-hid");

// Constants
const VENDOR_ID = 0x04D9;
const PRODUCT_ID = 0xFC38;
const RELEASE = 0x110;
const INTERFACE = 0x2;
const USAGE_PAGE = 0xFFA0;
const USAGE = 0x1;

// Configuration
HID.setDriverType("libusb");

// Utility methods
function enumerateDevices() {
    return HID.devices()
        .filter(x => x.vendorId === VENDOR_ID)
        .filter(x => x.productId === PRODUCT_ID)
        .filter(x => x.release === RELEASE)
        .filter(x => x.interface === INTERFACE)
        .filter(x => x.usagePage === USAGE_PAGE)
        .filter(x => x.usage === USAGE)
        .filter(x => /mouse/gi.test(x.product));
}

function sendChangeColorCommand(device, { red, green, blue }) {
    device.sendFeatureReport([0x02, 0xf3, 0x49, 0x04, 0x06, 0x00, 0x00, 0x00, red, green, blue, 0x01, 0x00, 0x2, 0x00, 0x00]);
}

function sendApplyChangesCommand(device) {
    device.sendFeatureReport([0x02, 0xf1, 0x02, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
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

// Export
module.exports = function(color) {
    // List all hid devices that match the specified filter
    let devices = enumerateDevices();

    // For each device, open it and send the commands
    devices.forEach(x => openDevice(x, color));
};