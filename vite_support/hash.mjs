import crypto from 'node:crypto'

const hash = crypto.hash ?? (
  (algorithm, data, outputEncoding) =>
    crypto.createHash(algorithm).update(data).digest(outputEncoding)
)

/**
 * Generate a sha256 hash of a content. "Stolen" from vite source code.
 * @see https://github.com/vitejs/vite/blob/87c55022490d4710934c482abf5fbd4fcda9c3c9/packages/vite/src/node/utils.ts#L1034
 * @param text {String}
 * @param length {Number}
 * @returns {String}
 */
const getHash = (text, length = 8) => {
  const h = hash('sha256', text, 'hex').substring(0, length)
  if (length <= 64) return h
  return h.padEnd(length, '_')
}

export { getHash }
