import { expect } from 'chai';
import { reducer, initialState } from '../reducers/reducer';
import * as actions from '../actions/actions';

describe('REDUCER', function () {
    it('it is a function', function () {
        expect(reducer).to.be.a('function');
    });
    describe('action INSERT_COIN', function () {
        it('updates the state correctly', function () {
            const action = actions.insertCoin(1);
            const newState = reducer(initialState, action);
            expect(newState.credit).to.equal(1);
        });
        it('updates float if coin is valid.', () => {
            let action = actions.insertCoin(1);
            let newState = reducer(initialState, action);
            expect(newState.float[1]).to.equal(11);

            action = actions.insertCoin(0.01);
            newState = reducer(initialState, action);
            expect(newState).to.equal(initialState);
        });
        it('is immutable', () => {
            const action = actions.insertCoin(1);
            const newState = reducer(initialState, action);
            expect(newState).to.not.eql(initialState);
        });
    });
    describe('action REPLENISH_STOCK', () => {
        it('adds qty to existing stock', () => {
            const row = 'A1';
            const action = actions.replenishStock(row, 10);
            const newState = reducer(initialState, action);
            expect(newState.stock[row].quantity).to.equal(20);
        });
        it('is immutable', () => {
            const row = 'A1';
            const action = actions.replenishStock(row, 10);
            const newState = reducer(initialState, action);
            expect(newState).to.not.eql(initialState);
            expect(newState.stock).to.not.eql(initialState.stock);
            expect(newState.stock[row]).to.not.eql(initialState.stock[row]);
        });
    });
    describe('action INPUT_SELECTION', () => {
        it('update selection', () => {
            actions.insertCoin(1);
            const row = 'A1';
            const action = actions.inputSelection(row);
            const newState = reducer(initialState, action);
            expect(newState.selection).to.equal('A1');
        });
        it('return error message for insufficient credit', () => {
            const action1 = actions.insertCoin(0.5);
            const newState1 = reducer(initialState, action1);
            const row = 'A1';
            const action2 = actions.inputSelection(row);
            const newState2 = reducer(newState1, action2);
            expect(newState2.selection).to.equal('A1');
            expect(newState2.displayMessage).to.equal('Soz, needz more moneyz bra');
        });
        it('adds item to dispensory tray & decrements the stock accordingly', () => {
            actions.insertCoin(1);
            const row = 'A1';
            const action = actions.inputSelection(row);
            const newState = reducer(initialState, action);
            expect(newState.productDispenser).to.equal(newState.stock[row].name);
            expect(newState.stock[row].quantity).to.equal(initialState.stock[row].quantity - 1);
        });
        it('deduct from credit', () => {
            const action1 = actions.insertCoin(1);
            const newState1 = reducer(initialState, action1);
            const row = 'A1';
            const action2 = actions.inputSelection(row);
            const newState2 = reducer(newState1, action2);
            expect(newState2.credit).to.eql(0.15);
        });
    });
    describe('action GIVE_CHANGE', () => {
        it('gives change', () => {
            const action1 = actions.insertCoin(1);
            const action2 = actions.giveChange();
            const newState1 = reducer(initialState, action1);
            const newState2 = reducer(newState1, action2);

            expect(newState2.credit).to.equal(0);
            expect(newState2.float[1]).to.equal(10);
        });
    });
});
