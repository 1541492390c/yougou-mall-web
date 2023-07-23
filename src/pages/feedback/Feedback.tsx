import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { getFeedbackTypeListApi } from '@/api/platform/platform-api'
import { FeedbackType } from '@/interface/platform'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Button, Input, Radio, RadioChangeEvent, Upload } from 'antd'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { PlusOutlined } from '@ant-design/icons'
import { uploadFileApi } from '@/api/biz/resource-api'
import { UploadFileTypeEnum } from '@/enums'

const FeedbackHooks: any = (): any => {
    const [feedbackTypeList, setFeedbackTypeList] = useState<Array<FeedbackType>>([])
    const [imgList, setImgList] = useState<Array<string>>([])
    const [currentFeedbackType, setCurrentFeedbackType] = useState<number>(0)
    const [feedbackContent, setFeedbackContent] = useState<string>()
    const [editor, setEditor] = useState<IDomEditor | null>(null)
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

    // 上传图片
    const uploadFile = (option: any): void => {
        let formData: FormData = new FormData()
        formData.append('resourceType', UploadFileTypeEnum.FEEDBACK.toString())
        formData.append('file', option.file as File)
        uploadFileApi(formData).then((res) => {
            setImgList((pre) => {
                pre.push(res.data)
                return pre
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    return {
        feedbackTypeList,
        imgList,
        currentFeedbackType,
        feedbackContent,
        editor,
        editorConfig,
        toolbarConfig,
        uploadFile,
        setCurrentFeedbackType,
        setFeedbackContent,
        setEditor
    }
}

const FeedbackPage: React.FC = (): JSX.Element => {
    const {
        feedbackTypeList,
        imgList,
        currentFeedbackType,
        feedbackContent,
        editor,
        editorConfig,
        toolbarConfig,
        uploadFile,
        setCurrentFeedbackType,
        setFeedbackContent,
        setEditor
    } = FeedbackHooks()

    // 解析用户反馈类型列表
    const transformFeedbackTypeList: JSX.Element = feedbackTypeList.map((item: FeedbackType, index: number) => {
        return <Radio key={index} value={item.feedbackTypeId} className={style.radio}>{item.name}</Radio>
    })

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.block}>
                    <div className={style.card}>
                        <Radio.Group onChange={(e: RadioChangeEvent) => setCurrentFeedbackType(e.target.value)}
                                     className={style.radioGroup} value={currentFeedbackType}>
                            {transformFeedbackTypeList}
                        </Radio.Group>
                    </div>
                </div>
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>联系方式(手机\邮箱\微信)</span>
                        </div>
                        <Input placeholder='手机\邮箱\微信' style={{height: '50px', width: '100%'}} />
                    </div>
                </div>
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>上传图片</span>
                        </div>
                        <div className={style.flex}>
                            <Upload listType='picture-card' customRequest={uploadFile}>
                                {imgList.length >= 8 ? <></> : <PlusOutlined />}
                            </Upload>
                        </div>
                    </div>
                </div>
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
                            onChange={(editor: IDomEditor) => setFeedbackContent(editor.getHtml)} />
                    </div>
                </div>
                <div className={style.submit}>
                    <Button type='primary'>发送反馈</Button>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default FeedbackPage