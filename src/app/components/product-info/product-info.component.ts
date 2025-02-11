import { Component } from '@angular/core';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [],
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.css'
})
export class ProductInfoComponent {

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
}
