const config = require('./config.json');

function processOrder(row) {
    var orderResult = {};
    config.organs.map((v) => {
        orderResult[v] = 0
    });

    if (row.price <= 0)
    {
        throw new Error('Organ has 0 price');
    }
    if (row.cash < 0)
    {
        throw new Error('Negative cash');
    }
    if (config.organs.indexOf(row.organ) == -1)
    {
        throw new Error('Organ doesn\'t exist in system');
    }

    var purchasedOrgans = checkCash(row.cash, row.price);
    orderResult[row.organ] += purchasedOrgans;

    var bonusMultiplier = row.bonus_ratio <= 0 ? 0 : Math.floor(purchasedOrgans / row.bonus_ratio);
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