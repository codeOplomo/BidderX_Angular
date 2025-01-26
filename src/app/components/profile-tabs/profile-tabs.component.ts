import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Observable } from 'rxjs';
import { CollectionsTabComponent } from '../collections-tab/collections-tab.component';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/user/user.selectors';
import { CollectionsService } from '../../services/collections.service';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule, CollectionsTabComponent],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})

export class ProfileTabsComponent implements OnInit {
  user$: Observable<any>;
  userEmail: string = '';
  collections: any[] = []; 
  @Input() userData: any; 
  

  activeTab: string = 'products'; // Default active tab

  constructor(private store: Store, private collectionService: CollectionsService) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.user$.subscribe(user =>{ 
      console.log('User data in ProfileComponent:', user);
      if (user) {
        this.userEmail = user.email; 
        this.fetchUserCollections(); 
      }
      });

  }

  
  fetchUserCollections() {
    this.collectionService.getCollectionsByEmail(this.userEmail).subscribe({
      next: (response) => {
        this.collections = response.data; // Set the collections array
        console.log('Fetched collections:', this.collections); // Debugging log
      },
      error: (err) => {
        console.error('Error fetching collections by user ID:', err);
      },
    });
  }
  // Function to change tabs
  selectTab(tab: string) {
    this.activeTab = tab;
  }
}