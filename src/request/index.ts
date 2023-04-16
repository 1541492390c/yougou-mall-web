import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ResponseCode } from '@/enums'
import { message } from 'antd'

export const baseUrl: string = 'http://127.0.0.1:8000'
export const  imgBaseUrl: string = 'https://yougou-mall-resources.oss-cn-guangzhou.aliyuncs.com/resources'

const request: AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000
})

request.interceptors.request.use((config: InternalAxiosRequestConfig): any => {
    if (localStorage.getItem('token') != null) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
    return config
})

request.interceptors.response.use((res: AxiosResponse): any => {
    if (res.data.code === ResponseCode.OK) {
        return res
    } else if (res.data.code === ResponseCode.UN_VALID_ERROR) {
        localStorage.removeItem('token')
        message.error(res.data.message).then()
    } else {
        message.error(res.data.message).then()
    }
})

export default request