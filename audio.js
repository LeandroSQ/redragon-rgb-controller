const CoreAudio = require("node-core-audio");
const FourierTransform = require("fourier-transform");
const Gui = require("gui");
const HID = require("node-hid");

let isNormalizationEnabled = false;
const BUFFER_SIZE = 512;
const GAIN = 200;
const DEFAULT_OPTIONS = {
    framesPerBuffer: BUFFER_SIZE,
    interleaved: false,
    sampleRate: 8000,
    inputDevice: 0,
    outputDevice: 3
};
let lastValue = 0;
let lastTime = 0;
let lbl = null;

HID.setDriverType("libusb");
let kbdDevices = HID.devices()
    .filter(x => x.vendorId === 0x0c45)
    .filter(x => x.productId === 0x5004)
    .filter(x => x.release === 0x107)
    .filter(x => x.interface === 0x1)
    .filter(x => x.usagePage === 0xFF1C)
    .filter(x => /USB DEVICE/gi.test(x.product))
    .filter(x => /sonix/gi.test(x.manufacturer));

function changeKeyboard(color) {
    function sendChangeColorCommand(device, { red, green, blue }) {
        device.write([0x04, 0x0c, 0x02, 0x06, 0x03, 0x05, 0x00, 0x00, red, green, blue, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }

    function sendApplyChangesCommand(device) {
        device.write([0x04, 0x02, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }

    return new Promise((resolve, reject) => {
        kbdDevices.forEach(deviceInfo => {
            try {
                let device = new HID.HID(deviceInfo.path);

                sendChangeColorCommand(device, color);
                sendApplyChangesCommand(device);

                device.close();
            } catch (error) {
                console.error(error);
            }
        });
    });
}

function lerp(a, b, t) {
    if (t <= 0.5)
        return a + (b - a) * t;
    else
        return b - (b - a) * (1.0 - t);
}

let engine = CoreAudio.createNewAudioEngine();
engine.setOptions(DEFAULT_OPTIONS);

engine.addAudioCallback(processAudio);

function getOutputDevices() {
    let devices = [];

    let deviceCount = engine.getNumDevices();
    for (let i = 0; i < deviceCount; i ++) {
        let deviceName = engine.getDeviceName(i).trim();
        let obj = {};
        obj[deviceName] = i;
        if (deviceName && deviceName !== "") devices.push(obj);
    }

    return devices;
}

function processAudio(buffer) {
    if (!lbl) return;
    console.log(buffer.length);

    let ts = normalizeTs(buffer[0]);
    let ft = FourierTransform(ts);
    let nft = normalize(ft);

    try {
        let time = Date.now();
        let diff = Math.abs(time - lastTime);

        if (diff > 33) {
            lastTime = time;
            let par = average(nft) * 255;
            if (par < 0) par = 0;
            if (par > 255) par = 255;
            if (Math.abs(lastValue - par) >= 0) {
                lastValue = lerp(lastValue, par, 0.75);

                let p = Math.floor(par).toString(16).padStart(2, '0');
                let color = "#" + p + p + p;
                lbl.setBackgroundColor(color);
                 changeKeyboard({ red: parseInt(par), green: 0, blue: 0 });
            }
        }

    } catch (error) {

    }


}

function normalizeTs(ts) {
    for (let i = 0; i < ts.length; i ++) {
        ts[i] = ts[i] / 100 * GAIN;
    }

    return ts;
}

function average(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum/arr.length;
}

function normalize(ft) {
    let mean = average(ft);

    for (let i = 0; i < ft.length; i++) {
        let normalization = 0;
        if (isNormalizationEnabled) {
            let multiples = ft[i] / mean;
            if (7 < multiples) {
                normalization = ft[i] / 1.4;
            } else if (6 < multiples) {
                normalization = ft[i] / 1.8;
            } else if (5 < multiples) {
                normalization = ft[i] / 2;
            } else if (4 < multiples) {
                normalization = ft[i] / 3;
            } else if (3 < multiples) {
                normalization = ft[i] / 4;
            } else if (2 < multiples) {
                normalization = ft[i] / 5;
            } else if (1 < multiples) {
                normalization = ft[i] / 7;
            }
        }

        ft[i] = (ft[i] - normalization) * GAIN;
    }

    return ft;
}

function main() {
    let outputDevices = getOutputDevices();
    console.log(outputDevices);

    const w = Gui.Window.create({ });
    lbl = Gui.Button.create("test");
    lbl.onClick = () => isNormalizationEnabled = !isNormalizationEnabled;
    w.setContentView(lbl);
    w.setContentSize({ width: 400, height: 400 });
    w.onClose = () => Gui.MessageLoop.quit();
    w.center();
    w.activate();

    if (!process.versions.yode) {
        Gui.MessageLoop.run();  // block until gui.MessageLoop.quit() is called
        process.exit(0);
    }
}
main();