import { AxiosResponse } from 'axios'
import request from '@/request'

// 发送验证码接口
const sendSmsApi = (mobile: string): Promise<AxiosResponse> => {
    return request({
        url: '/extra/sms/send',
        method: 'POST',
        params: {
            mobile: mobile
        }
    })
}

// 验证手机号接口
const validateMobileApi = (mobile: string, code: string): Promise<AxiosResponse> => {
    return request({
        url: '/extra/sms/validate',
        method: 'POST',
        params: {
            mobile: mobile,
            code: code
        }
    })
}

export { sendSmsApi, validateMobileApi }