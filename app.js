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
        fs.createReadStream(path.resolve(...inputPath, file))
            .pipe(csv.parse({headers:true}))
            .on('error', error => console.error(error))
            .on('data', row => console.log(processOrder(row)))
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

function processOrder(row) {
    var orderResult = {};
    config.organs.map((v) => {
        orderResult[v] = 0
    });

    var purchasedOrgans = checkCash(row.cash, row.price);
    orderResult[row.organ] += purchasedOrgans;

    var bonusMultiplier = Math.floor(purchasedOrgans / row.bonus_ratio);
    var bonusResult = addBonusesToOrder(config.bonuses[row.organ], bonusMultiplier);
    for (const organ in bonusResult) {
        if (Object.hasOwnProperty.call(bonusResult, organ)) {
            const bonusAmount = bonusResult[organ];
            orderResult[organ] += bonusAmount;
        }
    }

    return orderResult;
}

function checkCash(cash, price) {
    var purchasedAmout = Math.floor(cash / price);
    
    return purchasedAmout;
}

function addBonusesToOrder(bonusOrgans, bonusMultiplier) {
    if (bonusOrgans && bonusMultiplier > 0) {
        var orderResult = {};
        for (let i = 0; i < bonusOrgans.length; i++) {
            const organ = bonusOrgans[i];
            if (!orderResult[organ])
                orderResult[organ] = 0;

            orderResult[organ] += bonusMultiplier;
        } 
    }
    return orderResult;
}

module.exports = {
    processOrder,
    addBonusesToOrder,
    checkCash
}