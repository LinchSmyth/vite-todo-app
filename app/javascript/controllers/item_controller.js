import { Controller } from "@hotwired/stimulus"
import { submitForm } from '../utils'

export default class extends Controller {
  static targets = ["removeButton"]

  remove(e) {
    this.disabled = true
    submitForm(e)
      .then(() => this.dispatch("removed", { detail: { element: this.element } }))
      .catch(() => (this.disabled = false))
  }

  update(e) {
    this.disabled = true
    submitForm(e, e.target.form)
      .then((content) => this.dispatch("updated", { detail: { element: this.element, content }}))
  }

  set disabled(value) {
    this.removeButtonTarget.disabled = value
  }
}
