import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

export interface ProductImageFile {
  preview: string;
  file: File;
}

@Component({
  selector: 'app-product-images-uploads',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './product-images-uploads.component.html',
  styleUrl: './product-images-uploads.component.css'
})
export class ProductImagesUploadsComponent {
  @Input() showNewProductFields = false;
  @Output() imagesChanged = new EventEmitter<{ files: File[], previews: string[] }>(); 
  @Output() uploadClicked = new EventEmitter<number>();

  triggerFileInput(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.uploadClicked.emit(index);
}

  @ViewChildren('productFileInputs') productFileInputs!: QueryList<ElementRef<HTMLInputElement>>;
  

  productImages: { file: File | null, preview: string | null }[] = [{ file: null, preview: null }];

  // triggerFileInput(index: number): void {
  //   console.log('File input triggered for index:', index); 
  //   const inputsArray = this.productFileInputs.toArray();
  //   if (inputsArray[index]) {
  //     inputsArray[index].nativeElement.click();
  //   }
  // }

  onUpdateProductImage(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.productImages[index] = { file, preview: reader.result as string };
      if (index === this.productImages.length - 1) {
        this.productImages.push({ file: null, preview: null });
      }
      this.emitChanges();
    };
    reader.readAsDataURL(file);
  }
  
  removeImage(index: number): void {
    this.productImages.splice(index, 1);
    this.emitChanges();
  }

  private emitChanges(): void {
    const validImages = this.productImages.filter(img => img.preview !== null && img.file !== null);
    this.imagesChanged.emit({ 
      files: validImages.map(img => img.file!) as File[], 
      previews: validImages.map(img => img.preview!) as string[]
    });
  }
}
