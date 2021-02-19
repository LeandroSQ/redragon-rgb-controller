module.exports = {

    /**
     * Covert a hex type string into an split channel color RGB format
     *
     * @param {String} hex
     * @returns {Object} color The parsed color in the RGB format
     * @returns {number} color.red The red channel
     * @returns {number} color.green The green channel
     * @returns {number} color.blue The blue channel
     **/
    hexToRgb(hex) {
        if (!hex.startsWith("#")) hex = "#" + hex;

        let [red, green, blue] = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16));
        return { red, green, blue };
    }

};