import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Button, message, Modal, Radio, RadioChangeEvent, Steps, Table } from 'antd'
import {
    CheckCircleFilled,
    CheckOutlined,
    FormOutlined,
    PayCircleOutlined,
    PlusCircleOutlined
} from '@ant-design/icons'
import Footer from '@/components/footer/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAddrApi, getAddrListApi } from '@/api/user-api'
import { Addr, Order, OrderAddr, OrderItem, ShopCarItem } from '@/interface'
import AddrModal from '@/components/addr-modal/AddrModal'
import { AddrModalTypeEnum } from '@/enums'
import event from '@/event'
import Column from 'antd/es/table/Column'
import { isEmpty } from '@/utils'
import { StepProps } from 'antd/es/steps'
import { submitOrderApi } from '@/api/order-api'
import Cookies from 'js-cookie'
import { setShopCar } from '@/store'
import { Dispatch } from '@reduxjs/toolkit'

const SettlementHooks: any = (): any => {
    const dispatch: Dispatch = useDispatch()
    const shopCar: Array<ShopCarItem> = useSelector((state: any) => state.shopCar)
    const [step, setStep] = useState<number>(0)
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [addrList, setAddrList] = useState<Array<Addr>>([])
    const [currentAddr, setCurrentAddr] = useState<number>()
    const [modal, contextHolder] = Modal.useModal()
    const stepItems: Array<StepProps> = [
        {title: '填写订单信息', icon: <FormOutlined style={{fontSize: '25px'}} />},
        {title: '支付', icon: <PayCircleOutlined style={{fontSize: '25px'}} />},
        {title: '完成', icon: <CheckOutlined style={{fontSize: '25px'}} />}
    ]

    useEffect(() => {
        document.title = '优购商城,结算'
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
            specsStr += Object.keys(object)[0] + ':' + Object.values(object)[0] + ','
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
    const deleteAddr = (addrId: number, index: number) => {
        modal.confirm({
            title: '删除收货地址',
            content: '此操作将删除收货地址,是否继续?',
            okType: 'danger',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                deleteAddrApi(addrId).then((res) => {
                    if (res) {
                        message.success('删除成功').then()
                        setAddrList((pre) => {
                            pre.splice(index, 1)
                            setCurrentAddr(pre[0].addrId)
                            return pre
                        })
                    }
                })
            }
        })
    }

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
                Cookies.remove('shop_car')
                dispatch(setShopCar([]))
                message.success('订单提交成功').then()
                setStep(pre => pre + 1)
                setButtonDisabled(false)
            }
        }).catch((err) => {
            setButtonDisabled(false)
            console.log(err)
        })
    }

    return {
        step,
        buttonDisabled,
        shopCar,
        addrList,
        currentAddr,
        stepItems,
        contextHolder,
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
        step,
        buttonDisabled,
        shopCar,
        addrList,
        currentAddr,
        stepItems,
        contextHolder,
        shopCarAmount,
        transformSpecs,
        openAddrModal,
        selectAddr,
        deleteAddr,
        submitOrder
    } = SettlementHooks()

    // 购物车项
    const shopCarItems = (
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
    const addrItems = (
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
                            {contextHolder}
                        </Radio.Group>
                    )
                }
            })()}
        </div>
    )

    // 第一步:确认订单
    const confirmOrder = (
        <>
            <AddrModal />
            {addrItems}
            {shopCarItems}
            <div className={style.addOrder}>
                <div className={style.amountText}>
                    <span>总计:</span>
                    <span className={style.amount}>￥{shopCarAmount().toFixed(2)}</span>
                </div>
                <div style={{padding: '10px'}}>
                    <Button disabled={!currentAddr || buttonDisabled} onClick={submitOrder}
                            type='primary'>提交订单</Button>
                </div>
            </div>
        </>
    )

    // 第二步:支付
    const pay = (
        <>
            <div className={style.confirmOrderSuccess}>
                <div>
                    <CheckCircleFilled style={{color: '#73d13d', fontSize: 60}} />
                </div>
                <div style={{marginLeft: '20px'}}>
                    <div><span style={{fontSize: '18px'}}>您的订单提交成功,请尽快看支付</span></div>
                    <div><span style={{fontSize: '18px'}}>金额: <span
                        className={style.orderAmount}>0</span></span></div>
                </div>
            </div>
            <div>
                <div className={style.payTypeTitle}>
                    <span>支付方式</span>
                </div>
                {/*<div>*/}
                {/*    <Radio.Group defaultValue={payType} */}
                {/*                 style={{width: '100%'}}>*/}
                {/*        <Radio value={0} className={Style.payTypeButton}>*/}
                {/*            <div style={{width: '80%'}}>*/}
                {/*                <img src={AliPayLogo} alt='' />*/}
                {/*            </div>*/}
                {/*            <div style={{width: '20%'}}>*/}
                {/*                <img src={PayRecommend} alt='' />*/}
                {/*            </div>*/}
                {/*        </Radio>*/}
                {/*    </Radio.Group>*/}
                {/*</div>*/}
                <div className={style.pay}>
                    <Button type='primary'>付款</Button>
                </div>
            </div>
        </>
    )

    // 第三步:完成
    const success = (
        <div>
            完成
        </div>
    )

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.settlement}>
                    <div className={style.step}>
                        <Steps current={step} items={stepItems} />
                    </div>
                    <div>
                        {step === 0 && confirmOrder}
                        {step === 1 && pay}
                        {step === 2 && success}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SettlementPage