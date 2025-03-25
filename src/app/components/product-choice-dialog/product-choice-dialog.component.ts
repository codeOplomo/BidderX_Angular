import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-product-choice-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './product-choice-dialog.component.html',
  styleUrl: './product-choice-dialog.component.css'
})
export class ProductChoiceDialogComponent {
  display = true;
  @Output() choiceMade = new EventEmitter<'new' | 'existing'>();

  selectChoice(choice: 'new' | 'existing') {
    this.choiceMade.emit(choice);
    this.display = false; 
  }
}
