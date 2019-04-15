import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayListPage } from './pay-list.page';

describe('PayListPage', () => {
  let component: PayListPage;
  let fixture: ComponentFixture<PayListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
