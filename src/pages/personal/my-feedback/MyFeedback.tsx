import React, { useEffect, useState } from 'react'
import { Feedback } from '@/interface/user'
import style from './style.module.scss'
import { Modal, Table, TablePaginationConfig } from 'antd'
import { getFeedbackPagesApi } from '@/api/user/feedback-api'
import Column from 'antd/es/table/Column'

const MyFeedbackHooks: any = (): any => {
    const [feedbackList, setFeedbackList] = useState<Array<Feedback>>([])
    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [feedbackDetailModalOpen, setFeedbackDetailModalOpen] = useState<boolean>(false)
    const [currentFeedback, setCurrentFeedback] = useState<Feedback>()
    const [currentFeedbackImgList, setCurrentFeedbackImgList] = useState<Array<string>>([])

    useEffect(() => {
        // 获取反馈信息
        getFeedbackPagesApi().then((res) => {
            setFeedbackList(res.data.list)
            setTotal(total)
        })
    }, [currentPage])

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
        setCurrentPage,
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
        setCurrentPage,
        openFeedbackDetailModal,
        closeFeedbackDetailModal
    } = MyFeedbackHooks()

    // 解析当前反馈图片列表
    const transformCurrentFeedbackImgList = currentFeedbackImgList.map((item: string, index: number) => {
        return <img src={item} key={index} alt='' className={style.myFeedbackImg} />
    })

    // 反馈详情对话框
    const feedbackDetailModal: JSX.Element = (
        <Modal title='反馈详情' centered open={feedbackDetailModalOpen} footer={null}
               onCancel={closeFeedbackDetailModal}>
            {!!currentFeedback && <div dangerouslySetInnerHTML={{__html: currentFeedback.content}} />}
            {currentFeedbackImgList.length === 0  ? <span>暂未上传图片</span> : <>{transformCurrentFeedbackImgList}</>}
        </Modal>
    )

    return (
        <div className={style.main}>
            <div className={style.card}>
                <Table dataSource={feedbackList} pagination={{pageSize: 10, total: total}}
                       onChange={(pagination: TablePaginationConfig) => setCurrentPage(pagination.current)}
                       rowKey='feedbackId'>
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