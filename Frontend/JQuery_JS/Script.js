
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