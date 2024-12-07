import { promisify } from 'util'
import { randomBytes } from 'crypto'

const asyncRandomBytes = promisify(randomBytes)

export default async function getResetKey(size){
  const token = await asyncRandomBytes(size)
  return token.toString('hex')
}




