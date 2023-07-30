import { AxiosResponse } from 'axios'
import request from '@/request'

// 注册接口
const registerApi = (values: { username: string, password: string, email: string }): Promise<AxiosResponse> => {
    return request({
        url: '/user/register',
        method: 'POST',
        data: values
    })
}

// 获取用户信息接口
const getUserinfoApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/user/info',
        method: 'GET'
    }, true)
}

export { registerApi, getUserinfoApi }