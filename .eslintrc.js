module.exports = {
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "module"
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "google"
    ],
    "rules": {
        "no-console": [
            "error",
            {
                "allow": [
                    "warn",
                    "error",
                    "log"
                ]
            }
        ],
        "indent": ["error", 4],
        "object-curly-spacing": ["error", "always"]
    }
};
