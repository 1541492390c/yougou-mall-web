import { AxiosResponse } from 'axios'
import request from '@/request'

// 上传文件接口
const uploadFileApi = (data: FormData): Promise<AxiosResponse> => {
    return request({
        url: '/extra/resource/upload',
        method: 'POST',
        headers: {'content-type': 'multipart/form-data'},
        data: data
    }, true)
}

// 删除文件接口
const deleteFileApi = (value: string, type: number): Promise<AxiosResponse> => {
    return request({
        url: '/extra/resource/delete',
        method: 'DELETE',
        params: {
            file_name: value,
            resource_type: type
        }
    }, true)
}

export { uploadFileApi, deleteFileApi }