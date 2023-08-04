import React, { useEffect, useState } from 'react'
import { Feedback } from '@/interface/user'
import style from './style.module.scss'
import { Modal, Table } from 'antd'
import { getFeedbackPagesApi } from '@/api/user/feedback-api'
import Column from 'antd/es/table/Column'

const MyFeedbackHooks: any = (): any => {
    const [feedbackList, setFeedbackList] = useState<Array<Feedback>>([])
    const [total, setTotal] = useState<number>(0)
    const [feedbackDetailModalOpen, setFeedbackDetailModalOpen] = useState<boolean>(false)
    const [currentFeedback, setCurrentFeedback] = useState<Feedback>()
    const [currentFeedbackImgList, setCurrentFeedbackImgList] = useState<Array<string>>([])

    useEffect(() => {
        // 获取反馈信息
        getFeedbackPagesApi().then((res) => {
            setFeedbackList(res.data.list)
            setTotal(total)
        })
    }, [])

    // 打开反馈详情对话框
    const openFeedbackDetailModal = (value: Feedback): void => {
        setFeedbackDetailModalOpen(true)
        setCurrentFeedback(value)
        // 图片列表
        if (!!value.imgList) {
            setCurrentFeedbackImgList(JSON.parse(value.imgList))
        }
    }

    // 关闭反馈详情对话框
    const closeFeedbackDetailModal = (): void => {
        setFeedbackDetailModalOpen(false)
        setCurrentFeedbackImgList([])
    }

    return {
        feedbackList,
        total,
        feedbackDetailModalOpen,
        currentFeedback,
        currentFeedbackImgList,
        openFeedbackDetailModal,
        closeFeedbackDetailModal
    }
}

const MyFeedbackPage: React.FC = (): JSX.Element => {
    const {
        feedbackList,
        total,
        feedbackDetailModalOpen,
        currentFeedback,
        currentFeedbackImgList,
        openFeedbackDetailModal,
        closeFeedbackDetailModal
    } = MyFeedbackHooks()

    // 反馈详情对话框
    const feedbackDetailModal: JSX.Element = (
        <Modal title='反馈详情' centered open={feedbackDetailModalOpen} footer={null}
               onCancel={closeFeedbackDetailModal}>
            {!!currentFeedback && <div dangerouslySetInnerHTML={{__html: currentFeedback.content}} />}
            {(() => {
                if (currentFeedbackImgList.length === 0) {
                    return <span>暂未上传图片</span>
                } else {
                    return (
                        <>
                            {currentFeedbackImgList.map((item: string, index: number) => {
                               return <img src={item} key={index} alt='' className={style.myFeedbackImg} />
                            })}
                        </>
                    )
                }
            })()}
        </Modal>
    )

    return (
        <div className={style.main}>
            <div className={style.card}>
                <Table pagination={{pageSize: 10, total: total}} dataSource={feedbackList} rowKey='feedbackId'
                       size='middle'>
                    <Column title='反馈类型' align='center' dataIndex='feedbackTypeName' />
                    <Column title='联系方式' align='center' dataIndex='contactWay' />
                    <Column title='操作' align='center' render={(record: Feedback) => {
                        return (
                            <div className={style.edit}>
                                <span onClick={() => openFeedbackDetailModal(record)}>详情</span>
                            </div>
                        )
                    }} />
                </Table>
            </div>
            {/*反馈详情对话框*/}
            {feedbackDetailModal}
        </div>
    )
}

export default MyFeedbackPage