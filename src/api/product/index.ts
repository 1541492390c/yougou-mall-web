import { AxiosResponse } from 'axios'
import request from '@/request'

const getCategoryListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/category/list',
        method: 'GET'
    })
}

export { getCategoryListApi }