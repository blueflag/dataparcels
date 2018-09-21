// @flow
module.exports = {
    preset: 'blueflag-test',
    collectCoverageFrom: [
        "packages/**/*.{js,jsx}",
        "!**/lib/**",
        "!**/node_modules/**",
        "!packages/dataparcels-docs/**"
    ],
    testMatch: ["**/__test__/**/*-test.js?(x)"],
    testURL: 'http://localhost'
};