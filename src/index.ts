#! /usr/bin/env node
console.log("Hello World! Wassup?");
console.log(process.argv);

if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
}

// Check to see if the -f argument is present
const flag = (
    process.argv.indexOf('-f') > -1 ? 'Flag is present.' : 'Flag is not present.'
);

// Checks for --custom and if it has a value
const customIndex = process.argv.indexOf('--custom');
let customValue;

if (customIndex > -1) {
    // Retrieve the value after --custom
    customValue = process.argv[customIndex + 1];
}

const custom = (customValue || 'Default');

console.log('Flag:', `${flag}`);
console.log('Custom:', `${custom}`);
