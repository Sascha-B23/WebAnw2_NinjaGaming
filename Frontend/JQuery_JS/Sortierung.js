
function toKomma(val) {
    var n = val.toString();
    if (n.length === 2) {
        return n + ",00";
    }
    else if (n.length === 1) {
        return "0" + n + ",00";
    }
    else if (n.length === 0) {
        return "fehler";
    }
    else {
        var splits = n.split(".");
        if (splits[1].length === 1) {
            splits[1] += "0";
        }
        var nummer = splits[0] + ","  + splits[1];
        return nummer;
    }
}

function createGamesView(list) {
    content = '';
    for (var i=0; i < list.length; i++) {
        // $('DIV#SpieleContainer').append($('<div>').addClass("spiel").text(list[i].spielname)) -- Erste "einfache" Methode gewählt, weil übersichtlicher
        content += '<div class="spiel">';
        content += '<a href="kaufseite.html?spielId=' + list[i].id + '"><img class="spielanzeige" src="' + list[i].bilder[0].bildpfad + '" alt="Spiel"/></a>';
        content += '<div class="spielbeschreibung">';
        content += '<h3>' + list[i].spielname + '</h3>';
        content += '<h4>Genre: ' + list[i].genre.name + '</h4>';
        content += '<h4>Erscheinungsjahr: ' + list[i].erscheinungsjahr + '</h4>';
        content += '<p>' + list[i].beschreibung + '</p>';
        content += '</div>';
        content += '<div class="rechterContainer">';
        content += '<h3>Spiel jetzt erwerben:</h3>';
        if (list[i].kaufart.id == 1 || list[i].kaufart.id == 3) {
            content += '<a href="kaufseite.html?spielId='+ list[i].id + '"><button class="ZumSpiel">Jetzt kaufen für ' + toKomma(list[i].bruttokaufpreis)+ '€</button></a>';
        }
        else {
            content += '<a href="kaufseite.html?spielId='+ list[i].id + '"><button class="ZumSpiel" disabled>Jetzt kaufen für ' + toKomma(list[i].bruttokaufpreis) + '€</button></a>';
        }
        if (list[i].kaufart.id == 2 || list[i].kaufart.id == 3) {
            content += '<a href="kaufseite.html?spielId='+ list[i].id + '"><button class="ZumSpiel" >Jetzt leihen für '+ toKomma(list[i].bruttoleihpreis) + '€/Tag</button></a>';
        }
        else {
            content += '<a href="kaufseite.html?spielId='+ list[i].id + '"><button class="ZumSpiel" disabled>Jetzt leihen für '+ toKomma(list[i].bruttoleihpreis) + '€/Tag</button></a>';;
        }
        content += '</div>';
        content += '</div>';
        $('DIV#SpieleContainer').html(content);
    }
}

// If Option in Select-Bar changes, sorting list and rendering html in proper sequence.
function sortGames() {
    var id = getUrlParameterValue('spielplattformId');
    var x = document.getElementById("sortierung").value;
    switch(x) {
        case "PreisAuf":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deleted DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                // Sorting result list to highest price.
                var list = httpResponse.daten;
                for (var i=0; i < list.length; i++) {
                    for (var j=i+1; j < list.length; j++) {
                        if (list[i].bruttokaufpreis > list[j].bruttokaufpreis) {
                            var old = list[i];
                            list[i] = list[j];
                            list[j] = old;
                        }
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), PreisAuf.");
            })
        break;

        case "PreisAB":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deletet DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                // Sorting result list to lowest price.
                var list = httpResponse.daten;
                for (var i=0; i < list.length; i++) {
                    for (var j=i+1; j < list.length; j++) {
                        if (list[i].bruttokaufpreis < list[j].bruttokaufpreis) {
                            var old = list[i];
                            list[i] = list[j];
                            list[j] = old;
                        }
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), PreisAB.");
            })
        break;

        case "ErscheinungsdatumAuf":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deletet DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                var list = httpResponse.daten;
                // Sorting result list to highest year.
                for (var i=0; i < list.length; i++) {
                    for (var j=i+1; j < list.length; j++) {
                        if (list[i].erscheinungsjahr > list[j].erscheinungsjahr) {
                            var old = list[i];
                            list[i] = list[j];
                            list[j] = old;
                        }
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), ErscheinungsdatumAuf.");
            })
        break;
        
        case "ErscheinungsdatumAb":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deletet DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                var list = httpResponse.daten;
                // Sorting result list to lowest year.
                for (var i=0; i < list.length; i++) {
                    for (var j=i+1; j < list.length; j++) {
                        if (list[i].erscheinungsjahr < list[j].erscheinungsjahr) {
                            var old = list[i];
                            list[i] = list[j];
                            list[j] = old;
                        }
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), ErscheinungsdatumAb.");
            })
        break;

        case "NurKaufen":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deletet DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                var list = httpResponse.daten;
                // Deleting non-purchaseable Games from list 
                for (var i=0; i < list.length; i++) {
                    if (list[i].kaufart.id == 2) {
                        list.splice(i,1);
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), NurKaufen.");
            })
        break;

        case "NurLeihen":
            $.ajax({
                // Ajax-Call, getting current list of games from database. (Important in case of deletet DOM-Elemets after "NurKaufen"/"NurLeihen").
                url: "http://localhost:8000/api/spiel/plattform/" + id,
                method: "GET",
                dataType: "json"
            })
            .done(function(httpResponse) {
                var list = httpResponse.daten;
                // Deleting non-borrowable Games from list 
                for (var i=0; i < list.length; i++) {
                    if (list[i].kaufart.id == 1) {
                        list.splice(i,1);
                    }
                }
                // Creating HTML Elements
                createGamesView(list);
            })
            .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Fehler bei Methode sortGames(), NurLeihen.");
            })
    }
  }
