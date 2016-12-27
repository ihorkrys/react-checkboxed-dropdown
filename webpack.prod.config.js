var path = require("path");
var webpack = require("webpack");
var StyleLintPlugin = require("stylelint-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    "react-checkboxed-dropdown": "./src/js/select-box.js"
  },
  output: {
    library: "ReactCheckboxedDropdown",
    libraryTarget: "umd",
    filename: "react-checkboxed-dropdown.js",
    path: "dist"
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
  ],
  module: {
    preLoaders: [
      { test: /\.json$/, loader: "json"},
      {
        test: /\.js$/,
        loader: "eslint",
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        loader: "babel-loader",

        exclude: /node_modules/,
        // Only run `.js` and `.jsx` files through Babel
        test: /\.js?$/,

        // Options to configure babel with
        query: {
          presets: ["es2015", "react"]
        }
      },
      {
        test: /\.s?css$/,
        loader: "style-loader!css-loader!postcss-loader?sourceMap=inline"
      }
    ]
  },
  externals: {
    react: 'react',
    'react/addons': 'react'
  },
  eslint: {
    configFile: ".eslintrc",
    failOnError: true
  },
  postcss: function () {
    return [
      require("postcss-import"),
      require("precss"),
      require("postcss-assets")({
        relative: path.resolve(__dirname, "css"),
        loadPaths: ["images/"]
      }),
      require("autoprefixer")
    ];
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      verbose: true,
      dry: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      exclude: /node_modules/
    }),
    new StyleLintPlugin({
      configFile: ".stylelintrc",
      files: "/src/css/**/*.scss",
      failOnError: true
    })
  ],
  watchOptions: {
    aggregateTimeout: 100
  }
};