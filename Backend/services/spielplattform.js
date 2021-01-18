const helper = require("../helper.js");
const SpielplattformDao = require("../dao/spielplattformDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/spielplattform/gib/:id", function(request, response) {
    helper.log("Service spielplattform: Client requested one record, id=" + request.params.id);

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var result = spielplattformDao.loadById(request.params.id);
        helper.log("Service spielplattform: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service spielplattform: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/spielplattform/alle", function(request, response) {
    helper.log("Service spielplattform: Client requested all records");

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var result = spielplattformDao.loadAll();
        helper.log("Service spielplattform: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service spielplattform: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/spielplattform/existiert/:id", function(request, response) {
    helper.log("Service spielplattform: Client requested check, if record exists, id=" + request.params.id);

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var result = spielplattformDao.exists(request.params.id);
        helper.log("Service spielplattform: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service spielplattform: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/spielplattform", function(request, response) {
    helper.log("Service spielplattform: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name fehlt");
    
    if (errorMsgs.length > 0) {
        helper.log("Service spielplattform: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var result = spielplattformDao.create(request.body.name);
        helper.log("Service spielplattform: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service spielplattform: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/spielplattform", function(request, response) {
    helper.log("Service spielplattform: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name fehlt");

    if (errorMsgs.length > 0) {
        helper.log("Service spielplattform: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var result = spielplattformDao.update(request.body.id, request.body.name);
        helper.log("Service spielplattform: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service spielplattform: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/spielplattform/:id", function(request, response) {
    helper.log("Service spielplattform: Client requested deletion of record, id=" + request.params.id);

    const spielplattformDao = new SpielplattformDao(request.app.locals.dbConnection);
    try {
        var obj = spielplattformDao.loadById(request.params.id);
        spielplattformDao.delete(request.params.id);
        helper.log("Service spielplattform: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service spielplattform: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;