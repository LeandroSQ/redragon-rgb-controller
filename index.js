// Imports
const keyboard = require("./keyboard");
const mouse = require("./mouse");
const utility = require("./utility");

// Utility functions
function parseArguments() {
    // Get the arguments
    let args = [...process.argv.slice(0)];

    let parseColorArgument = () => {
        // Gets the color from the arguments
        let color = args.find(x => /^[0-9A-Z]{6}$/gi.test(x));
        if (!color) throw new Error("You need to provide a valid HEX color!\nEx: node index.js <color> <target?>");

        // Parses the color
        return utility.hexToRgb(color);
    };

    let parseTargetArgument = () => {
        // Gets the target of which the color will be applied
        let target = args.find(x => /^(keyboard|mouse|both)$/i.test(x)) || "both";
        if (!target) throw new Error("You need to provida a valid target for the color to be applied onto!");

        return target;
    };

    return {
        color: parseColorArgument(),
        target: parseTargetArgument()
    };
}

// Execution
function main() {
    // Parse arguments
    let args = parseArguments();
    console.log(`Setting color rgb(${args.color.red}, ${args.color.green}, ${args.color.blue}) into ${args.target} device(s)`);

    // Set the keyboard color
    if (args.target == "keyboard" || args.target == "both") {
        console.log("Setting keyboard color...");
        keyboard(args.color);
    }

    // Set the mouse color
    if (args.target == "mouse" || args.target == "both") {
        console.log("Setting mouse color...");
        mouse(args.color);
    }

    console.log("Done!");
}

main();
