/* eslint-disable no-undef */
import axios from 'axios';
import { parse, stringify } from 'qs';

const AXClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: {
    encode: parse,
    serialize: stringify,
  },
});

// axiosClient.interceptors.request.use((config) => {
//   if (AuthStorage.getKey('token')) {
//     config.headers = {
//       Authorization: `Bearer ${AuthStorage.getKey('token')}`,
//     };
//   }
//   return config;
// });

AXClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error(error.response);
    return error.response;
  },
);

export default AXClient;
