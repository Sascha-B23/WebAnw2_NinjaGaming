const helper = require("../helper.js");
const BestellpositionDao = require("../dao/bestellpositionDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/bestellposition/gib/:id", function(request, response) {
    helper.log("Service bestellposition: Client requested one record, id=" + request.params.id);

    const bestellpositionDao = new BestellpositionDao(request.app.locals.dbConnection);
    try {
        var result = bestellpositionDao.loadById(request.params.id);
        helper.log("Service bestellposition: Record loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service bestellposition: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/bestellposition/alle/", function(request, response) {
    helper.log("Service bestellposition: Client requested all records");

    const bestellpositionDao = new BestellpositionDao(request.app.locals.dbConnection);
    try {
        var result = bestellpositionDao.loadAll();
        helper.log("Service bestellposition: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service bestellposition: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/bestellposition/existiert/:id", function(request, response) {
    helper.log("Service bestellposition: Client requested check, if record exists, id=" + request.params.id);

    const bestellpositionDao = new BestellpositionDao(request.app.locals.dbConnection);
    try {
        var result = bestellpositionDao.exists(request.params.id);
        helper.log("Service bestellposition: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service bestellposition: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});


module.exports = serviceRouter;