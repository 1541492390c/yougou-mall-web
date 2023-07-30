import { IComment } from '@/interface/user'
import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取评价评分统计
const getCommentRateStatisticsApi = (productId: string | undefined): Promise<AxiosResponse> => {
    return request({
        url: '/user/comment/rate_statistics',
        method: 'GET',
        params: {product_id: productId}
    })
}

// 获取评论分页信息接口
const getCommentPagesApi = (productId: string | undefined, pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/user/comment/pages',
        method: 'GET',
        params: {
            product_id: productId,
            page_num: pageNum,
            page_size: pageSize
        }
    })
}

// 保存评论接口
const saveCommentApi = (data: IComment): Promise<AxiosResponse> => {
    return request({
        url: '/user/comment/save',
        method: 'POST',
        data: data
    }, true)
}

export { getCommentRateStatisticsApi, getCommentPagesApi, saveCommentApi }