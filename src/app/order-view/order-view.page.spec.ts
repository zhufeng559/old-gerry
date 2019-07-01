import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewPage } from './order-view.page';

describe('OrderViewPage', () => {
  let component: OrderViewPage;
  let fixture: ComponentFixture<OrderViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
