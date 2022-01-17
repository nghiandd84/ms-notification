import { createParamDecorator } from '@nestjs/common';
import { User } from 'dn-api-core';

export const PrincipalUser = createParamDecorator((data, req) => {
  console.log(req);
  return req.user as User;
});
