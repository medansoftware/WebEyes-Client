var library = 'WebEyes';
var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var jQuery = require('jquery');

module.exports = (env = 'development') => {

	env = (env.production == true)?'production':'development';
	let config = {
		target: 'web',
		mode: (env.production == true)?'production':'development',
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})
		],
		optimization: {
			minimizer: []
		},
		entry: {
			WebEyes: path.resolve(__dirname, './src/WebEyes.js')
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
			library: library,
			libraryTarget: 'umd',
			libraryExport: 'default',
			umdNamedDefine: true
		},
		performance: {
			hints: (env.production == true) ? 'warning' : false
		},
		module: {
			rules: [
				{
					test: /\.(ogg|mp3|wav|mpe?g)$/i,
					exclude: /(node_modules|bower_components)/,
					loader: 'url-loader',
					options: {
						esModule: false
					}
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				}
			]
		}
	}

	if (env == 'production') {
		/**
		 * copy .htaccess to output directory
		 */
		config.plugins.push(
			new CopyPlugin({
				patterns: [
					{ from: path.resolve(__dirname, 'src', '.htaccess'), to: '.' }
				],
			}),
		);
	}

	return config;
}