module.exports = {
    "env": {
        "browser": true,
        "es6": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        }
    },
    "plugins": [
        "react"
    ],
    "globals": {
      "Lingu": true,
      "LinguLocalStore": true,
      "it": true,
      "describe": true,
      "require": true,
      "global": true,
      "module": true,
      "before": true,
      "after": true
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
