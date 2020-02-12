import { createParamDecorator } from '@nestjs/common'

export const Search_Query = createParamDecorator((data, req) => {
  return req.query
})
