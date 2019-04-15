import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMessagePage } from './my-message.page';

describe('MyMessagePage', () => {
  let component: MyMessagePage;
  let fixture: ComponentFixture<MyMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMessagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
