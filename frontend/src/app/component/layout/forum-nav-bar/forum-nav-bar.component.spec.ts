import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumNavBarComponent } from './forum-nav-bar.component';

describe('ForumNavBarComponent', () => {
  let component: ForumNavBarComponent;
  let fixture: ComponentFixture<ForumNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumNavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForumNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
