import path from "path"
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                
                use: 'babel-loader'
            },{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(svg|png|jpeg|jpg|webp|avif)$/i,
                // type: 'asset/resource',
                use:{
                    loader: "file-loader",
                    options: {
                    name: "[name].[ext]",
                    outputPath: "imgs"
                    }
                }
            }
              
        ]

    },
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    plugins: [new HtmlWebpackPlugin({
        template: './public/index.html'
    })],
    mode: "development"
}
