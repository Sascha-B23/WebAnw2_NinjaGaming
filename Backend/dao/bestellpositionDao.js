const helper = require("../helper.js");
const SpielDao = require("./spielDao.js");

class BestellpositionDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const spielDao = new SpielDao(this._conn);

        var sql = "SELECT * FROM Bestellposition WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);

        result.bestellung = { "id": result.bestellungid };
        delete result.bestellungid;
        
        result.spiel = spielDao.loadById(result.spielid);
        delete result.spielid;

        if(result[i].gekauft == 1) {
            result.nettopreis = result.spiel.nettokaufpreis;
            result.bruttopreis = result.spiel.bruttokaufpreis;
            result.mehrwertsteuer = result.spiel.kaufmehrwertsteueranteil;
        }
        else{
            result.nettopreis = result.leihzeit * result.spiel.nettoleihpreis;
            result.bruttopreis = result.leihzeit * result.spiel.bruttoleihpreis;
            result.mehrwertsteuer = result.spiel.leihmehrwertsteueranteil;
        }

        return result;
    }

    loadAll() {
        const spielDao = new SpielDao(this._conn);
        var spiele = spielDao.loadAll();

        var sql = "SELECT * FROM Bestellposition";
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            result[i].bestellung = { "id": result[i].bestellungid };
            delete result[i].bestellungid;
        
            for (var element of spiele) {
                if (element.id == result[i].spielid) {
                    result[i].spiel = element;
                    break;
                }
            }
            
            if(result[i].gekauft == 1) {
                result[i].nettopreis = result[i].spiel.nettokaufpreis;
                result[i].bruttopreis = result[i].spiel.bruttokaufpreis;
                result[i].mehrwertsteuer = result[i].spiel.kaufmehrwertsteueranteil;
            }
            else{
                result[i].nettopreis = result[i].leihzeit * result[i].spiel.nettoleihpreis;
                result[i].bruttopreis = result[i].leihzeit * result[i].spiel.bruttoleihpreis;
                result[i].mehrwertsteuer = result[i].spiel.leihmehrwertsteueranteil * result[i].leihzeit;
            }

            // result[i].nettosumme = helper.round(result[i].menge * result[i].produkt.nettopreis);
            // result[i].bruttosumme = helper.round(result[i].menge * result[i].produkt.bruttopreis);
        }

        return result;
    }

    loadByParent(bestellungid) {
        const spielDao = new SpielDao(this._conn);
        var spiele = spielDao.loadAll();

        var sql = "SELECT * FROM Bestellposition WHERE BestellungID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(bestellungid);

        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);

        for (var i = 0; i < result.length; i++) {
            result[i].bestellung = { "id": result[i].bestellungid };
            delete result[i].bestellungid;
        
            for (var element of spiele) {
                if (element.id == result[i].spielid) {
                    result[i].spiel = element;
                    break;
                }
            }
            delete result[i].spielid;

            if(result[i].gekauft == 1) {
                result[i].nettopreis = result[i].spiel.nettokaufpreis;
                result[i].bruttopreis = result[i].spiel.bruttokaufpreis;
                result[i].mehrwertsteuer = result[i].spiel.kaufmehrwertsteueranteil;
            }
            else{
                result[i].nettopreis = result[i].leihzeit * result[i].spiel.nettoleihpreis;
                result[i].bruttopreis = result[i].leihzeit * result[i].spiel.bruttoleihpreis;
                result[i].mehrwertsteuer = result[i].spiel.leihmehrwertsteueranteil * result[i].leihzeit;
            }
            // result[i].mehrwertsteuersumme = helper.round(result[i].menge * result[i].produkt.mehrwertsteueranteil);
            // result[i].nettosumme = helper.round(result[i].menge * result[i].produkt.nettopreis);
            // result[i].bruttosumme = helper.round(result[i].menge * result[i].produkt.bruttopreis);
        }

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Bestellposition WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(bestellungid, spielid, gekauft, leihzeit) {
        var sql = "INSERT INTO Bestellposition (BestellungID,SpielID,Gekauft,Leihzeit) VALUES (?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [bestellungid, spielid, gekauft, leihzeit];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        // var newObj = this.loadById(result.lastInsertRowid);
        // return newObj;
    }

    update(id, bestellungid = 1, spielid = 1, gekauft = 1, leihzeit = 7) {
        var sql = "UPDATE Bestellposition SET BestellungID=?,SpielId=?,Gekauft=?,Leihzeit=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [bestellungid, spielid, gekauft, leihzeit, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Bestellposition WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    deleteByParent(bestellungid) {
        try {
            var sql = "DELETE FROM Bestellposition WHERE BestellungID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(bestellungid);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Records by bestellungid=" + bestellungid + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("BestellpositionDao [_conn=" + this._conn + "]");
    }
}

module.exports = BestellpositionDao;