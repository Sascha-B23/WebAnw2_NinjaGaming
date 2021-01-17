const helper = require("../helper.js");

const SpielplattformDao = require("./spielplattformDao.js");
const GenreDao = require("./genreDao.js");
const KaufartDao = require("./kaufartDao.js");

const MehrwertsteuerDao = require("./mehrwertsteuerDao.js");
const ProduktbildDao = require("./produktbildDao.js");

class SpielDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const spielplattformDao = new SpielplattformDao(this._conn);
        const genreDao = new GenreDao(this._conn);
        const kaufartDao = new KaufartDao(this._conn);
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        const produktbildDao = new ProduktbildDao(this._conn);

        var sql = "SELECT * FROM Spiel WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.spielplattform = spielplattformDao.loadById(result.plattformid);
        delete result.plattformid;
        result.genre = genreDao.loadById(result.genreid);
        delete result.genreid;
        result.kaufart = kaufartDao.loadById(result.kaufartid);
        delete result.kaufartid;
        result.mehrwertsteuer = mehrwertsteuerDao.loadById(result.mehrwertsteuerid);
        delete result.mehrwertsteuerid;
        // if (helper.isNull(result.datenblattid)) {
        //     result.datenblatt = null;
        // } else {
        //     result.datenblatt = downloadDao.loadById(result.datenblattid);
        // }
        // delete result.datenblattid;
        result.bilder = produktbildDao.loadByParent(result.id);
        for (i = 0; i < result.bilder.length; i++) {
            delete result.bilder[i].spielid;
        }

        result.kaufmehrwertsteueranteil = helper.round((result.nettokaufpreis / 100) * result.mehrwertsteuer.steuersatz);

        result.bruttokaufpreis = helper.round(result.nettokaufpreis + result.kaufmehrwertsteueranteil);

        result.leihmehrwertsteueranteil = helper.round((result.nettoleihpreis / 100) * result.mehrwertsteuer.steuersatz);

        result.bruttoleihpreis = helper.round(result.nettoleihpreis + result.leihmehrwertsteueranteil);

        return result;
    }  


    loadByPlatform(id) {
        const spielplattformDao = new SpielplattformDao(this._conn);
        var plattformen = spielplattformDao.loadAll();
        const genreDao = new GenreDao(this._conn);
        var genres = genreDao.loadAll();
        const kaufartDao = new KaufartDao(this._conn);
        var kaufarten = kaufartDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();

        var sql = "SELECT * FROM Spiel WHERE PlattformID=" + id;
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of plattformen) {
                if (element.id == result[i].plattformid) {
                    result[i].spielplattform = element;
                    break;
                }
            }
            delete result[i].plattformid;

            for (var element of genres) {
                if (element.id == result[i].genreid) {
                    result[i].genre = element;
                    break;
                }
            }
            delete result[i].genreid;

            for (var element of kaufarten) {
                if (element.id == result[i].kaufartid) {
                    result[i].kaufart = element;
                    break;
                }
            }
            delete result[i].kaufartid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            // if (helper.isNull(result[i].datenblattid)) {
            //     result[i].datenblatt = null;
            // } else {
            //     result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            // }
            // delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.spiel.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].kaufmehrwertsteueranteil = helper.round((result[i].nettokaufpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttokaufpreis = helper.round(result[i].nettokaufpreis + result[i].kaufmehrwertsteueranteil);

            result[i].leihmehrwertsteueranteil = helper.round((result[i].nettoleihpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttoleihpreis = helper.round(result[i].nettoleihpreis + result[i].leihmehrwertsteueranteil);

        }

        return result;
    }

    loadByDate() {
        const spielplattformDao = new SpielplattformDao(this._conn);
        var plattformen = spielplattformDao.loadAll();
        const genreDao = new GenreDao(this._conn);
        var genres = genreDao.loadAll();
        const kaufartDao = new KaufartDao(this._conn);
        var kaufarten = kaufartDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();


        var sql = "SELECT * FROM spiel  ORDER BY Erscheinungsjahr DESC";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of plattformen) {
                if (element.id == result[i].plattformid) {
                    result[i].spielplattform = element;
                    break;
                }
            }
            delete result[i].plattformid;

            for (var element of genres) {
                if (element.id == result[i].genreid) {
                    result[i].genre = element;
                    break;
                }
            }
            delete result[i].genreid;

            for (var element of kaufarten) {
                if (element.id == result[i].kaufartid) {
                    result[i].kaufart = element;
                    break;
                }
            }
            delete result[i].kaufartid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            // if (helper.isNull(result[i].datenblattid)) {
            //     result[i].datenblatt = null;
            // } else {
            //     result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            // }
            // delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.spiel.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].kaufmehrwertsteueranteil = helper.round((result[i].nettokaufpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttokaufpreis = helper.round(result[i].nettokaufpreis + result[i].kaufmehrwertsteueranteil);

            result[i].leihmehrwertsteueranteil = helper.round((result[i].nettoleihpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttoleihpreis = helper.round(result[i].nettoleihpreis + result[i].leihmehrwertsteueranteil);

        }

        return result;
        
    }

    loadAll() {
        const spielplattformDao = new SpielplattformDao(this._conn);
        var plattformen = spielplattformDao.loadAll();
        const genreDao = new GenreDao(this._conn);
        var genres = genreDao.loadAll();
        const kaufartDao = new KaufartDao(this._conn);
        var kaufarten = kaufartDao.loadAll();
        const mehrwertsteuerDao = new MehrwertsteuerDao(this._conn);
        var taxes = mehrwertsteuerDao.loadAll();
        const produktbildDao = new ProduktbildDao(this._conn);
        var pictures = produktbildDao.loadAll();

        var sql = "SELECT * FROM Spiel";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            for (var element of plattformen) {
                if (element.id == result[i].plattformid) {
                    result[i].spielplattform = element;
                    break;
                }
            }
            delete result[i].plattformid;

            for (var element of genres) {
                if (element.id == result[i].genreid) {
                    result[i].genre = element;
                    break;
                }
            }
            delete result[i].genreid;

            for (var element of kaufarten) {
                if (element.id == result[i].kaufartid) {
                    result[i].kaufart = element;
                    break;
                }
            }
            delete result[i].kaufartid;

            for (var element of taxes) {
                if (element.id == result[i].mehrwertsteuerid) {
                    result[i].mehrwertsteuer = element;
                    break;
                }
            }
            delete result[i].mehrwertsteuerid;

            // if (helper.isNull(result[i].datenblattid)) {
            //     result[i].datenblatt = null;
            // } else {
            //     result[i].datenblatt = downloadDao.loadById(result[i].datenblattid);
            // }
            // delete result[i].datenblattid;

            result[i].bilder = [];
            for (var element of pictures) {
                if (element.spiel.id == result[i].id) {
                    result[i].bilder.push(element);
                }
            }

            result[i].kaufmehrwertsteueranteil = helper.round((result[i].nettokaufpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttokaufpreis = helper.round(result[i].nettokaufpreis + result[i].kaufmehrwertsteueranteil);

            result[i].leihmehrwertsteueranteil = helper.round((result[i].nettoleihpreis / 100) * result[i].mehrwertsteuer.steuersatz);

            result[i].bruttoleihpreis = helper.round(result[i].nettoleihpreis + result[i].leihmehrwertsteueranteil);

        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Spiel WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(plattformid = 1, spielname = "", beschreibung = "", erscheinungsjahr = "", mehrwertsteuerid = 2, nettokaufpreis = 0.0, nettoleihpreis = 0.0, kaufartid = 3, leihdauer = 7, genreid = 1,bilder = []) {
        const produktbildDao = new ProduktbildDao(this._conn);

        var sql = "INSERT INTO Spiel (PlattformID,Spielname,Beschreibung,Erscheinungsjahr,MehrwertsteuerID,Nettokaufpreis,Nettoleihpreis,KaufartID,Leihdauer,GenreID) VALUES (?,?,?,?,?,?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [plattformid, spielname, beschreibung, erscheinungsjahr, mehrwertsteuerid, nettokaufpreis, nettoleihpreis, kaufartid, leihdauer, genreid];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        if (bilder.length > 0) {
            for (var element of bilder) {
                produktbildDao.create(element.bildpfad, result.lastInsertRowid);
            }
        }

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, plattformid = 1, spielname = "", beschreibung = "", erscheinungsjahr = "", mehrwertsteuerid = 2, nettokaufpreis = 0.0, nettoleihpreis = 0.0, kaufartid = 3, leihdauer = 7, genreid = 1, bilder = []) {
        const produktbildDao = new ProduktbildDao(this._conn);
        produktbildDao.deleteByParent(id);

        var sql = "UPDATE Spiel SET PlattformID=?,Spielname=?,Beschreibung=?,Erscheinungsjahr=?,MehrwertsteuerID=?,Nettokaufpreis=?,Nettoleihpreis=?,KaufartID=?,Leihdauer=?,GenreID=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [plattformid, spielname, beschreibung, erscheinungsjahr, mehrwertsteuerid, nettokaufpreis, nettoleihpreis, kaufartid, leihdauer, genreid, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        if (bilder.length > 0) {
            for (var element of bilder) {
                produktbildDao.create(element.bildpfad, id);
            }
        }

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            const produktbildDao = new ProduktbildDao(this._conn);
            produktbildDao.deleteByParent(id);

            var sql = "DELETE FROM Spiel WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("SpielDao [_conn=" + this._conn + "]");
    }
}

module.exports = SpielDao;