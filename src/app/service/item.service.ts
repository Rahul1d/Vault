import { DBService } from './db.service';
import { Item } from './../item/item';
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: "root"
})
export class ItemService {

    constructor( private dbService : DBService){ }

    private items: Item[] = [];

    saveItem(item: Item)
    {
       return this.dbService.insertItems(item);
    }


    getAllItems()
    {  
       if(this.items.length == 0)
        {
            this.items = this.dbService.getAllItems();
            return this.items;
        }
        else    
        return this.items;
    }

    updateItems()
    {
        this.items = this.dbService.getAllItems();
    }

    deleteItem(item: Item)
    {
        return this.dbService.deleteItem(item.id);
    }

}
