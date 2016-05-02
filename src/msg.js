import loupe from 'loupe'
import customUtilFormat from 'custom-util-format'

const format = customUtilFormat({
  j: loupe
})

export function formatMsg(msg) {
  return Array.isArray(msg) ? format(...msg) : msg
}
