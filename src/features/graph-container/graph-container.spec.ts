import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphContainer } from './graph-container';

describe('GraphContainer', () => {
  let component: GraphContainer;
  let fixture: ComponentFixture<GraphContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
