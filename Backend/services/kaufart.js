const helper = require("../helper.js");
const KaufartDao = require("../dao/kaufartDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/kaufart/gib/:id", function(request, response) {
    helper.log("Service kaufart: Client requested one record, id=" + request.params.id);

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var result = kaufartDao.loadById(request.params.id);
        helper.log("Service kaufart: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service kaufart: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kaufart/alle", function(request, response) {
    helper.log("Service kaufart: Client requested all records");

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var result = kaufartDao.loadAll();
        helper.log("Service kaufart: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service kaufart: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/kaufart/existiert/:id", function(request, response) {
    helper.log("Service kaufart: Client requested check, if record exists, id=" + request.params.id);

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var result = kaufartDao.exists(request.params.id);
        helper.log("Service kaufart: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service kaufart: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/kaufart", function(request, response) {
    helper.log("Service kaufart: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.art)) 
        errorMsgs.push("art fehlt");
    
    if (errorMsgs.length > 0) {
        helper.log("Service kaufart: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var result = kaufartDao.create(request.body.art);
        helper.log("Service kaufart: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service kaufart: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/kaufart", function(request, response) {
    helper.log("Service kaufart: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.art)) 
        errorMsgs.push("art fehlt");

    if (errorMsgs.length > 0) {
        helper.log("Service kaufart: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var result = kaufartDao.update(request.body.id, request.body.art);
        helper.log("Service kaufart: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service kaufart: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/kaufart/:id", function(request, response) {
    helper.log("Service kaufart: Client requested deletion of record, id=" + request.params.id);

    const kaufartDao = new KaufartDao(request.app.locals.dbConnection);
    try {
        var obj = kaufartDao.loadById(request.params.id);
        kaufartDao.delete(request.params.id);
        helper.log("Service kaufart: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service kaufart: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;