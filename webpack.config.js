const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const AngularWebpackPlugin = require('@ngtools/webpack').AngularWebpackPlugin;

module.exports = {
    mode: "development",
    devtool: false,
    // абсолютный путь , для разрешения точек входа и загрузчиков из конфигурации.
    context: path.resolve(__dirname),
    entry: {
        app: path.resolve(__dirname, "src/main.ts"),
    },
    // опция позволяет вам точно контролировать, какая информация о пакете будет отображаться
    stats: 'normal',
    output: {
        clean: true,
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.?(svg|html)$/,
                resourceQuery: /\?ngResource/,
                type: "asset/source"
            },
            {
                test: /\.[cm]?[tj]sx?$/,
                exclude: /\/node_modules\//,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            compact: true,
                            plugins: ["@angular/compiler-cli/linker/babel"],
                        },
                    },
                    {
                        loader: "@angular-devkit/build-angular/src/babel/webpack-loader",
                        options: {
                            aot: true,
                            optimize: true,
                            scriptTarget: 7
                        }
                    },
                    {
                        loader: '@ngtools/webpack',
                    },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, "dist", "index.html"),
            template: path.resolve(__dirname, "src/index.html")
        }),
        /* new CopyPlugin({
            patterns: [
                {
                    from: "**//*.html",
                    to: path.resolve(__dirname, "dist", "[name].html"),
                    context: "src/app/"
                }
            ]
        }), */
        new AngularWebpackPlugin({
            tsconfig: path.resolve(__dirname, "tsconfig.json"),
            jitMode: false,
            directTemplateLoading: true
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: Infinity,
            minSize: 0,
            name: "vendor"
        }
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        port: 4200,
        hot: true,
        open: false
    }
}