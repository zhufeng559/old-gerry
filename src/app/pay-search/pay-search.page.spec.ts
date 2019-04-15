import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySearchPage } from './pay-search.page';

describe('PaySearchPage', () => {
  let component: PaySearchPage;
  let fixture: ComponentFixture<PaySearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaySearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
