import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassword2Page } from './change-password2.page';

describe('ChangePassword2Page', () => {
  let component: ChangePassword2Page;
  let fixture: ComponentFixture<ChangePassword2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePassword2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePassword2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
