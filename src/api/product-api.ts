import request from '@/request'
import { AxiosInstance, AxiosResponse } from 'axios'

const getCategoryListApi = (): Promise<AxiosResponse> => {
    return  request({
        url: '/product/category/list',
        method: 'GET'
    })
}

export { getCategoryListApi }