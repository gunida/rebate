const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const orderHandler = require('./orderHandler');

const inputPath = [__dirname, 'input'];
const processedPath = [__dirname, 'processed'];

try {
    processOrders();
} catch (error) {
    console.error(error);
}

function processOrders() {
    var files = fs.readdirSync(path.resolve(...inputPath));

    files.forEach(file => {
        fs.createReadStream(path.resolve(...inputPath, file))
            .pipe(csv.parse({headers:true}))
            .on('error', error => console.error(error))
            .on('data', row => console.log(orderHandler.processOrder(row)))
            .on('end', rowCount => finished(file, rowCount));   
    });
}

function finished(file, rowCount) {
    fs.copyFile(path.resolve(...inputPath, file), path.resolve(...processedPath, file), () => {
        fs.rm(path.resolve(...inputPath, file), () => {
            // console.log(`Parsed ${rowCount} rows`);
        });
    });
}
