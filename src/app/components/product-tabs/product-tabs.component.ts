import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Property {
  label: string;
  value: string;
  type: 'rare' | 'common' | 'epic' | 'legendary';
}

@Component({
  selector: 'app-product-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-tabs.component.html',
  styleUrl: './product-tabs.component.css'
})
export class ProductTabsComponent {
  activeTab = 'Details';
  tabs = ['Bids', 'Details', 'History'];

  properties: Property[] = [
    { label: 'HYPE TYPE', value: 'CALM AF (STILL)', type: 'rare' },
    { label: 'BASTARDNESS', value: 'COOLIO BASTARD', type: 'epic' },
    { label: 'TYPE', value: 'APE', type: 'legendary' },
    { label: 'ASTARDNESS', value: 'BASTARD', type: 'rare' },
    { label: 'BAD HABIT(S)', value: 'PIPE', type: 'epic' },
    { label: 'BID', value: 'BPEYtl', type: 'legendary' },
    { label: 'ASTRAGENAKAR', value: 'BASTARD', type: 'rare' },
    { label: 'CITY', value: 'TOKYO', type: 'epic' }
  ];

  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
