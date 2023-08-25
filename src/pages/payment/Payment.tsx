import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import { Button, message, Radio, RadioChangeEvent } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import AliPayLogo from '@/assets/img/payment/ali-pay-logo.png'
import PayRecommend from '@/assets/img/payment/pay-recommend.png'
import { Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { isEmpty } from '@/utils'
import { getOrderByIdApi } from '@/api/order/order-api'
import { Order } from '@/interface/order'
import { payApi } from '@/api/payment/payment-api'

const PaymentHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const [payType, setPayType] = useState<number>(1)
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [order, setOrder] = useState<Order>()
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        // 无订单号,返回首页
        if (isEmpty(location) || isEmpty(location.state.orderId)) {
            navigate('/')
        } else {
            // 获取订单信息
            getOrderByIdApi(location.state.orderId).then((res) => {
                if (res.data.state === 2) {
                    navigate('/personal')
                }
                setOrder(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [location.state.orderId])

    // 支付
    const pay = (): void => {
        setButtonDisabled(true)
        payApi(order?.orderId, payType).then((res) => {
            if (res) {
                messageApi.success('跳转中...').then()
                let payForm: HTMLElement = document.createElement('payForm')
                payForm.innerHTML = res.data
                document.body.appendChild(payForm)
                document.forms[0].setAttribute('target', '_top')
                document.forms[0].submit()
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    return {payType, buttonDisabled, order, messageContextHolder, setPayType, pay}
}

const PaymentPage: React.FC = (): JSX.Element => {
    const {payType, buttonDisabled, order, messageContextHolder, setPayType, pay} = PaymentHooks()

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.payment}>
                    <div className={style.addOrderSuccess}>
                        <div>
                            <CheckCircleFilled style={{color: '#73d13d', fontSize: 60}} />
                        </div>
                        <div style={{marginLeft: '20px'}}>
                            <div><span style={{fontSize: '18px'}}>您的订单提交成功,请尽快看支付</span></div>
                            <div><span style={{fontSize: '18px'}}>金额: <span
                                className={style.orderAmount}>{order?.payAmount.toFixed(2)}</span></span></div>
                        </div>
                    </div>
                    <div>
                        <div className={style.payTypeTitle}><span>支付方式</span></div>
                        <div>
                            <Radio.Group
                                defaultValue={payType}
                                style={{width: '100%'}}>
                                <Radio value={1} onChange={(event: RadioChangeEvent) => setPayType(event.target.value)}
                                       className={style.payTypeButton}>
                                    <div style={{width: '80%'}}>
                                        <img src={AliPayLogo} alt='' />
                                    </div>
                                    <div style={{width: '20%'}}>
                                        <img src={PayRecommend} alt='' />
                                    </div>
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className={style.pay}>
                            <Button onClick={pay} disabled={buttonDisabled} type='primary'>付款</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default PaymentPage