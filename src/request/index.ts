import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ResponseCodeEnum } from '@/enums'
import { message } from 'antd'

export const baseUrl: string = 'http://127.0.0.1:8000'

const request = (config: AxiosRequestConfig, auth: boolean = false): Promise<AxiosResponse> => {
    const instance: AxiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 5000
    })

    instance.interceptors.request.use((config: InternalAxiosRequestConfig): any => {
        if (auth && !!localStorage.getItem('token')) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        }
        return config
    })

    instance.interceptors.response.use((res: AxiosResponse): any => {
        if (res.data.code === ResponseCodeEnum.OK) {
            return res.data
        } else if (res.data.code === ResponseCodeEnum.UN_VALID_ERROR) {
            localStorage.removeItem('token')
            message.error(res.data.message).then()
        } else {
            message.error(res.data.message).then()
        }
    })

    return instance(config)
}

export default request