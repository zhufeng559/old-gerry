import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSearchPage } from './order-search.page';

describe('OrderSearchPage', () => {
  let component: OrderSearchPage;
  let fixture: ComponentFixture<OrderSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
