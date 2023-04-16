import request from '@/request/index'
import { AxiosResponse } from 'axios'

const loginApi = (username: string, password: string): Promise<AxiosResponse> => {
    return request({
        url: '/auth/login',
        method: 'POST',
        params: {
            username: username,
            password: password
        }
    })
}

export { loginApi }