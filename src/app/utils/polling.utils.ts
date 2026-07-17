import { Observable, Subject, Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Starts an immediate call then polls on `intervalMs` until `stop$` emits.
 * Returns a subscription the caller can also unsubscribe from manually.
 */
export function startPolling(
  intervalMs: number,
  stop$: Subject<void>,
  tick: () => void
): Subscription {
  tick();
  return interval(intervalMs)
    .pipe(takeUntil(stop$))
    .subscribe(() => tick());
}

/**
 * Loads data with optional loading toast feedback.
 * Returns true if a load was started, false if skipped because already loading.
 */
export function runRefreshLoad<T>(options: {
  isBusy: () => boolean;
  setBusy: (busy: boolean) => void;
  request: () => Observable<T>;
  onSuccess: (data: T) => void;
  onError?: (error: unknown) => void;
  loadingToast?: string | number;
  successToast?: (id: string | number) => void;
  errorToast?: (id?: string | number) => void;
  detectChanges?: () => void;
}): boolean {
  if (options.isBusy()) {
    return false;
  }

  options.setBusy(true);

  options.request().subscribe({
    next: (data) => {
      options.onSuccess(data);
      options.setBusy(false);
      options.detectChanges?.();
      if (options.loadingToast !== undefined && options.successToast) {
        options.successToast(options.loadingToast);
      }
    },
    error: (error) => {
      options.setBusy(false);
      options.detectChanges?.();
      options.onError?.(error);
      if (options.errorToast) {
        options.errorToast(options.loadingToast);
      }
    },
  });

  return true;
}
