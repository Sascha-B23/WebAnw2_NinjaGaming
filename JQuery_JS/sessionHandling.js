// sets or overwrites an value in local storage
function setSessionItem(label, value) {
    localStorage.setItem(label, value);
}

// retreives an value from localStorage by label
// returns null if not existent
function getSessionItem(label) {
    return localStorage.getItem(label);
}

// checks, if an item exists in local storage
function existsSessionItem(label) {
    return !isNullOrUndefined(getSessionItem(label));
}

// sets or overwrites an json object as value to local storage
function setJSONSessionItem(label, jsonValue) {
    var jsonstring = JSON.stringify(jsonValue);
    setSessionItem(label, jsonstring);
}

// retreives an json object from local storage
// if not existent returns null
// if json string converts to json object
function getJSONSessionItem(label) {
    var val = getSessionItem(label);

    // if undefined (not existent), return undefined
    if (isNullOrUndefined(val)) 
        return val;

    // if json string, convert and return as json object
    if (isJSONString(val)) 
        return tryParseJSONString(val);

    // otherwise return as string
    return val;
}

// removes a session item by label
function removeSessionItem(label) {
    localStorage.removeItem(label);
    if (label == "basket") {
        $("DIV.warenkorb_spiel").remove();
        $("DIV.gesamtpreis_warenkorb").remove();
        $("BUTTON.warenkorb_leeren").remove();
        $("BUTTON#WarenkorbzurKasse").attr("disabled", "disabled");
        $('DIV#test').append($('<h2>').addClass('warenkorb_leer').text('Der Warenkorb ist leer'));
        console.log("Basket wurde gelöscht: Exists Session Item?=" + existsSessionItem(basket));
    }
}

// clears complete session / deletes all session items
function clearSession() {
    localStorage.clear();
}

// try parse JSON string
// returns false if no json string otherwise the JSON object
function tryParseJSONString(str) {
    try {
        var obj = JSON.parse(str);
        if (obj && typeof obj === "object") 
            return obj;
    } catch (e) { }
    return false;
}

// check if given string is a json string
function isJSONString(str) {
    return tryParseJSONString(str) != false;
}

// function checks if given value is null or undefined
function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

