import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.css'
})
export class ProductGalleryComponent {

  selectedThumb = 0;

  product = {
    title: 'The Amazing Game',
    currentBid: '0.11wETH',
    subtitle: '#22 Portal, Info below',
    category: 'Category',
    royalties: '10% royalties',
    likes: 33,
    collections: [
      { name: 'Brodband', avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/det.PNG-ZZUQHKgwFQ1Er5hrAXAm337qQpK1Gr.png' },
      { name: 'Brodband', avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/det.PNG-ZZUQHKgwFQ1Er5hrAXAm337qQpK1Gr.png' }
    ]
  };

  thumbnails = [
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/det.PNG-ZZUQHKgwFQ1Er5hrAXAm337qQpK1Gr.png',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/det.PNG-ZZUQHKgwFQ1Er5hrAXAm337qQpK1Gr.png',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/det.PNG-ZZUQHKgwFQ1Er5hrAXAm337qQpK1Gr.png'
  ];

  get selectedImage(): string {
    return this.thumbnails[this.selectedThumb];
  }

  selectThumbnail(index: number): void {
    this.selectedThumb = index;
  }
}
