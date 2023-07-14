import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import AddrModal from '@/components/addr-modal/AddrModal'
import {
    DeleteOutlined,
    EnvironmentOutlined, HomeOutlined,
    PhoneOutlined,
    PlusCircleOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons'
import { Addr } from '@/interface'
import { deleteAddrApi, getAddrListApi } from '@/api/user-api'
import { AddrModalTypeEnum } from '@/enums'
import event from '@/event'
import { message, Modal } from 'antd'

const AddrHooks: any = (): any => {
    const [addrList, setAddrList] = useState<Array<Addr>>([])
    const [modal, modalContextHolder] = Modal.useModal()
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        getAddrListApi().then((res) => {
            setAddrList(res.data)
        })
    }, [])

    // 监听列表更新
    event.on('addrListUpdate', () => {
        // 获取收获地址列表
        getAddrListApi().then((res) => {
            setAddrList(res.data)
        })
    })

    // 打开收货地址对话框
    const openAddrModal = (type: number, addr: Addr): void => {
        switch (type) {
            case AddrModalTypeEnum.ADD:
                event.emit('addrModalOpenAdd')
                return
            case AddrModalTypeEnum.UPDATE:
                event.emit('addrModalOpenUpdate', addr)
                return
        }
    }

    // 删除收货地址
    const deleteAddr = (addrId: number, index: number): void => {
        modal.confirm({
            title: '删除收货地址',
            content: '此操作将删除收货地址,是否继续?',
            okType: 'danger',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                deleteAddrApi(addrId).then((res) => {
                    if (res) {
                        messageApi.success('删除成功').then()
                        setAddrList((pre) => {
                            pre.splice(index, 1)
                            return pre
                        })
                    }
                })
            }
        })
    }

    return {addrList, modalContextHolder, messageContextHolder, openAddrModal, deleteAddr}
}

const AddrPage: React.FC = (): JSX.Element => {
    const {addrList, modalContextHolder, messageContextHolder, openAddrModal, deleteAddr} = AddrHooks()

    const transformConsignee = (addr: Addr, key: number): JSX.Element => {
        return (
            <div key={key} className={style.consigneeCard}>
                <div className={style.consigneeCardBody}>
                    <div className={style.consigneeCardItem}><UserOutlined
                        style={{marginRight: '5px'}} />收货人: {addr.consignee}</div>
                    <div className={style.consigneeCardItem}><PhoneOutlined
                        style={{marginRight: '5px'}} />联系电话: {addr.telephone}</div>
                    <div className={style.consigneeCardItem}><EnvironmentOutlined
                        style={{marginRight: '5px'}} />所在省市: {addr.province} - {addr.city}</div>
                    <div className={style.consigneeCardItem}><HomeOutlined
                        style={{marginRight: '5px'}} />详细地址: {addr.detailedAddr}</div>
                    <div className={style.edit}>
                        <div onClick={() => openAddrModal(AddrModalTypeEnum.UPDATE, addr)}><ToolOutlined
                            style={{marginRight: '2px'}} />编辑
                        </div>
                        <div onClick={() => deleteAddr(addr.addrId, key)}><DeleteOutlined style={{marginRight: '2px'}} />删除
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <>
            <AddrModal />
            <div className={style.main}>
                <div className={style.card}>
                    <div className={style.cardTitle}>
                        <span className={style.cardTitleText}>收货人信息</span>
                        <span className={style.plusIcon}
                              onClick={() => openAddrModal(AddrModalTypeEnum.ADD, undefined)}><PlusCircleOutlined /></span>
                    </div>
                    <div className={style.consigneeCardList}>
                        {addrList.map((item: Addr, index: number) => {
                            return transformConsignee(item, index)
                        })}
                    </div>
                </div>
            </div>
            {/*对话框*/}
            {modalContextHolder}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default AddrPage