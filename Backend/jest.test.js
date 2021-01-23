const { TestScheduler } = require("jest");
const {concatArray} = require("./helper");
const {loadById} = require("./dao/bestellpositionDao");
const BestellpositionDao = require("./dao/bestellpositionDao");
const {toKomma} = require("../Frontend/JQuery_JS/Script");
const { getBruttoSumfromBasket, getNettoSumfromBasket, createPerson } = require("../Frontend/JQuery_JS/Script");

test("Wird einen Array zurückgeben", () => {
    var array1 = ["hallo", "Welt", 123];
    const array2 = concatArray(array1);
    expect(array2).toBe("hallo, Welt, 123");
})

test("Zahl auf Zahl zwei Nachkommastellen umwandeln", () => {
    const z = toKomma(30);
    expect(z).toBe("30,00");
})

test("Sollte die Bruttosumme zurückgeben", () => {
    basket = [
        {
            "bruttokaufpreis" : 50,
            "bruttoleihpreis" : 5,
            "leihdauer" : 5
        },
        {
            "bruttokaufpreis" : 60,
            "bruttoleihpreis" : 6,
            "leihdauer" : 2
        },
        {
            "bruttokaufpreis" : 40,
            "bruttoleihpreis" : 4,
            "leihdauer" : 0
        }
    ]

    const erg = getBruttoSumfromBasket();
    expect(erg).toBe(77);
})

test ("wird die Nettosumme ausgeben", () => {
    basket = [
        {
            "kaufpreis" : 42,
            "leihpreis" : 4.8,
            "leihdauer" : 5
        },
        {
            "kaufpreis" : 50.4,
            "leihpreis" : 5.6,
            "leihdauer" : 2
        },
        {
            "kaufpreis" : 34,
            "leihpreis" : 3.9,
            "leihdauer" : 0
        }
    ]

    const erg = getNettoSumfromBasket();
    expect(erg).toBe(69.2);
})



