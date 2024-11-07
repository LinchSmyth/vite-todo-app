import { Controller } from "@hotwired/stimulus"
import { submitForm } from '../utils'

export default class extends Controller {
  static targets = ["action", "input"]
  static values = {
    eventName: String
  }

  submit(e) {
    this.disabled = true
    submitForm(e)
      .then((content) => {
        this.inputTarget.value = ""
        this.inputTarget.focus()
        this.disabled = false
        this.dispatch(this.eventNameValue, { detail: { content } })
      })
      .catch(() => (this.disabled = false))
  }

  set disabled (value) {
    this.actionTargets.forEach((el) => (el.disabled = value))
  }
}
