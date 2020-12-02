const helper = require("../helper.js");
const GenreDao = require("../dao/genreDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/genre/gib/:id", function(request, response) {
    helper.log("Service genre: Client requested one record, id=" + request.params.id);

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var result = genreDao.loadById(request.params.id);
        helper.log("Service genre: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service genre: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/genre/alle", function(request, response) {
    helper.log("Service genre: Client requested all records");

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var result = genreDao.loadAll();
        helper.log("Service genre: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service genre: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/genre/existiert/:id", function(request, response) {
    helper.log("Service genre: Client requested check, if record exists, id=" + request.params.id);

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var result = genreDao.exists(request.params.id);
        helper.log("Service genre: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service genre: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/genre", function(request, response) {
    helper.log("Service genre: Client requested creation of new record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name fehlt");
    
    if (errorMsgs.length > 0) {
        helper.log("Service genre: Creation not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var result = genreDao.create(request.body.name);
        helper.log("Service genre: Record inserted");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service genre: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.put("/genre", function(request, response) {
    helper.log("Service genre: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehlt");
    if (helper.isUndefined(request.body.name)) 
        errorMsgs.push("name fehlt");

    if (errorMsgs.length > 0) {
        helper.log("Service genre: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var result = genreDao.update(request.body.id, request.body.name);
        helper.log("Service genre: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service genre: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});

serviceRouter.delete("/genre/:id", function(request, response) {
    helper.log("Service genre: Client requested deletion of record, id=" + request.params.id);

    const genreDao = new GenreDao(request.app.locals.dbConnection);
    try {
        var obj = genreDao.loadById(request.params.id);
        genreDao.delete(request.params.id);
        helper.log("Service genre: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service genre: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;