import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import { Location, NavigateFunction, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/header/Header'
import { OrderItem } from '@/interface/order'
import Footer from '@/components/footer/Footer'
import { Button, message, Rate, Upload, UploadFile } from 'antd'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { PlusOutlined } from '@ant-design/icons'
import { UploadFileTypeEnum } from '@/enums'
import { uploadFileApi } from '@/api/biz/resource-api'
import { isEmpty } from '@/utils'
import { IComment } from '@/interface/user'
import { saveCommentApi } from '@/api/user/comment-api'

const CommentHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const location: Location = useLocation()
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [rate, setRate] = useState<number>()
    const [commentContent, setCommentContent] = useState<string>('')
    const [orderItem, setOrderItem] = useState<OrderItem>()
    const [fileList, setFileList] = useState<Array<UploadFile>>([])
    const [messageApi, messageContextHolder] = message.useMessage()
    const [editor, setEditor] = useState<IDomEditor | null>(null)
    const editorConfig = useRef<Partial<IEditorConfig>>({placeholder: '请输入内容...'})
    const toolbarConfig = useRef<Partial<IToolbarConfig>>({
        toolbarKeys: ['emotion', 'bulletedList', 'numberedList']
    })

    useEffect(() => {
        if (!location || !location.state.orderItem) {
            navigate('/personal')
        } else {
            setOrderItem(location.state.orderItem)
        }

        return () => {
            if (editor === null) {
                return
            }
            editor.destroy()
            setEditor(null)
        }
    }, [location.state.orderItem])

    // 解析规格
    const transformSpecs = (value: string) => {
        if (!value) {
            return
        }
        let object = JSON.parse(value)
        let specs = ''
        for (let index in object) {
            specs += object[index] + ','
        }
        return specs.substring(0, specs.length - 1)
    }

    // 上传图片
    const uploadFile = (option: any): void => {
        let formData: FormData = new FormData()
        formData.append('resourceType', UploadFileTypeEnum.COMMENT.toString())
        formData.append('file', option.file as File)
        uploadFileApi(formData).then((res) => {
            if (res) {
                messageApi.success('上传成功').then()
                let newFileList: Array<UploadFile> = [...fileList]
                newFileList.push({
                    name: res.data,
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

    // 提交评论
    const submit = (): void => {
        setButtonDisabled(true)
        if (isEmpty(rate)) {
            setButtonDisabled(false)
            messageApi.error('请选择评分').then()
            return
        }
        let imgList: Array<string> = []
        fileList.forEach((item: UploadFile) => imgList.push(item.url as string))
        let comment: IComment = {
            orderId: orderItem?.orderId,
            orderItemId: orderItem?.orderItemId,
            productId: orderItem?.productId,
            content: commentContent,
            imgList: JSON.stringify(imgList),
            rate: rate
        }
        saveCommentApi(comment).then((res) => {
            if (res) {
                messageApi.success({
                    content: '评论成功',
                    onClose: () => {
                        navigate('/personal')
                    }
                }).then()
            }
        })
    }

    return {
        rate,
        orderItem,
        commentContent,
        fileList,
        buttonDisabled,
        editor,
        messageContextHolder,
        editorConfig,
        toolbarConfig,
        setRate,
        setCommentContent,
        setEditor,
        transformSpecs,
        uploadFile,
        submit
    }
}

const CommentPage: React.FC = (): JSX.Element => {
    const {
        rate,
        orderItem,
        commentContent,
        fileList,
        buttonDisabled,
        editor,
        messageContextHolder,
        editorConfig,
        toolbarConfig,
        setRate,
        setCommentContent,
        setEditor,
        transformSpecs,
        uploadFile,
        submit
    } = CommentHooks()

    return (
        <>
            <Header />
            <div className={style.main}>
                {/*商品详情*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.productDetail}>
                            <img src={orderItem?.img} alt='' className={style.productImg} />
                            <div className={style.productName}>
                                <div><NavLink
                                    to={`/detail/${orderItem?.productId}`}>{orderItem?.productName}</NavLink></div>
                                <div className={style.flex}>
                                    <div className={style.specsAndTotal}>{transformSpecs(orderItem?.specs)}</div>
                                    <div className={style.specsAndTotal}>x{orderItem?.quantity}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*评分*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.cardTitle}>
                            <span className={style.cardTitleText}>我的评分</span>
                        </div>
                        <div className={style.rate}>
                            <Rate value={rate} onChange={(value: number) => setRate(value)} className={style.rateCountStar} />
                        </div>
                    </div>
                </div>
                {/*上传图片*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>上传图片</span>
                        </div>
                        <div className={style.flex}>
                            <Upload listType='picture-card' fileList={fileList} customRequest={uploadFile}>
                                {fileList.length >= 6 ? null : <PlusOutlined />}
                            </Upload>
                        </div>
                    </div>
                </div>
                {/*评论内容*/}
                <div className={style.block}>
                    <div className={style.card}>
                        <div className={style.title}>
                            <span>评论内容</span>
                        </div>
                        <Toolbar editor={editor} defaultConfig={toolbarConfig.current} />
                        <Editor
                            defaultConfig={editorConfig.current}
                            value={commentContent}
                            mode='simple'
                            onCreated={setEditor}
                            onChange={(editor: IDomEditor) => setCommentContent(editor.getHtml)}
                            className={style.editor} />
                    </div>
                </div>
                <div className={style.submit}>
                    <Button onClick={submit} disabled={buttonDisabled} type='primary'>发表评论</Button>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default CommentPage