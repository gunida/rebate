const { expect, test } = require('@jest/globals');
const handler = require('./orderHandler');

test('Should add the correct amount of organs to order', () => {
    expect(handler.processOrder({organ: "liver", cash: 10, price: 5, bonus_ratio: 2})).toEqual({heart: 0, liver: 2, lung: 1});
    expect(handler.processOrder({organ: "heart", cash: 10, price: 3, bonus_ratio: 3})).toEqual({heart: 4, liver: 0, lung: 0});
    expect(handler.processOrder({organ: "lung", cash: 25, price: 3, bonus_ratio: 4})).toEqual({heart: 2, liver: 2, lung: 8});
});

test('Should handle problematic orders', () => {
    expect(handler.processOrder({organ: "lung", cash: 25, price: 5, bonus_ratio: 0})).toEqual({heart: 0, liver: 0, lung: 5});
    expect(handler.processOrder({organ: "lung", cash: 0, price: 5, bonus_ratio: 1})).toEqual({heart: 0, liver: 0, lung: 0});
});

test('Should throw errors', () => {
    expect(() => handler.processOrder({organ: "lung", cash: 100, price: 0, bonus_ratio: 1})).toThrow(Error);
    expect(() => handler.processOrder({organ: "heart", cash: -100, price: 33, bonus_ratio: 3})).toThrow(Error);
    expect(() => handler.processOrder({organ: "liver", cash: 20, price: -5, bonus_ratio: 1})).toThrow(Error);
    expect(() => handler.processOrder({organ: "brain", cash: 10, price: 5, bonus_ratio: 0})).toThrow(Error);
});

test('Should add correct amount of bonus organs', () => {
    expect(handler.addBonusesToOrder(["heart", "liver"], 2)).toEqual({"heart": 2, "liver": 2});
    expect(handler.addBonusesToOrder(["lung"], 1)).toEqual({"lung": 1});
});

test('Should return the correct amount of items based on price and cash', () => {
    expect(handler.checkCash(10, 3)).toBe(3);
    expect(handler.checkCash(10, 5)).toBe(2);
    expect(handler.checkCash(10, 6)).toBe(1);
    expect(handler.checkCash(10, 11)).toBe(0);
});
