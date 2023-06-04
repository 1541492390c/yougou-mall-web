import { AxiosResponse } from 'axios'
import request from '@/request'

const registerApi = (values: { username: string, password: string, email: string }): Promise<AxiosResponse> => {
    return request({
        url: '/user/register',
        method: 'POST',
        data: values
    })
}

const getUserinfoApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/user/info',
        method: 'GET'
    }, true)
}

export { registerApi, getUserinfoApi }