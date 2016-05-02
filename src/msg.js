import stringify from './stringify'
import customUtilFormat from 'custom-util-format'

const format = customUtilFormat({
  j: stringify
})

export function formatMsg(msg) {
  return Array.isArray(msg) ? format(...msg) : msg
}
