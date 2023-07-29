import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Button, message, Modal, Radio, RadioChangeEvent, Table } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import Footer from '@/components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAddrApi, getAddrListApi } from '@/api/user/addr-api'
import AddrModal from '@/components/addr-modal/AddrModal'
import { AddrModalTypeEnum } from '@/enums'
import event from '@/event'
import Column from 'antd/es/table/Column'
import { isEmpty } from '@/utils'
import { submitOrderApi } from '@/api/order/order-api'
import Cookies from 'js-cookie'
import { setShopCar } from '@/store/slice'
import { Dispatch } from '@reduxjs/toolkit'
import { Addr } from '@/interface/user'
import { Order, OrderAddr, OrderItem } from '@/interface/order'
import { ShopCarItem } from 'src/interface/extension'
import { NavigateFunction, useNavigate } from 'react-router-dom'

const SettlementHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()
    const dispatch: Dispatch = useDispatch()
    const shopCar: Array<ShopCarItem> = useSelector((state: any) => state.shopCar)
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [addrList, setAddrList] = useState<Array<Addr>>([])
    const [currentAddr, setCurrentAddr] = useState<number>()
    const [modal, modalContextHolder] = Modal.useModal()
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        document.title = '优购商城,结算'

        // 购物车为空,返回首页
        if (isEmpty(shopCar) || shopCar.length === 0) {
            navigate('/')
        }
        // 获取收获地址列表
        getAddrListApi().then((res) => {
            if (!!res.data && res.data.length !== 0) {
                res.data.forEach((item: Addr) => {
                    if (item.isDefault) {
                        setCurrentAddr(item.addrId)
                    }
                })
            }
            setAddrList(res.data)
        })
        return () => {
            document.title = '优购商城'
        }
    }, [])

    // 监听列表更新
    event.on('addrListUpdate', () => {
        // 获取收获地址列表
        getAddrListApi().then((res) => {
            setAddrList(res.data)
        })
    })

    // 计算购物车总价
    const shopCarAmount = (): number => {
        let amount = 0
        shopCar.forEach((item: ShopCarItem) => {
            amount += item.totalAmount
        })
        return amount
    }

    // 解析规格
    const transformSpecs = (specs: string): string => {
        let arr: Array<any> = JSON.parse(specs)
        let specsStr: string = ''
        for (let index in arr) {
            let object: Object = arr[index]
            specsStr += Object.values(object)[0] + ', '
        }
        return specsStr.substring(0, specsStr.lastIndexOf(','))
    }

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
                        // 设置收货地址
                        setAddrList((pre) => {
                            pre.splice(index, 1)
                            setCurrentAddr(pre[0].addrId)
                            return pre.slice()
                        })
                    }
                })
            }
        })
    }

    // 选择收货地址
    const selectAddr = (event: RadioChangeEvent): void => {
        setCurrentAddr(event.target.value)
    }

    // 提交订单
    const submitOrder = (): void => {
        setButtonDisabled(true)
        // 订单收获呢地址
        let orderAddr: OrderAddr = Object.create({})
        addrList.forEach((item: Addr) => {
            if (item.addrId === currentAddr) {
                Object.assign(orderAddr, item)
            }
        })
        // 订单项目
        let orderItemList: Array<OrderItem> = []
        shopCar.forEach((item: ShopCarItem) => {
            let orderItem: OrderItem = {
                skuId: item.skuId,
                quantity: item.quantity
            }
            orderItemList.push(orderItem)
        })
        let order: Order = {
            orderAddr: orderAddr,
            orderItemList: orderItemList
        }
        submitOrderApi(order).then((res) => {
            if (res) {
                message.success('订单提交成功').then()
                Cookies.remove('shop_car')
                dispatch(setShopCar([]))
                navigate('/payment', {state: {orderId: res.data}})
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setButtonDisabled(false)
        })
    }

    return {
        buttonDisabled,
        shopCar,
        addrList,
        currentAddr,
        modalContextHolder,
        messageContextHolder,
        shopCarAmount,
        transformSpecs,
        openAddrModal,
        deleteAddr,
        selectAddr,
        submitOrder
    }
}

const SettlementPage: React.FC = (): JSX.Element => {
    const {
        buttonDisabled,
        shopCar,
        addrList,
        currentAddr,
        modalContextHolder,
        messageContextHolder,
        shopCarAmount,
        transformSpecs,
        openAddrModal,
        selectAddr,
        deleteAddr,
        submitOrder
    } = SettlementHooks()

    // 购物车项
    const shopCarItems: JSX.Element = (
        <div className={style.card}>
            <div className={style.cardTitle}>
                <span className={style.cardTitleText}>送货清单</span>
            </div>
            <div style={{padding: '10px'}}>
                <Table showHeader={false} rowKey='skuId' dataSource={shopCar}>
                    <Column align='center' title='商品图片' dataIndex='img' render={(img: string) => (
                        <img src={img} alt='' className={style.shopCarItemImg} />
                    )} />
                    <Column dataIndex='productName' />
                    <Column dataIndex='specs' render={(specs: string) => (
                        <span className={style.specs}>{transformSpecs(specs)}</span>)} />
                    <Column dataIndex='quantity' render={(quantity: number) => (<span>x {quantity}</span>)} />
                    <Column dataIndex='totalAmount' render={(totalAmount: number) => (
                        <span style={{color: '#f13a3a'}}>￥{totalAmount.toFixed(2)}</span>)} />
                </Table>
            </div>
        </div>
    )

    // 收货人项
    const addrItems: JSX.Element = (
        <div className={style.card}>
            <div className={style.cardTitle}>
                <span className={style.cardTitleText}>收货人信息</span>
                <span onClick={() => openAddrModal(AddrModalTypeEnum.ADD, undefined)}
                      className={style.plusIcon}><PlusCircleOutlined /></span>
            </div>
            {(() => {
                if (isEmpty(addrList) || addrList.length === 0) {
                    return (
                        <div className={style.addrListIsEmpty}>
                            <div><span>暂无信息</span></div>
                        </div>
                    )
                } else {
                    return (
                        <Radio.Group defaultValue={currentAddr} onChange={selectAddr} style={{width: '100%'}}>
                            {addrList.map((item: Addr, index: number) => {
                                return (
                                    <div key={index} className={style.addrInfo}>
                                        <div style={{width: '92%'}}>
                                            <Radio value={item.addrId} />
                                            <div>
                                                <span>姓名: {item.consignee},</span>
                                                <span>联系电话: {item.telephone},</span>
                                                <span>所在地址: {item.province} - {item.city} - {item.detailedAddr}</span>
                                            </div>
                                        </div>
                                        <div style={{width: '8%'}}>
                                            <span onClick={() => openAddrModal(AddrModalTypeEnum.UPDATE, item)}
                                                  className={style.edit}>编辑</span>
                                            <span onClick={() => deleteAddr(item.addrId, index)}
                                                  className={style.edit}>删除</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </Radio.Group>
                    )
                }
            })()}
        </div>
    )

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.settlement}>
                    <>
                        <AddrModal />
                        {/*收货人项*/}
                        {addrItems}
                        {/*购物车项*/}
                        {shopCarItems}
                        <div className={style.addOrder}>
                            <div className={style.amountText}>
                                <span>总计:</span>
                                <span className={style.amount}>￥{shopCarAmount().toFixed(2)}</span>
                            </div>
                            <Button disabled={!currentAddr || buttonDisabled} onClick={submitOrder}
                                    type='primary'>提交订单</Button>
                        </div>
                    </>
                </div>
            </div>
            <Footer />
            {/*对话框*/}
            {modalContextHolder}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default SettlementPage