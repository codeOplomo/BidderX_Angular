import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() variant: "default" | "secondary" = "default"

  get badgeClasses(): string {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
    const variantClasses =
      this.variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"

    return `${baseClasses} ${variantClasses}`
  }

}
