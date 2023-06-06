import { AxiosResponse } from 'axios'
import request from '@/request'

const getBannerListApi = (type: number, page: string): Promise<AxiosResponse> => {
    return request({
        url: '/platform/banner/list',
        method: 'GET',
        params: {
            type: type,
            page: page
        }
    })
}

export { getBannerListApi }