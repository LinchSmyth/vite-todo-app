/**
 * @param {SubmitEvent, Event} e
 * @param {HTMLFormElement} form
 * @returns {Promise<unknown>}
 */
const submitForm = (e, form = e.target) => {
  if (e instanceof SubmitEvent) {
    e.preventDefault()
  }
  const url = form.action
  const method = form.method
  return new Promise((resolve, reject) => {
    const formData = new FormData(form)
    const headers = {"App-Content-Type": "partial"}
    fetch(url, { headers, method: method, body: formData })
      .then(async (res) => {
        if (res.ok) {
          const content = await res.text()
          resolve(content)
        } else {
          reject()
        }
      })
      .catch((e) => {
        console.error(e)
        reject(e)
      })
  })
}

export default submitForm
