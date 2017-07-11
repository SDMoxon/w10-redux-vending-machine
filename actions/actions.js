import * as types from './types';

export function insertCoin (coin) {
    return {
        type: types.INSERT_COIN,
        coin
    };
}

export function replenishStock (quantity) {
    return {
        type: types.REPLENISH_STOCK,
        quantity
    }
}