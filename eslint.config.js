module.exports = [
  {
    files: ["src/**/*.ts"],
    "extends": "airbnb-base",
    rules: {
      "no-console": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "never",
          "ts": "never"
        }
      ]
    },
    settings: {
      "import/resolver": {
        "node": {
          extensions: [".js", ".ts"]
        }
      }
    }
  }
];
