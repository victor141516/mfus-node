export enum ERROR_CODES {
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  MISSING_URL = 'MISSING_URL',
}

export const getAlertText = (errorCode: string) =>
  ({
    DUPLICATE_KEY: 'That URL is already used',
    MISSING_URL: 'You must enter a URL to short',
  }[errorCode] ?? 'Unknown error')

export class AlertManager {
  private alerts: Set<string>
  private cb: (msg: string) => void

  constructor() {
    this.alerts = new Set()
    this.cb = (_: string) => {}
  }

  add(alert: string) {
    if (!this.alerts.has(alert)) {
      this.alerts.add(alert)
      this.cb(alert)
    }
  }

  remove(alert: string) {
    this.alerts.delete(alert)
  }

  onAlert(cb: (msg: string) => void) {
    this.cb = cb
  }
}
