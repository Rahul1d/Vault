import { Item } from './../item/item';
import { Injectable } from "@angular/core";
const sqlLite = require('nativescript-sqlite');

@Injectable({
    providedIn: "root"
})
export class DBService {

    public dbConnect: any;

    private readonly createTableSql = `CREATE TABLE IF NOT EXISTS master (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            password TEXT NOT NULL
                                        );`;

    private readonly createItemsSql = `CREATE TABLE IF NOT EXISTS ITEMS (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            website TEXT NOT NULL,
                                            username TEXT NOT NULL,
                                            password TEXT NOT NULL
                                        );`;
                                       

    constructor() {
        this.createDB();
    }

    public insertItems(item: Item) {

        return new Promise<number>((resolve, reject) => {
             this.dbConnect.execSQL(`INSERT OR REPLACE INTO ITEMS (id, website, username, password) values (
            ${item.id},'${item.website}' , '${item.username}', '${item.password}'
        );`).then(id => {
                console.log("Inserted data  successs");
                resolve (id);
            },
                err => {
                    console.log("Canot Insert Data");
                    reject(err);
                });
        });
    }


    private createDB() {
        (new sqlLite("VAULT")).then(db => {
            this.dbConnect = db;
            this.dbConnect.version().then(ver => {
                if (ver == 0) {
                    db.execSQL(this.createTableSql);
                    db.execSQL(this.createItemsSql);
                    db.version(1);
                }
                else {
                }
            });
        },
            error => console.log("Cannot open Database"));
    }

    public getAllItems(): Item[]{

        const items: Item[] = [];

        this.dbConnect.each("SELECT * from ITEMS", function(err, row) {
            const item : Item = {};
            item.id = row[0];
            item.website = row[1];
            item.username = row[2];
            item.password = row[3];
            items.push(item);
        });

        return items;
    }

    public async checkifMasterExists(): Promise<boolean>
    {
        return new Promise((resolve, reject) => {
            this.dbConnect.all("SELECT * FROM MASTER").then(data => {
                resolve(data.length > 0);
            }, err => {
                reject(err);
            });
        });
    }

    public async login(password: string): Promise<Boolean>
    {
        return  new Promise<boolean>((resolve, reject) => {
            this.dbConnect.get("SELECT * from master where password=?", [password]).then(data => {
                resolve(data && data.length > 0);
            },
            err => reject(err));
        });

    }

    public async insertMaster(password: string)
    {
        return new Promise<boolean>((resolve, reject) => {
        this.dbConnect.execSQL(`
        INSERT INTO master (id, password) values (1 , '${password}');`).then(data => {
            console.log("Insert Into Master SuuccessFully");
            resolve(data != null || data != undefined);
        }, err => {
            console.log("Insert tInto Master Failed");
            reject(err);
        });
    });

    }

    public async deleteItem(itemId: number)
    {
        return new Promise<boolean>((resolve, reject) => {
            this.dbConnect.execSQL(`
            DELETE from Items where id = ?` , [itemId]).then(data => {
                resolve(data != null || data != undefined);
            }, err => {
                console.log("Delete Failed");
                reject(err);
            });
    });
}

}