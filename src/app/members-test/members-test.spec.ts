import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersTest } from './members-test';

describe('MembersTest', () => {
  let component: MembersTest;
  let fixture: ComponentFixture<MembersTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
