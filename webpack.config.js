const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
    const config = {
        entry: "./app/main.js",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist"),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [{
                    from: "views",
                    to: "views"
                }]
            }),
            new HtmlWebpackPlugin({
                title: "Paris Events",
                template: "index.html",
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: "asset/resource",
                },
            ],
        },
    }
    if(argv.mode === "developement") {
        config.devtool = "source-map";
    }
    return config;
};
