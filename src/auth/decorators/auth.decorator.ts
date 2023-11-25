import { SetMetadata } from '@nestjs/common'
import { AuthOptions } from 'src/utils/interfaces'

export const Auth = (options?: AuthOptions) => {
  const metadata = {
    isLive: options?.isLive ?? true,
    isOpen: options?.isOpen ?? false,
    roles: options?.roles ?? [],
    permission: options?.permission ?? '',
  }

  return SetMetadata('authOptions', metadata)
}
