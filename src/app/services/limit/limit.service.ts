import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LimitService {

  private readonly LIMIT_KEY = 'contactFormLimit';

  public checkLimit(): boolean {
    try {
      const limit = localStorage.getItem(this.LIMIT_KEY);
      if (!limit) {
        return false;
      }
      return new Date().getTime() < JSON.parse(limit);
    } catch (e) {
      console.error('Could not access localStorage.', e);
      return false;
    }
  }

  public setLimit({ hours, minutes }: { hours: number, minutes: number }): void {
    const now = new Date();
    const limitTime = now.getTime() + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    try {
      localStorage.setItem(this.LIMIT_KEY, JSON.stringify(limitTime));
    } catch (e) {
      console.error('Could not access localStorage.', e);
    }
  }
}
