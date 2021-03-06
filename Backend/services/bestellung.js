const helper = require("../helper.js");
const BestellungDao = require("../dao/bestellungDao.js");
const express = require("express");
var serviceRouter = express.Router();
var nodemailer = require('nodemailer');
const SpielDao = require("../dao/spielDao");

serviceRouter.get("/bestellung/gib/:id", function(request, response) {
    helper.log("Service Bestellung: Client requested one record, id=" + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var result = bestellungDao.loadById(request.params.id);
        helper.log("Service Bestellung: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bestellung: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


serviceRouter.get("/bestellung/alle/", function(request, response) {
    helper.log("Service Bestellung: Client requested all records");

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var result = bestellungDao.loadAll();
        helper.log("Service Bestellung: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bestellung: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/bestellung/existiert/:id", function(request, response) {
    helper.log("Service Bestellung: Client requested check, if record exists, id=" + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var result = bestellungDao.exists(request.params.id);
        helper.log("Service Bestellung: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Bestellung: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/bestellung", function(request, response) {
    helper.log("Service Bestellung: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.bestellzeitpunkt)) {
        request.body.bestellzeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.bestellzeitpunkt)) {
        errorMsgs.push("bestellzeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss");
    } else {
        request.body.bestellzeitpunkt = helper.parseGermanDateTimeString(request.body.bestellzeitpunkt);
    }
    if (helper.isUndefined(request.body.bestellerid)) {
        errorMsgs.push("besteller nicht gesetz");
        request.body.besteller = null;
    } else if (helper.isUndefined(request.body.bestellerid)) {
        errorMsgs.push("besteller gesetzt, aber id fehlt");
    } else {
        request.body.besteller = request.body.bestellerid;
    }
    if (helper.isUndefined(request.body.zahlungsartid)) {
        errorMsgs.push("zahlungsart fehlt");
    } else if (helper.isUndefined(request.body.zahlungsartid)) {
        errorMsgs.push("zahlungsart gesetzt, aber id fehlt");
    }
    if (helper.isUndefined(request.body.bestellpositionen)) {
        errorMsgs.push("bestellpositionen fehlen");
    } else if (!helper.isArray(request.body.bestellpositionen)) {
        errorMsgs.push("bestellpositionen ist kein array");
    } else if (request.body.bestellpositionen.length == 0) {
        errorMsgs.push("bestellpositionen is leer, nichts zu speichern");
    }
    if(helper.isUndefined(request.body.email)) {
        errorMsgs.push("Email wurde nicht angegeben.");
    }
    if (errorMsgs.length > 0) {
        helper.log("Service Bestellung: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    const spielDao = new SpielDao(request.app.locals.dbConnection);     //Neue Spielklasse muss erzeugt werden, um die Spielnamen auszulesen
    try {
        var result = bestellungDao.create(request.body.bestellzeitpunkt, request.body.bestellerid, request.body.zahlungsartid, request.body.bestellpositionen);
        helper.log("Service Bestellung: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));

        // Array erzeugen, das die Spielenamen aufnehmen soll, die dann später in der Bestell-Email angezeigt werden sollen,
        // also Iterieren durch die Bestellpositionen und das zugehörige spiel erzeugen und den Spielnamen in den Array pushen
        var spiele = [];
        for (var i=0; i < request.body.bestellpositionen.length; i++) {
            helper.log(request.body.bestellpositionen[i]);
            var spiel = spielDao.loadById(request.body.bestellpositionen[i].spielid);
            spiele.push(spiel.spielname);
        }
        if (spiele.length == 0) {
            helper.log
            return 
        }
        var datum = JSON.stringify(request.body.bestellzeitpunkt).split("T");
        helper.log("Service Bestellung: Creating Email to Customer-Email .....");
        // Hier wird die Email mit Hilfe des Nodemailer-Moduls zusammengesetzt, die Kunden-Email Adresse wird im Request übergeben!
        
        //Login in den eigenen Email-Dienst
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ninja.gamingshoprequest@gmail.com',
              pass: 'ninjagaming123'
            }
          });
        
        //Email spezifizieren, an den Kunden, zur Bestellung
        var mailOptions = {
            from: 'ninja.gamingshoprequest@gmail.com',
            to: request.body.email,
            subject: 'Ihre Bestellung vom ' + datum[0] + '" auf Ninja-Gaming zu ihrer Bestellnummer: 00000' + result.id,
            html:   "<h1 style='color:blue;'>Vielen Dank für ihre Bestellung!</h1>" + 
                    "<h3>Ihr Auftrag ist bei uns eingegangen und wird schnellstmöglich von unserem Team bearbeitet</h3>" +
                    "<br><br><h3><h3 style='color:red;'>!Achtung! </h3> Bei Zahlungsart 'PayPal' überweisen sie bitte den Rechnungsbetrag an ninjagaming.pay@gmail.com und geben sie die Bestellnummer: 00000" + result.id + " mit an.</h3>"+
                    "<br><br><h4>Sie haben folgende Spiele bestellt: " + spiele + "</h4>" + 
                    "<br><br><p>Die Spiele sind voraussichtlich nach 5 Werktagen bei uns im Shop abholbereit!</p>" + 
                    "<a href='https://www.google.de/maps/place/Hochschule+Albstadt-Sigmaringen/@48.2103249,9.023931,15z/data=!4m5!3m4!1s0x479a1a9b989fc92d:0xc5484b887030f0ab!8m2!3d48.2103249!4d9.0326857'>Anfahrt Ninja-Gaming Shop</a>" +
                    "<br><br><p>Aufgrund der aktuellen Lage bitten wir Sie bei der Abholung die aktuell geltenden Corona-Maßnahmen einzuhalten.<br>" + 
                    "Falls Sie weitere Fragen haben kontaktieren Sie uns über unseren Support.<br><br>Vielen Dank, <br>Ihr Ninja-Gaming Team</p>"
          };
          
          //Absenden der Mail
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              helper.log("Email couldn´t be sent or created: " + error);
            } else {
              helper.log('Email sent: ' + info.response);
            }
          });
        return result.id;
    } catch (ex) {
        helper.logError("Service Bestellung: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put("/bestellung", function(request, response) {
    helper.log("Service Bestellung: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.bestellzeitpunkt)) {
        request.body.bestellzeitpunkt = helper.getNow();
    } else if (!helper.isGermanDateTimeFormat(request.body.bestellzeitpunkt)) {
        errorMsgs.push("bestellzeitpunkt hat das falsche Format, erlaubt: dd.mm.jjjj hh.mm.ss");
    } else {
        request.body.bestellzeitpunkt = helper.parseGermanDateTimeString(request.body.bestellzeitpunkt);
    }
    if (helper.isUndefined(request.body.besteller)) {
        request.body.besteller = null;
    } else if (helper.isUndefined(request.body.besteller.id)) {
        errorMsgs.push("besteller gesetzt, aber id fehlt");
    } else {
        request.body.besteller = request.body.besteller.id;
    }
    if (helper.isUndefined(request.body.zahlungsart)) {
        errorMsgs.push("zahlungsart fehlt");
    } else if (helper.isUndefined(request.body.zahlungsart.id)) {
        errorMsgs.push("zahlungsart gesetzt, aber id fehlt");
    }
    if (helper.isUndefined(request.body.bestellpositionen)) {
        errorMsgs.push("bestellpositionen fehlen");
    } else if (!helper.isArray(request.body.bestellpositionen)) {
        errorMsgs.push("bestellpositionen ist kein array");
    } else if (request.body.bestellpositionen.length == 0) {
        errorMsgs.push("bestellpositionen is leer, nichts zu speichern");
    }

    if (errorMsgs.length > 0) {
        helper.log("Service Bestellung: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var result = bestellungDao.update(request.body.id, request.body.bestellzeitpunkt, request.body.besteller, request.body.zahlungsart.id, request.body.bestellpositionen);
        helper.log("Service Bestellung: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Bestellung: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }  

});

serviceRouter.delete("/bestellung/:id", function(request, response) {
    helper.log("Service Bestellung: Client requested deletion of record, id=" + request.params.id);

    const bestellungDao = new BestellungDao(request.app.locals.dbConnection);
    try {
        var obj = bestellungDao.loadById(request.params.id);
        bestellungDao.delete(request.params.id);
        helper.log("Service Bestellung: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Bestellung: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;