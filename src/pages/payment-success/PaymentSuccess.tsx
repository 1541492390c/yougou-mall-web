import React from 'react'
import style from './style.module.scss'
import { Button, Result } from 'antd'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'

const PaymentSuccessHooks: any = (): any => {
    const navigate: NavigateFunction = useNavigate()

    return {navigate}
}

const PaymentSuccessPage: React.FC = (): JSX.Element => {
    const {navigate} = PaymentSuccessHooks()

    return (
        <>
            <Header />
            <div className={style.main}>
                <div className={style.paymentSuccess}>
                    <div className={style.result}>
                        <Result status='success' title='订单支付成功!'
                                extra={[
                                    <Button onClick={() => navigate('/')} type='primary'>返回首页</Button>
                                ]}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PaymentSuccessPage