import axios from 'axios'
import { API_URL, REQUEST_TIME_OUT } from '../constants/constant'
import Qs from 'qs'

export default {
  commonRequest (params, resolve, reject) {
    return axios.request({
      url: params.url,
      method: params.method,
      baseURL: `${API_URL}/api/v1/`,
      params: params.params || {},
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
      },
      data: {
        ...(params.data || {})
      },
      withCredentials: true,
      timeout: REQUEST_TIME_OUT
    }).then(res => resolve(res)).catch(err => reject(err))
  },
  validCodeRequest (params, resolve, reject) {
    return axios.request({
      url: params.url,
      method: params.method,
      baseURL: `${API_URL}/`,
      params: params.params || {},
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
      },
      data: {
        ...(params.data || {})
      },
      responseType: 'blob',
      timeout: REQUEST_TIME_OUT
    }).then(res => resolve(res)).catch(err => reject(err))
  }
}
