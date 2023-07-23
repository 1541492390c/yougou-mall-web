import request from '@/request'
import { AxiosResponse } from 'axios'

const loginApi = (username: string, password: string, code: string): Promise<AxiosResponse> => {
    return request({
        url: '/auth/login',
        method: 'POST',
        params: {
            username: username,
            password: password,
            code: code
        }
    })
}

const logoutApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/auth/logout',
        method: 'GET'
    }, true)
}

// 获取认证信息账号
const getAuthAccountApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/auth/info',
        method: 'GET'
    }, true)
}

export { loginApi, logoutApi, getAuthAccountApi }