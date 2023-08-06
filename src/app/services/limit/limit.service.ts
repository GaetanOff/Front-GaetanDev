import { Injectable } from '@angular/core';
import { Time } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private dateLimit: Date = new Date();

  constructor() { }

  setLimit(limit: Time): void {
    const now: Date = new Date();
    this.dateLimit = new Date(now.getTime() + this.convertTimeToMilliseconds(limit));
  }

  getLimit(): Time {
    const remainingMilliseconds: number = this.dateLimit.getTime() - new Date().getTime();
    return this.convertMillisecondsToTime(remainingMilliseconds);
  }

  checkLimit(): boolean {
    const now: Date = new Date();
    return now.getTime() < this.dateLimit.getTime();
  }

  private convertTimeToMilliseconds(time: Time): number {
    return (time.hours * 60 + time.minutes) * 60 * 1000;
  }

  private convertMillisecondsToTime(milliseconds: number): Time {
    const totalMinutes: number = milliseconds / (60 * 1000);
    const hours: number = Math.floor(totalMinutes / 60);
    const minutes: number = Math.floor(totalMinutes % 60);
    return { hours, minutes };
  }
}
