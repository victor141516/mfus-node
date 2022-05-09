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
