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

// refresh current page without any url-parameters
function refreshPage() {
    window.location = window.location.href.split("?")[0];
    console.log("Seite wurde neu ohne vorherige URL-Parameter geladen.")
}

// remove an element from the basket-object in current session respectively localStorage
function removeElementfromBasket(pos) {
    // destroys the whole basket-object in the localStorage because it´s the last element in the basket
    if (basket.length === 1) {
        removeSessionItem('basket');
    }
    // otherwise take the basket-object, pop the given element and daklare the popped basket as new basket
    else {
        basket.splice(pos,1);
        setJSONSessionItem('basket', basket);

        // grab the button which was pressed to delete the element and remove the container of the element (by getting the parentNodes of the button)
        var button = document.getElementById(pos);
        const container = button.parentNode.parentNode;
        container.remove();
        console.log("Basket wurde um das gelöschte Spiel geschmälert, der Spielecontainer des Spiels wurde zertört: Basket=" + getSessionItem('basket'));
    }
}