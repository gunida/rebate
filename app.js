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

async function processOrders() {
    var files = fs.readdirSync(path.resolve(...inputPath));

    files.forEach(file => {
        fs.createReadStream(path.resolve(...inputPath, file))
            .pipe(csv.parse({headers:true}))
            .on('error', error => console.error(error))
            .on('data', row => console.log(orderHandler.processOrder(row)))
            .on('end', () => finished(file));   
    });
}

async function finished(file) {
    var inputFilePath = path.resolve(...inputPath, file);
    var processedDir = path.resolve(...processedPath);
    var processedFilePath = path.resolve(...processedPath, file);
    fs.mkdir(processedDir, () => {
        fs.copyFile(inputFilePath, processedFilePath, () => {
            fs.rm(inputFilePath, () => {
            });
        });
    });
}
