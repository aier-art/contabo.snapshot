#!/usr/bin/env -S node --loader=@w5/jsext --trace-uncaught --expose-gc --unhandled-rejections=strict
var access_token, api, body, k, ref, req, v, x;

import {
  v4 as uuid
} from 'uuid';

import KEY from '../KEY.mjs';

body = new FormData();

body.append('grant_type', 'password');

ref = Object.entries(KEY);
for (x of ref) {
  [k, v] = x;
  body.append(k, v);
}

req = async(url, opt) => {
  var err, r, retry;
  retry = 9;
  while (--retry) {
    try {
      r = (await fetch(url, opt));
      break;
    } catch (error) {
      err = error;
      console.trace();
      console.error(url);
      console.error(err);
    }
  }
  if (r.status === 204) {
    return;
  }
  r = (await r.json());
  if (r.error) {
    throw r;
  }
  return r;
};

({access_token} = (await req('https://auth.contabo.com/auth/realms/contabo/protocol/openid-connect/token', {
  method: 'POST',
  body: new URLSearchParams(body)
})));

export default api = (url, opt = {}) => {
  return req('https://api.contabo.com/v1/' + url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
      'x-trace-id': new Date() - 0,
      'x-request-id': uuid()
    },
    ...opt
  });
};

api.post = (url, body) => {
  return api(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
};
