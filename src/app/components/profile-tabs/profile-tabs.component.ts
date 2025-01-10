import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-tabs',
  standalone: true,
  imports: [CommonModule, TabsModule],
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.css']
})
export class ProfileTabsComponent {
  @Input() user$?: Observable<any>;
}