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
  public currentIndex = 0;

  public ngOnInit(): void {
    this.srcImage.push({ url: '', alt: '' });
  }

  public goToPrev(): void {
    const isFirstSlide = this.currentIndex === 0;
    this.currentIndex = isFirstSlide ? this.srcImage.length - 1 : this.currentIndex - 1;
  }

  public goToNext(): void {
    const isLastSlide = this.currentIndex === this.srcImage.length - 1;
    this.currentIndex = isLastSlide ? 0 : this.currentIndex + 1;
  }

  public getCurrentSlideUrl(): string {
    return `url('${this.srcImage[this.currentIndex].url}')`;
  }
}
