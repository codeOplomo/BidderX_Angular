import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import * as UserActions from '../../store/user/user.actions';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-showcase-header',
  standalone: true,
  imports: [],
  templateUrl: './showcase-header.component.html',
  styleUrl: './showcase-header.component.css'
})
export class ShowcaseHeaderComponent {

  @Input() name: string | undefined;
  @Input() description: string | undefined;
  @Input() imageUrl: string | undefined;

  @Output() imageUpdated = new EventEmitter<string>();

  constructor(private userService: UserService, private imagesService: ImagesService, private store: Store) {}

  getImageUrl(imagePath: string | undefined): string {
    return imagePath ? this.imagesService.getImageUrl(imagePath) : 'assets/default-cover.png';
  }

  onUpdateCoverPicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // this.userService.uploadShowcaseCoverImage(file).subscribe({
        //   next: ({ imageUrl }) => {
        //     this.imageUpdated.emit(imageUrl);
        //     this.store.dispatch(UserActions.updateShowcaseCoverImageSuccess({ imageUrl }));
        //   },
        //   error: (error) => {
        //     console.error('Showcase cover upload failed:', error);
        //     this.store.dispatch(UserActions.updateShowcaseCoverImageFailure({ error }));
        //   }
        // });
      }
    };

    fileInput.click();
  }
}
