import axios from 'axios'
import {URL_DEV, REQUEST_TIME_OUT} from '../constants/constant'
import Qs from 'Qs'

export default {
  commonRequest (params, resolve, reject) {
    return axios.request({
      url: params.url,
      method: params.method,
      baseURL: `${URL_DEV}/api/v1/`,
      params: params.params || {},
      paramsSerializer: function (params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
      },
      data: {
        ...(params.data || {})
      },
      timeout: REQUEST_TIME_OUT
    }).then(res => resolve(res)).catch(err => reject(err))
  }
}
