import { AxiosResponse } from 'axios'
import { Feedback } from '@/interface/user'
import request from '@/request'

// 用户反馈接口
const saveFeedbackApi = (data: Feedback): Promise<AxiosResponse> => {
    return request({
        url: '/user/feedback/save',
        method: 'POST',
        data: data
    }, true)
}

// 用户反馈分页信息
const getFeedbackPagesApi = (pageNum: number = 1, pageSize: number = 10): Promise<AxiosResponse> => {
    return request({
        url: '/user/feedback/pages',
        method: 'GET',
        params: {
            page_num: pageNum,
            page_size: pageSize
        }
    }, true)
}

export { saveFeedbackApi, getFeedbackPagesApi }