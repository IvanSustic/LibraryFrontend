import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRoles = this.auth.getUserRole();
    if (!userRoles) {
      this.router.navigate(['/login']);
      return false;
    }
    try {

      const hasRole = expectedRoles.some(role => userRoles.includes(role));
      if (!hasRole) {
        this.router.navigate(['/unauthorized']); 
      }

      return hasRole;
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }

}