import { Serial } from '../types'

export function generateSetSerial(): Serial {
  return Math.floor(Math.random() * 10000).toString() as Serial
}
