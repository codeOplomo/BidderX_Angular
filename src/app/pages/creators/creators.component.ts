import { Component } from '@angular/core';
import { OwnerRankingVM } from '../../models/view-models/owner-ranking-vm';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingOwnersCardComponent } from '../../components/ranking-owners-card/ranking-owners-card.component';
import { AuctionsService } from '../../services/auctions.service';

@Component({
  selector: 'app-creators',
  standalone: true,
  imports: [CommonModule, FormsModule, RankingOwnersCardComponent],
  templateUrl: './creators.component.html',
  styleUrl: './creators.component.css'
})
export class CreatorsComponent {
  owners: OwnerRankingVM[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Default duration filter: '1d', '7d', '15d', '1m'
  duration: string = '1d';

  constructor(private auctionsService: AuctionsService) {}

  ngOnInit(): void {
    this.loadOwners();
  }

  loadOwners(): void {
    this.auctionsService.getOwnerRanking(this.duration, this.currentPage, this.pageSize)
      .subscribe(response => {
        const data = response.data;
        this.owners = data.content;
        this.totalPages = data.page.totalPages;
      });
  }

  // Handle next/previous page
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOwners();
    }
  }

  // Handle filter changes (duration)
  onDurationChange(newDuration: string): void {
    this.duration = newDuration;
    this.currentPage = 0; // reset to first page
    this.loadOwners();
  }
}
