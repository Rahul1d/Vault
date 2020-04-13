import * as Toast  from 'nativescript-toast';
import { LoginService } from './../service/login.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { Animation } from "tns-core-modules/ui/animation";
import { RouterExtensions } from "nativescript-angular/router";
import { TextField } from "tns-core-modules/ui/text-field";
import { TNSFancyAlert } from "nativescript-fancyalert";
// let CryptoJs = require('crypto-js');

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    // @ViewChild('button',{static:false}) button: Button;
    @ViewChild('gear',{static :false}) gearRef: ElementRef;
    @ViewChild('passwordRef', { static: false}) passwordRef: ElementRef;

    public password: string = "";
    public isSecure : boolean = true; 
    public processing : boolean = false;

    constructor(private page: Page,
                private router: RouterExtensions,
                public loginService: LoginService) {
        this.page.actionBarHidden = true;
        
     }
    ngAfterViewInit(): void {
        // this.router.navigate(["/items"]);
    }

     ngOnInit() {
         this.loginService.checkIfMasterExists();
    }

     onUnlock()
    {

        // const encrypted = Crypto.AES.encrypt(this.password, "Secret Passphrase");
        // const decrypted = CryptoJs.AES.decrypt(encrypted,"Secret Passphrase");
        // console.log(decrypted.toString(CryptoJs.enc.Utf8),"encrypted");

        (<TextField>this.passwordRef.nativeElement).dismissSoftInput();
        this.processing = true;
        this.gearRef.nativeElement.rotate = 0;
        let animation = new Animation([
            {
                duration: 2000,
                target: this.gearRef.nativeElement,
                delay: 0,
                rotate: 520
            }
        ]);

        animation.play();

        if(!this.loginService.masterExists)
        {
            try {
                this.loginService.insertPassword(this.password).then(data => {
                    if(data)
                    {
                        this.gearRef.nativeElement.rotate = 0;
                        
                        TNSFancyAlert.showSuccess("Account Created", "Use the Master Password", "Ok").then(
                            () => {
                            if(!animation.isPlaying)
                                animation.play();
                                setTimeout(() => {
                                    this.router.navigate(['/items'],{clearHistory: true});
                                }, 200);
                            }
                        );
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        else{
            this.loginService.login(this.password).then(data =>{
            if(data)
            {
                console.log("login SuccessFull");  
                Toast.makeText("Loging In...","short").show();
                setTimeout(() => {
                    this.router.navigate(['/items'],{clearHistory: true});
                }, 3000);
            }
            else
            {
                this.processing = false;
            // show error
            TNSFancyAlert.showError("Error!", "Password does not Match!", "Close").then(
                () => {
                // this.password = "";
                }
            );

            }

            })
        }

        
        // const encrypted = CryptoJs.AES.encrypt(this.password, "Secret Passphrase");
        // const decrypted = CryptoJs.AES.decrypt(encrypted,"Secret Passphrase");
        // console.log(decrypted.toString(CryptoJs.enc.Utf8),"encrypted");


    }

}
