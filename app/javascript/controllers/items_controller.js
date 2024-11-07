import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect () {
    this.template = document.createElement("template")
  }

  /**
   * @param {CustomEvent} e
   */
  prepend(e) {
    const { detail } = e
    const { content } = detail

    this.element.prepend(this.itemHTML(content))
  }

  /**
   * @param {CustomEvent} e
   */
  remove(e) {
    const { detail } = e
    const { element } = detail
    element.remove()
  }

  /**
   * @param {CustomEvent} e
   */
  replace(e) {
    const { detail } = e
    const { element, content } = detail
    element.replaceWith(this.itemHTML(content))
  }

  itemHTML(content) {
    this.template.innerHTML = content
    return this.template.content.cloneNode(true)
  }
}
