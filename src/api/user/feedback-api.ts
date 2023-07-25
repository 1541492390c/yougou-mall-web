import { AxiosResponse } from 'axios'
import { Feedback } from '@/interface/user'
import request from '@/request'

// 用户反馈接口
const saveFeedbackApi = (data: Feedback): Promise<AxiosResponse> => {
    return request({
        url: '/user/register',
        method: 'POST',
        data: data
    })
}

export { saveFeedbackApi }