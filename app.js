const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

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
        console.log('Processing ' + file);

        fs.createReadStream(path.resolve(...inputPath, file))
            .pipe(csv.parse({headers:true}))
            .on('error', error => console.error(error))
            .on('data', row => processOrder(row).catch(error => console.error(error)))
            .on('end', rowCount => finished(file, rowCount));   
    });
}

function finished(file, rowCount) {
    fs.copyFile(path.resolve(...inputPath, file), path.resolve(...processedPath, file), () => {
        fs.rm(path.resolve(...inputPath, file), () => {
            console.log(`Parsed ${rowCount} rows`);
        });
    });
}

async function processOrder(row) {
    console.log('Processing order', row.organ, row.cash, row.price, row.bonus_ratio);
    var orderResult = {};
    config.organs.map((v) => {
        orderResult[v] = 0
    });

    var purchasedAmout = Math.floor(row.cash / row.price);
    var bonusAmount = Math.floor(purchasedAmout / row.bonus_ratio);
    var bonusOrgan = config.bonuses[row.organ];
    orderResult[row.organ] += purchasedAmout;
    
    if (bonusOrgan) {
        for (let i = 0; i < bonusOrgan.length; i++) {
            const organ = bonusOrgan[i];
            orderResult[organ] += bonusAmount;
        }
    }   

    console.log(orderResult);
}


