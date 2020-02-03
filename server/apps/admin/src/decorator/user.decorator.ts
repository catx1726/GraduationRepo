import { createParamDecorator } from '@nestjs/common';

export const UserDeco = createParamDecorator((data, req) => {
  console.log('处于自定义的装饰器中：', data, req);
  return req.query;
});
