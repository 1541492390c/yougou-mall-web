import { AxiosResponse } from 'axios'
import request from '@/request'
import { BannerTypeEnum } from '@/enums'

// 获取轮播图列表
const getBannerListApi = (type: BannerTypeEnum, page: string): Promise<AxiosResponse> => {
    return request({
        url: '/platform/banner/list',
        method: 'GET',
        params: {
            type: type,
            page: page
        }
    })
}

// 获取反馈类型列表
const getFeedbackTypeListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/platform/feedback_type/list',
        method: 'GET'
    })
}

export { getBannerListApi, getFeedbackTypeListApi }