import { TextField } from 'tns-core-modules/ui/text-field';
import { Page } from 'tns-core-modules/ui/page/page';
import { LoginService } from './../service/login.service';
import { RouterExtensions } from 'nativescript-angular/router';
import { ItemService } from './../service/item.service';
import { Component, OnInit, NgZone, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Item } from "./item";
import { TNSFancyAlert } from 'nativescript-fancyalert';
import  * as Toast  from "nativescript-toast";
import * as clipBoard from "nativescript-clipboard";

@Component({
    selector: "ns-details",
    templateUrl: "./item-detail.component.html",
    styleUrls: ["./item-detail.component.css"]
})
export class ItemDetailComponent implements OnInit {
    public item: Item = {};
    public isSecure : boolean = true;
    public canCopy : boolean = false;
    public editable : boolean = false;

    @ViewChild('password',{static: false}) private pwdTxtField : ElementRef;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private router: RouterExtensions,
        private loginService: LoginService,
        private ngZone: NgZone
    ) { 
    }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        if(id)
        {
            this.item = this.itemService.getAllItems().filter(item => item.id == id)[0];
            this.editable = false;
        }
        else
        this.editable = true;
        }

    public saveItem()
    {
        this.item.id = this.item.id ? this.item.id : null;

         this.itemService.saveItem(this.item).then(data => {
            if(data)
            {
                this.item.id = data;
                this.itemService.updateItems();
                TNSFancyAlert.showSuccess("Sucess", "Password stored successfully", "OK").then(() =>{
                });
            }
        }, err => {
            console.log(err,"ERROR SAVING");
            TNSFancyAlert.showError("Eror", "Password cannot be stored " + err, "OK");
        });
    }

    onBackTap(): void {
        this.router.navigate(["/items"],{clearHistory:true});
    }

    public checkPassword()
    { 
        if(this.item.id)
        TNSFancyAlert.showEdit("Enter master password","", "U N L O C K").then((data: string) => {
            if(data)
            {
                this.loginService.login(data).then(login =>
                    {
                        if(login)
                        {
                            this.isSecure = false;
                            this.canCopy = true;
                            setTimeout(() => {
                                if(!this.isSecure && !this.router.router.isActive("items",true))
                                Toast.makeText("Password Hidden again!","short").show(); 
                                this.isSecure = true;
                            } , 1000*10);
                        }
                        else{
                            Toast.makeText("Wrong Password!","long").show();
                        }
                    })
            }
        });
        else
        {
            this.isSecure = false;
            this.canCopy = false;
        }

    }

    public copyToClipboard()
    {
        Toast.makeText("Copy to Clipboard !").show();
        clipBoard.setText(this.item.password.toString());
    }

    public checkFormNotBlank(): boolean
    {
        return this.editable && this.item && this.item.password != null && this.item.website != null && this.item.username != null;
    }

    public setEditable()
    {
        Toast.makeText("You can Edit Now!!").show();
        this.ngZone.run(() => {
            this.editable = true;
        });
    }
}
