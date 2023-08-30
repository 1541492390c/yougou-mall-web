import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { getFeedbackTypeListApi } from '@/api/platform/platform-api'
import { FeedbackType } from '@/interface/platform'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Button, Input, message, Radio, RadioChangeEvent, Upload, UploadFile } from 'antd'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { PlusOutlined } from '@ant-design/icons'
import { deleteFileApi, uploadFileApi } from '@/api/extra/resource-api'
import { ResourceTypeEnum } from '@/enums'
import { isEmpty } from '@/utils'
import { Feedback } from '@/interface/user'
import { saveFeedbackApi } from '@/api/user/feedback-api'

const FeedbackHooks: any = (): any => {
    const [messageApi, messageContextHolder] = message.useMessage()
    const [feedbackTypeList, setFeedbackTypeList] = useState<Array<FeedbackType>>([])
    const [fileList, setFileList] = useState<Array<UploadFile>>([])
    const [currentFeedbackType, setCurrentFeedbackType] = useState<FeedbackType>()
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [feedbackContent, setFeedbackContent] = useState<string>('')
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const contactWayInput = useRef<any>()
    const editorConfig = useRef<Partial<IEditorConfig>>({placeholder: '请输入内容...'})
    const toolbarConfig = useRef<Partial<IToolbarConfig>>({
        toolbarKeys: ['emotion', 'bulletedList', 'numberedList']
    })

    useEffect(() => {
        document.title = '优购商城,意见反馈'

        // 获取用户反馈类型列表
        getFeedbackTypeListApi().then((res) => {
            if (!!res.data) {
                setFeedbackTypeList(res.data)
                setCurrentFeedbackType(res.data[0])
            }
        })
        return () => {
            if (editor === null) {
                return
            }
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    // 图片上传之前钩子
    const beforeUploadFile = (file: UploadFile): boolean => {
        if (file.type !== 'image/jpeg') {
            messageApi.error('请选择png、jpg格式文件').then()
            return false
        }
        return true
    }

    // 上传图片
    const uploadFile = (option: any): void => {
        let formData: FormData = new FormData()
        formData.append('resourceType', ResourceTypeEnum.FEEDBACK.toString())
        formData.append('file', option.file as File)
        uploadFileApi(formData).then((res) => {
            if (res) {
                messageApi.success('上传成功').then()
                let newFileList: Array<UploadFile> = [...fileList]
                newFileList.push({
                    name: res.data.substring(res.data.lastIndexOf('/') + 1, res.data.length),
                    url: res.data,
                    response: undefined,
                    uid: res.data,
                    xhr: undefined,
                    status: 'success'
                })
                setFileList(newFileList)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 移除图片
    const removeFile = (file: UploadFile): void => {
        deleteFileApi(file.name, ResourceTypeEnum.FEEDBACK).then((res) => {
            if (res) {
                let newFileList: Array<UploadFile> = [...fileList]
                for (let index in newFileList) {
                    if (newFileList[index].name === file.name) {
                        newFileList.splice(parseInt(index), 1)
                    }
                }
                setFileList(newFileList)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    // 提交反馈
    const submit = (): void => {
        setButtonDisabled(true)
        if (isEmpty(currentFeedbackType)) {
            messageApi.error('请选择反馈类型').then()
            return
        }
        if (isEmpty(feedbackContent)) {
            messageApi.error('请输入反馈内容').then()
            return
        }
        let imgList: Array<string> = []
        fileList.forEach((item: UploadFile) => imgList.push(item.url as string))
        let feedback: Feedback = {
            feedbackTypeId: currentFeedbackType?.feedbackTypeId,
            feedbackTypeName: currentFeedbackType?.name,
            content: feedbackContent,
            imgList: JSON.stringify(imgList),
            contactWay: contactWayInput.current.input.value
        }
        saveFeedbackApi(feedback).then((res) => {
            if (res) {
                messageApi.success('反馈成功').then()
                // 重置
                setFeedbackContent('')
                contactWayInput.current.input.value = ''
                setFileList([])
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setButtonDisabled(false)
        })
    }

    return {
        messageContextHolder,
        feedbackTypeList,
        fileList,
        currentFeedbackType,
        buttonDisabled,
        feedbackContent,
        contactWayInput,
        editor,
        editorConfig,
        toolbarConfig,
        beforeUploadFile,
        uploadFile,
        removeFile,
        setCurrentFeedbackType,
        setFeedbackContent,
        setEditor,
        submit
    }
}

const FeedbackPage: React.FC = (): JSX.Element => {
    const {
        messageContextHolder,
        feedbackTypeList,
        fileList,
        currentFeedbackType,
        buttonDisabled,
        feedbackContent,
        contactWayInput,
        editor,
        editorConfig,
        toolbarConfig,
        beforeUploadFile,
        uploadFile,
        removeFile,
        setCurrentFeedbackType,
        setFeedbackContent,
        setEditor,
        submit
    } = FeedbackHooks()

    // 解析用户反馈类型列表
    const transformFeedbackTypeList: JSX.Element = feedbackTypeList.map((item: FeedbackType, index: number) => {
        return <Radio key={index} value={item} className={style.radio}>{item.name}</Radio>
    })

    return (
        <>
            <Header />
            <div className={style.main}>
                {/*反馈类型*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <Radio.Group onChange={(e: RadioChangeEvent) => setCurrentFeedbackType(e.target.value)}
                                     className={style.radioGroup} value={currentFeedbackType}>
                            {transformFeedbackTypeList}
                        </Radio.Group>
                    </div>
                </div>
                {/*联系方式*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>联系方式(手机\邮箱\微信)</span>
                        </div>
                        <Input ref={contactWayInput} placeholder='手机\邮箱\微信'
                               style={{height: '50px', width: '100%'}} />
                    </div>
                </div>
                {/*上传图片*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>上传图片</span>
                        </div>
                        <div className={style.flex}>
                            <Upload listType='picture-card' fileList={fileList}
                                    customRequest={uploadFile} beforeUpload={beforeUploadFile} onRemove={removeFile}>
                                {fileList.length >= 6 ? null : <PlusOutlined />}
                            </Upload>
                        </div>
                    </div>
                </div>
                {/*反馈内容*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>反馈内容</span>
                        </div>
                        <Toolbar editor={editor} defaultConfig={toolbarConfig.current} />
                        <Editor
                            defaultConfig={editorConfig.current}
                            value={feedbackContent}
                            mode='simple'
                            onCreated={setEditor}
                            onChange={(editor: IDomEditor) => setFeedbackContent(editor.getHtml)}
                            className={style.editor} />
                    </div>
                </div>
                <div className={style.submit}>
                    <Button disabled={buttonDisabled} onClick={submit} type='primary'>发送反馈</Button>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default FeedbackPage