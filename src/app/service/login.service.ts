import { DBService } from './db.service';
import { Injectable } from "@angular/core";
const CryptoJs = require('crypto-js');


@Injectable({providedIn:"root"})
export class LoginService{
    constructor(private dbService: DBService)
    {
    }

    public masterExists: boolean = false;

    public insertPassword(password: string) {
        const hashedPassword = CryptoJs.SHA256(password);
        return this.dbService.insertMaster(hashedPassword);
    }

    public login(password: string)
    {
        const hashedPassword = CryptoJs.SHA256(password.toString());
        return this.dbService.login(hashedPassword);
    }

    public async checkIfMasterExists()
    {
        this.dbService.checkifMasterExists().then(value => {
            this.masterExists = value;
        })

    }
}