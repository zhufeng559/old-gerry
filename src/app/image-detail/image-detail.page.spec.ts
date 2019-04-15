import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDetailPage } from './image-detail.page';

describe('ImageDetailPage', () => {
  let component: ImageDetailPage;
  let fixture: ComponentFixture<ImageDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
