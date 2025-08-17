import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTest } from './org-test';

describe('OrgTest', () => {
  let component: OrgTest;
  let fixture: ComponentFixture<OrgTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
