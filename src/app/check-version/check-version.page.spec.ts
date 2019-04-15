import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVersionPage } from './check-version.page';

describe('CheckVersionPage', () => {
  let component: CheckVersionPage;
  let fixture: ComponentFixture<CheckVersionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckVersionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckVersionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
