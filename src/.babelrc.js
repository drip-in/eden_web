module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { targets: { browsers: "last 2 versions" } } // or whatever your project requires
    ],
    "@babel/preset-react"
  ],
  plugins: [
    // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    ["@babel/plugin-proposal-private-methods", { loose: true }],
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true // `style: true` 会加载 less 文件
      }
    ],
    "react-hot-loader/babel"
  ]
};
