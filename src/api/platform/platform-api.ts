import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取轮播图列表
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