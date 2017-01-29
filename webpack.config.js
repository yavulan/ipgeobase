var path = require('path');

module.exports = {
    entry: ['whatwg-fetch', "./src/webpack.entry.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "ipgeobase.js",
        library: "IpGeoBase",
        libraryTarget: "umd"

    }
}
