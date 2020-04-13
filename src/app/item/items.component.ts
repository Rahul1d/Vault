import * as Toast  from 'nativescript-toast';
import { TNSFancyAlert } from 'nativescript-fancyalert';
import { Page, View, Observable } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from "@angular/core";
import { Item } from "./item";
import { screen } from "tns-core-modules/platform/platform";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ItemService } from '../service/item.service';
import { ListViewEventData, SwipeActionsEventData } from 'nativescript-ui-listview';
import { ObservableArray } from 'tns-core-modules/data/observable-array/observable-array';

@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html",
    styleUrls: ["items.component.css"],
    // providers: [ModalDialogService]
})
export class ItemsComponent implements OnInit , AfterViewInit{
    public items: ObservableArray<Item> = new ObservableArray<Item>();

    @ViewChild('fab', {static: false}) fab: ElementRef;
    public item : Item ;

    constructor(private itemService: ItemService,
                private router: RouterExtensions,
                private page: Page
                ) {
        this.page.on(Page.navigatedToEvent,() => {
            this.items = new ObservableArray();
            this.items.push(this.itemService.getAllItems()); 
        });
        }

    ngAfterViewInit(): void {
        this.fab.nativeElement.top = screen.mainScreen.heightDIPs - 200;
        this.fab.nativeElement.left = screen.mainScreen.widthDIPs - 100;
    }

    ngOnInit(): void {
        if(this.items.length == 0)
        this.items.push(this.itemService.getAllItems()); 
    }

    showModal() {
        // const options: ModalDialogOptions = {
        //     viewContainerRef: this.viewContainerRef,
        //     fullscreen: false,
        //     context: {}
        // };
        // this.modalService.showModal(ItemDetailComponent, options);
        this.router.navigate(["/item/"]);
    }

    public refreshData(event: ListViewEventData)
    {
        this.items = new ObservableArray();
        this.items.push(this.itemService.getAllItems()); 

        setTimeout(() => {
            event.object.notifyPullToRefreshFinished();
        }, 700);
    }


    public onTap(event : ListViewEventData)
    {
        const item = event.object.getItemAtIndex(event.index);
        this.router.navigateByUrl("item/" + item.id);
    }

    public onSwipeCellStarted(args: SwipeActionsEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args.object;
        const leftItem = swipeView.getViewById<View>('mark-view');
        const rightItem = swipeView.getViewById<View>('delete-view');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth() / 3;
        this.item = args.object.getItemAtIndex(args.index);
    }


    public onDelete(event: SwipeActionsEventData)
    {
        if(this.item.id)
        TNSFancyAlert.showColorDialog("Do you want to delete?","Website: " + this.item.website,"Delete","Cancel","whitesmoke","black","black").then(data => {
            this.itemService.deleteItem(this.item).then(data => {
                this.items.splice(this.items.indexOf(this.item),1);
                Toast.makeText("Deleted Successfully!").show();
                this.itemService.updateItems();
            },err => {
                console.log("Cannot delete");
                Toast.makeText("Cannot delete" + err).show();
            }
            );
        }, err => {
            console.log("Cancel");
        });
    }

}
