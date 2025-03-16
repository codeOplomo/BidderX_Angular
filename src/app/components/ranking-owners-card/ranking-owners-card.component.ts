import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-ranking-owners-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking-owners-card.component.html',
  styleUrl: './ranking-owners-card.component.css'
})
export class RankingOwnersCardComponent {
  @Input() rank!: number;
  @Input() ownerName!: string;
  @Input() revenue!: number;
  @Input() ownerImage?: string;

  constructor(private imagesService: ImagesService) { }

  get ownerInitials(): string {
    return this.ownerName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }

  getImageUrl(imagePath: string): string {
    return this.imagesService.getImageUrl(imagePath);
  }
}
