import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService, UserRole } from './auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class PermissionDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private hasView = false;
  private allowedRoles: UserRole[] = [];

  @Input() set appHasRole(roles: UserRole[]) {
    this.allowedRoles = roles;
    this.updateView();
  }

  constructor() {
    // Re-evaluate when the signal changes
    effect(() => {
      this.authService.currentUser(); // create dependency
      this.updateView();
    });
  }

  private updateView() {
    if (this.authService.hasRole(this.allowedRoles)) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
