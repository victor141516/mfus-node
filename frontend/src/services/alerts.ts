export class AlertManager {
  private alerts: string[]
  private cb: (msg: string) => void

  constructor() {
    this.alerts = []
    this.cb = (_: string) => {}
  }

  add(alert: string) {
    this.alerts.push(alert)
    this.cb(alert)
  }

  remove(alert: string) {
    this.alerts = this.alerts.filter((a) => a !== alert)
  }

  onAlert(cb: (msg: string) => void) {
    this.cb = cb
  }
}
