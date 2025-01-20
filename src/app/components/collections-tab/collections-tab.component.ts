import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Collection } from '../../store/collections/collection.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CollectionsService } from '../../services/collections.service';

@Component({
  selector: 'app-collections-tab',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './collections-tab.component.html',
  styleUrl: './collections-tab.component.css'
})
export class CollectionsTabComponent implements OnInit {
  @Input() collections: any[] = [];

  constructor(private router: Router, private collectionService: CollectionsService) {}

  ngOnInit() {  }


  viewCollection(id?: string) {
    if (id) {
      this.router.navigate(['/collections', id]);
    } else {
      console.warn('Attempted to view collection with undefined id');
    }
  }
}
