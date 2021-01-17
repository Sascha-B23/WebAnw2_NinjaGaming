const helper = require("../helper.js");
const SpielDao = require("../dao/SpielDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/spiel/gib/:id", function(request, response) {
    helper.log("Service Spiel: Client requested one record, id=" + request.params.id);

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.loadById(request.params.id);
        helper.log("Service Spiel: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/spiel/plattform/:id", function(request, response) {
    helper.log("Service Spiel: Client requested one record, id=" + request.params.id);

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.loadByPlatform(request.params.id);
        helper.log("Service Spiel: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/spiel/alle/erscheinungsdatum", function(request, response) {
    helper.log("Service Spiel: Client requestet the latest Games.");

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.loadByDate();
        helper.log("Service Spiel: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
})

serviceRouter.get("/spiel/alle/", function(request, response) {
    helper.log("Service Spiel: Client requested all records");

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.loadAll();
        helper.log("Service Spiel: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/spiel/existiert/:id", function(request, response) {
    helper.log("Service Spiel: Client requested check, if record exists, id=" + request.params.id);

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.exists(request.params.id);
        helper.log("Service Spiel: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Spiel: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/spiel", function(request, response) {
    helper.log("Service Spiel: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.plattform)) {
        errorMsgs.push("plattform fehlt");
    } else if (helper.isUndefined(request.body.plattform.id)) {
        errorMsgs.push("plattform gesetzt, aber id fehlt");
    }
    if (helper.isUndefined(request.body.spielname)) 
        errorMsgs.push("spielname fehlt");
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = "";
    if (helper.isUndefined(request.body.erscheinungsjahr)) 
        request.body.erscheinungsjahr = "2020";
    if (helper.isUndefined(request.body.mehrwertsteuer)) {
        errorMsgs.push("mehrwertsteuer fehlt");
    } else if (helper.isUndefined(request.body.mehrwertsteuer.id)) {
        errorMsgs.push("mehrwertsteuer gesetzt, aber id fehlt");
    }  
    if (helper.isUndefined(request.body.nettokaufpreis)) 
        errorMsgs.push("nettokaufpreis fehlt");
    if (helper.isUndefined(request.body.nettoleihpreis)) 
        errorMsgs.push("nettoleihpreis fehlt");
    if (!helper.isNumeric(request.body.nettokaufpreis)) 
        errorMsgs.push("nettokaufpreis muss eine Zahl sein");
    if (!helper.isNumeric(request.body.nettoleihpreis)) 
        errorMsgs.push("nettoleihpreis muss eine Zahl sein");
    if (helper.isUndefined(request.body.kaufart)) {
        errorMsgs.push("kaufart fehlt");
    } else if (helper.isUndefined(request.body.kaufart.id)) {
        errorMsgs.push("kaufart gesetzt, aber id fehlt");
    } 
    if (helper.isUndefined(request.body.leihdauer)) 
        request.body.leihdauer = 7;
    if (!helper.isNumeric(request.body.leihdauer)) 
        errorMsgs.push("leihdauer muss eine Zahl sein");
    if (helper.isUndefined(request.body.genre)) {
        errorMsgs.push("genre fehlt");
    } else if (helper.isUndefined(request.body.genre.id)) {
        errorMsgs.push("genre gesetzt, aber id fehlt");
    } 
          
    // if (helper.isUndefined(request.body.datenblatt)) {
    //     request.body.datenblatt = null;
    // } else if (helper.isUndefined(request.body.datenblatt.id)) {
    //     errorMsgs.push("datenblatt gesetzt, aber id fehlt");
    // } else {
    //     request.body.datenblatt = request.body.datenblatt.id;
    // }

    if (helper.isUndefined(request.body.bilder)) 
        request.body.bilder = [];
    
    if (errorMsgs.length > 0) {
        helper.log("Service Spiel: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.create(request.body.plattform.id, request.body.spielname, request.body.beschreibung, request.body.erscheinungsjahr, request.body.mehrwertsteuer.id, request.body.nettokaufpreis, request.body.nettoleihpreis, request.body.kaufart.id, request.body.leihdauer, request.body.genre.id, request.body.bilder);
        helper.log("Service Spiel: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.put("/spiel", function(request, response) {
    helper.log("Service Spiel: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.plattform)) {
        errorMsgs.push("plattform fehlt");
    } else if (helper.isUndefined(request.body.plattform.id)) {
        errorMsgs.push("plattform gesetzt, aber id fehlt");
    }
    if (helper.isUndefined(request.body.spielname)) 
        errorMsgs.push("spielname fehlt");
    if (helper.isUndefined(request.body.beschreibung)) 
        request.body.beschreibung = "";
    if (helper.isUndefined(request.body.erscheinungsjahr)) 
        request.body.erscheinungsjahr = "2020";
    if (helper.isUndefined(request.body.mehrwertsteuer)) {
        errorMsgs.push("mehrwertsteuer fehlt");
    } else if (helper.isUndefined(request.body.mehrwertsteuer.id)) {
        errorMsgs.push("mehrwertsteuer gesetzt, aber id fehlt");
    }  
    if (helper.isUndefined(request.body.nettokaufpreis)) 
        errorMsgs.push("nettokaufpreis fehlt");
    if (helper.isUndefined(request.body.nettoleihpreis)) 
        errorMsgs.push("nettoleihpreis fehlt");
    if (!helper.isNumeric(request.body.nettokaufpreis)) 
        errorMsgs.push("nettokaufpreis muss eine Zahl sein");
    if (!helper.isNumeric(request.body.nettoleihpreis)) 
        errorMsgs.push("nettoleihpreis muss eine Zahl sein");
    if (helper.isUndefined(request.body.kaufart)) {
        errorMsgs.push("kaufart fehlt");
    } else if (helper.isUndefined(request.body.kaufart.id)) {
        errorMsgs.push("kaufart gesetzt, aber id fehlt");
    } 
    if (helper.isUndefined(request.body.leihdauer)) 
        request.body.leihdauer = 7;
    if (!helper.isNumeric(request.body.leihdauer)) 
        errorMsgs.push("leihdauer muss eine Zahl sein");
    if (helper.isUndefined(request.body.genre)) {
        errorMsgs.push("genre fehlt");
    } else if (helper.isUndefined(request.body.genre.id)) {
        errorMsgs.push("genre gesetzt, aber id fehlt");
    } 
          
    // if (helper.isUndefined(request.body.datenblatt)) {
    //     request.body.datenblatt = null;
    // } else if (helper.isUndefined(request.body.datenblatt.id)) {
    //     errorMsgs.push("datenblatt gesetzt, aber id fehlt");
    // } else {
    //     request.body.datenblatt = request.body.datenblatt.id;
    // }
    if (helper.isUndefined(request.body.bilder)) 
        request.body.bilder = [];

    if (errorMsgs.length > 0) {
        helper.log("Service Spiel: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var result = spielDao.update(request.body.id, request.body.plattform.id, request.body.spielname, request.body.beschreibung, request.body.erscheinungsjahr, request.body.mehrwertsteuer.id, request.body.nettokaufpreis, request.body.nettoleihpreis, request.body.kaufart.id, request.body.leihdauer, request.body.genre.id, request.body.bilder);
        helper.log("Service Spiel: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Spiel: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/spiel/:id", function(request, response) {
    helper.log("Service Spiel: Client requested deletion of record, id=" + request.params.id);

    const spielDao = new SpielDao(request.app.locals.dbConnection);
    try {
        var obj = spielDao.loadById(request.params.id);
        spielDao.delete(request.params.id);
        helper.log("Service Spiel: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Spiel: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;