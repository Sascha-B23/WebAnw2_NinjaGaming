const { exportAllDeclaration } = require('@babel/types');
const { timeStamp } = require('console');
const { getBruttoSumfromBasket } = require('Script.js');

test("Sollte die Bruttosumme im Warenkorb ausgeben", () => {
    const bruttoSum = getBruttoSumfromBasket();
    expect(bruttoSum).toBe(0);

})