import request from '@/request'
import { AxiosResponse } from 'axios'

// 登录接口
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

// 退出登录接口
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

// 更新认证账号信息
const updateAuthAccountApi = (value: { username: string, email: string, mobile: string }): Promise<AxiosResponse> => {
    return request({
        url: '/auth/update',
        method: 'PUT',
        data: value
    }, true)
}

// 修改密码
const updatePasswordApi = (value: { updatePassType: number, mobile: string, newPassword: string }): Promise<AxiosResponse> => {
    return request({
        url: '/auth/update_password',
        method: 'PUT',
        data: value
    }, true)
}

export { loginApi, logoutApi, getAuthAccountApi, updateAuthAccountApi, updatePasswordApi }