import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  submit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
  }
}
