import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery.component';
import { ProductInfoComponent } from "../../components/product-info/product-info.component";
import { ProductTabsComponent } from "../../components/product-tabs/product-tabs.component";


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductGalleryComponent, ReactiveFormsModule, CommonModule, TabViewModule, DividerModule, TagModule, BadgeModule, MenuModule, AvatarModule, CardModule, ImageModule, ButtonModule, ProductInfoComponent, ProductTabsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {

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
