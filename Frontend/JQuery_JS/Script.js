
function createHeader() {
  $("HEADER").append($("<h1>").text("Ninja-Gaming").append("<br>").append("Dein Shop fürs Ausleihen und Kaufen von Games")).append($("<img id=titelbild>").attr("src","Bilder/Ninja.png")) 
}


function createNav() {
  $("DIV#nav").append($("<a>").attr("href","index.html").text("Startseite")).append($("<a>").attr("href","spielauswahl.html?spielplattformId=1").text("PS4"))
            .append($("<a>").attr("href","spielauswahl.html?spielplattformId=2").text("PC"))
            .append($("<a>").attr("href","spielauswahl.html?spielplattformId=3").text("XBOX"))
            .append($("<a>").attr("href","impressum.html").text("Impressum"))
            .append($("<a>").attr("href","kontakt.html").text("Kontakt"))
}

function createFooter() {
  $("FOOTER").append($("<div>").addClass("Footer_links").append($("<a>").attr("href","impressum.html").text("Impressum").append($("<br>")).append($("<br>")).append($("<a>").attr("href","kontakt.html").text("Kontakt"))
  .append($("<br>")).append($("<br>")).append($("<a>").attr("href","support.html").text("Support"))));

  $("FOOTER").append($("<div>").addClass("Footer_mitte").append($("<p>").text("Zahlungsarten: ")).append($("<br>")).append($("<img>").attr("src","Bilder/Paypal-logo.jpg")).append($("<img>").attr("src","Bilder/Barzahlung_logo.png")));

  $("FOOTER").append($("<div>").addClass("Footer_rechts").append($("<p>").text("Soziale Netzwerke:")).append($("<a>").attr("href","https://de-de.facebook.com/").append($("<img>").attr("src","Bilder/Facebook_logo.png")))
  .append($("<a>").attr("href","https://twitter.com/?lang=de").append($("<img>").attr("src","Bilder/Twitter_logo.png")))
  .append($("<a>").attr("href","https://www.instagram.com/").append($("<img>").attr("src","Bilder/Instagram_logo.jpg"))));

}

function search(val) {
  $.ajax({
      url: "http://localhost:8000/api/spiel/alle",
      method: "GET",
      dataType: "json"
  })
  .done(function(httpResponse) {
      var list = httpResponse.daten
      var resultlist = [];
      for (var i=0; i< list.length; i++) {
          //Makes exact Searchinput like "Cyberpunk 2077 (Day-One-Edition)" possible
          if (list[i].spielname.toLowerCase() === val.toLowerCase()) {
              resultlist.push(list[i]);
          }
          else if (list[i].spielname.toLowerCase().includes(val.toLowerCase())) {
              resultlist.push(list[i]);
          }
      }
      // //Makes "one word" - Searchinput like "Cyberpunk" or "Borderlands" possible
      // else if (list[i].spielname.split(' ')[0].toLowerCase() == val.toLowerCase()) {
      //         resultlist.push(list[i]);
      //     }
      
      if (resultlist.length == 0) {
          alert("Keine Spiel zur Suchanfrage gefunden! Bitte erneut versuchen!");
      }
      else if (resultlist.length == 1) {
          window.location.replace("kaufseite.html?spielId=" + resultlist[0].id);
      }
      else {
          var ids = "";
          for (var x=0; x < resultlist.length;x++){
              ids += resultlist[x].id  + " ";
          }
          window.location.replace("spielauswahl.html?ids=" + ids);
      }

  })
  .fail(function(jqXHR, statusText, error) {
      console.log(statusText);
      alert("Es ist ein Fehler aufgetreten");
  })
}

function createTopGames() {
    $.ajax({
            url: "http://localhost:8000/api/spiel/alle/erscheinungsdatum",
            method: "GET",
            dataType: "json"
        })
        .done(function(httpResponse) {
            var list = httpResponse.daten
            console.log(list.length);
            // Sorting list, latest games first in list
            // for (var i=0; i < list.length; i++) {
            //     for (var j=i+1; j < list.length; j++) {
            //         if (list[i].erscheinungsjahr < list[j].erscheinungsjahr) {
            //             var old = list[i];
            //             list[i] = list[j];
            //             list[j] = old;
            //         }
            //     }
            // }
            var anzahl;
            if (list.length > 5) {
                anzahl = 5
            }
            else {
                anzahl = list.length;
            }
            for (var i=0; i < anzahl; i++) {
                $("DIV#dyntarget").append(
                    $("<div>")
                        .addClass("elementmittig")
                        .append($("<a>").attr("href","kaufseite.html?spielId=" + list[i].id).append($("<img>").attr("src",list[i].bilder[0].bildpfad)))
                        .append($("<div>").addClass("PreisBeschreibungContainer").append($("<p>").addClass("Plattform").text("Plattform: ").append($("<strong>").text(list[i].spielplattform.name))).append($("<p>").addClass("Preis").text(toKomma(list[i].bruttokaufpreis) + "€" )).append($("<p>").addClass("Spielname").text(list[i].spielname)))
                        .append($("<div>").addClass("AnsehenContainer").append($("<a>").attr("href","kaufseite.html?spielId="+list[i].id).append($("<button>").addClass("ZumSpiel").text("Spiel ansehen")))));
            }
        })
        .fail(function(jqXHR, statusText, error) {
            console.log(statusText);
            alert("Es ist ein Fehler aufgetreten");
        })
  
}

function createPerson(obj) {
  $.ajax({
    url: "http://localhost:8000/api/person",
    method: "post",
    contentType: "application/json",
    data: JSON.stringify(obj)
    })
    .done(function (response) {
      console.log(response.daten.id)
        var id = toString(response.daten.id);
    })
    .fail(function (jqXHR, statusText, error) {
    console.log("Response Code: " + jqXHR.status + " - Fehlermeldung: " + jqXHR.responseText);
    });

}

// Ab hier ursüprünglich in sessionHandling.js gearbeitet

// refresh current page without any url-parameters
function refreshPage() {
  window.location = window.location.href.split("?")[0];
  console.log("Seite wurde neu ohne vorherige URL-Parameter geladen.")
}

function getBruttoSumfromBasket() {
  var bruttoSum = 0.0;
  for (var i=0; i< basket.length; i++) {
      if (basket[i].leihdauer === 0) {
          bruttoSum += basket[i].bruttokaufpreis;
      }
      else {
          bruttoSum += (basket[i].bruttoleihpreis * basket[i].leihdauer);
      }
  }
  console.log(bruttoSum);
  return bruttoSum;
}

function getNettoSumfromBasket() {
  var nettoSum = 0.0;
  for (var i=0; i< basket.length; i++) {
      if (basket[i].leihdauer === 0) {
          nettoSum += basket[i].kaufpreis;
      }
      else {
          nettoSum += (basket[i].leihpreis * basket[i].leihdauer);
      }
  }
  return nettoSum;
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

      // change the Sum/Price of the basket
      $("H4#nettopreis").text(toKomma((getBruttoSumfromBasket() - getNettoSumfromBasket()).toFixed(2)) + "€").append($('<h3 id="bruttopreis">').text(toKomma(getBruttoSumfromBasket().toFixed(2)) + '€'));
      
      console.log("Basket wurde um das gelöschte Spiel geschmälert, der Spielecontainer des Spiels wurde zertört: Basket=" + getSessionItem('basket'));

  }
}
