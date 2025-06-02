import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { SliderInterface } from '../interfaces/slider.interface';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.css',
  imports: [MatButtonModule, ImageSliderComponent, MatDialogActions, MatDialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWindowComponent {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  public srcImage: SliderInterface[] = inject(MAT_DIALOG_DATA);
  public newSourceImage: SliderInterface[] = [];
  constructor() {
    const currentIndex = document.querySelector('.slide')?.id;
    if (currentIndex !== undefined) {
      this.newSourceImage = [
        this.srcImage[Number(currentIndex)],
        ...this.srcImage.slice(Number(currentIndex) + 1),
        ...this.srcImage.slice(0, Number(currentIndex)),
      ];
    }
  }
}
