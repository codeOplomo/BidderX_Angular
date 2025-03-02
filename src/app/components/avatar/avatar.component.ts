import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input() imageUrl?: string
  @Input() name!: string


  get initials(): string {
    return this.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }
}
