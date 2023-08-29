import { AxiosResponse } from 'axios'
import request from '@/request'

// 注册接口
const registerApi = (value: {
    username: string,
    password: string,
    email: string,
    mobile: string
}): Promise<AxiosResponse> => {
    return request({
        url: '/user/register',
        method: 'POST',
        data: value
    })
}

// 获取用户信息接口
const getUserinfoApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/user/info',
        method: 'GET'
    }, true)
}

// 更新用户信息接口
const updateUserApi = (value: { gender: number, nickname: string, birthday: string }): Promise<AxiosResponse> => {
    return request({
        url: '/user/update',
        method: 'PUT',
        data: value
    }, true)
}

// 更新头像
const updateAvatarApi = (value: { avatar: string }): Promise<AxiosResponse> => {
    return request({
        url: '/user/update',
        method: 'PUT',
        data: value
    }, true)
}

export { registerApi, getUserinfoApi, updateUserApi, updateAvatarApi }