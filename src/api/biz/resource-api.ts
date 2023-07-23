import { AxiosResponse } from 'axios'
import request from '@/request'

// 上传图片接口
const uploadFileApi = (data: FormData): Promise<AxiosResponse> => {
    return request({
        url: '/biz/resource/upload',
        method: 'POST',
        headers: {'content-type': 'multipart/form-data'},
        data: data
    }, true)
}

export { uploadFileApi }