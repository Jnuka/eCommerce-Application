import { Component, Input, OnInit } from '@angular/core';
import { SliderInterface } from '../interfaces/slider.interface';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-image-slider',
  imports: [NgStyle],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.css',
})
export class ImageSliderComponent implements OnInit {
  @Input() public srcImage: SliderInterface[] = [];
  @Input() public newSourceImage: SliderInterface[] = [];
  public currentIndex = 0;

  public ngOnInit(): void {
    if (this.srcImage.length !== 0) {
      return;
    }
    this.srcImage.push({ url: '', alt: '' });
  }

  public goToPrev(): void {
    if (this.newSourceImage.length !== 0) {
      const isFirstSlide = this.currentIndex === 0;
      this.currentIndex = isFirstSlide ? this.newSourceImage.length - 1 : this.currentIndex - 1;
    } else {
      const isFirstSlide = this.currentIndex === 0;
      this.currentIndex = isFirstSlide ? this.srcImage.length - 1 : this.currentIndex - 1;
    }
  }

  public goToNext(): void {
    if (this.newSourceImage.length !== 0) {
      const isLastSlide = this.currentIndex === this.newSourceImage.length - 1;
      this.currentIndex = isLastSlide ? 0 : this.currentIndex + 1;
    } else {
      const isLastSlide = this.currentIndex === this.srcImage.length - 1;
      this.currentIndex = isLastSlide ? 0 : this.currentIndex + 1;
    }
  }

  public getCurrentSlideUrl(): string {
    if (this.newSourceImage.length !== 0) {
      return `url('${this.newSourceImage[this.currentIndex].url}')`;
    } else {
      return `url('${this.srcImage[this.currentIndex].url}')`;
    }
  }
}
