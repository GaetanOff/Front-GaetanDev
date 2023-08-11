import {Injectable} from '@angular/core';
import {Time} from "@angular/common";
import {LocalstorageService} from "../localstorage/localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private dateLimit: Date = new Date();

  constructor(private localStorage: LocalstorageService) {
    const limit: string | null = this.localStorage.get.getItem("limit");
    if (limit !== null) {
      this.dateLimit = new Date(parseInt(limit));
    }
  }

  setLimit(limit: Time): void {
    const now: Date = new Date();
    this.dateLimit = new Date(now.getTime() + this.convertTimeToMilliseconds(limit));
    this.localStorage.get.setItem("limit", this.dateLimit.getTime().toString());
  }

  getLimit(): Time {
    const now: Date = new Date();
    const remainingMilliseconds: number = this.dateLimit.getTime() - now.getTime();
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
    return {hours, minutes};
  }
}
