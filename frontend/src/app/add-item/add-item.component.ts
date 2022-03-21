import { HttpErrorResponse } from '@angular/common/http';
import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ItemService } from '../item/item.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  itemForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(2)]),
    description: new FormControl('', [Validators.minLength(16)]),
    imageUrl: new FormControl('')
  });
  invalidText : string[] = new Array(2);

  constructor(private itemService: ItemService) { }

  async addNewItem() {
    this.checkValues();

    if(this.validInput()){
      try {
        const inserted = await this.itemService.addItem(this.itemForm.value);
      if(!inserted){return} else {
        this.itemForm.reset();
      }
      }catch(err) {
        let errorMessage = 'Could not add item';
        if(err instanceof HttpErrorResponse) {
          if(err.status == 400){
            errorMessage += 'It\'s already exists!'
          }
        }
        alert(errorMessage);
      }
    }
  }

  checkValues() {
    for(let i = 0; i < this.invalidText.length; i++) {
      this.invalidText[i] = '';
    }

    if(!this.itemForm.get('name')?.valid){
      this.invalidText[0] = 'Item name must be atleast 2 character long!';
    }
    if(!this.itemForm.get('description')?.valid) {
      this.invalidText[1] = 'Description must be atleast 16 characters long!';
    }
  }

  validInput() {
    for(let text of this.invalidText)
      if(text) return false;
    return true;
  }
}
