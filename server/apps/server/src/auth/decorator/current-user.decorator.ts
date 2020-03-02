import { createParamDecorator } from '@nestjs/common'

export const CurrentUserFromUser = createParamDecorator((data, req) => {
    return req.user
})
