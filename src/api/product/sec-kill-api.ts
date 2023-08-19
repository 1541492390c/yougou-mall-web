import { AxiosResponse } from 'axios'
import request from '@/request'

// 获取秒杀活动场次接口
const getSecKillListApi = (): Promise<AxiosResponse> => {
    return request({
        url: '/product/sec_kill/list',
        method: 'GET'
    })
}

export { getSecKillListApi }