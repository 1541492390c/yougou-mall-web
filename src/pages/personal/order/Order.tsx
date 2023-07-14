import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Order, OrderItem } from '@/interface'
import { getOrderPagesApi } from '@/api/order-api'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import { NavLink } from 'react-router-dom'

const OrdersHooks: any = (): any => {
    const [total, setTotal] = useState<number>(0)
    const [orderList, setOrderList] = useState<Array<Order>>([])

    useEffect(() => {
        getOrderPagesApi(1, 5).then((res) => {
            console.log(res)
            setTotal(res.data.total)
            setOrderList(res.data.list)
        })
    }, [])

    // 解析订单状态
    const transformOrderState = (value: number): string => {
        switch (value) {
            case 0:
                return '已取消'
            case 1:
                return '待付款'
            case 2:
                return '待发货'
            case 3:
                return '配送中'
            case 4:
                return '已完成'
            default:
                return '--'
        }
    }

    // 解析规格
    const transformSpecs = (value: string): string => {
        let object = JSON.parse(value)
        let specs: string = ''
        for (let index in object) {
            specs += object[index] + ' , '
        }
        return specs.substring(0, specs.length - 2)
    }

    return {total, orderList, transformOrderState, transformSpecs}
}

const OrdersPage: React.FC = (): JSX.Element => {
    const {total, orderList, transformOrderState, transformSpecs} = OrdersHooks()

    return (
        <div className={style.main}>
            <div className={style.card}>
                <Table pagination={{pageSize: 5, total: total}} dataSource={orderList}>
                    <Column title='订单号' align='center' dataIndex='orderId' />
                    <Column title='订单详情' dataIndex='orderItemList' align='center'
                            render={(value: Array<OrderItem>, record: Order) => (
                                value.map((item: OrderItem, index: number) => {
                                    return (
                                        <div className={style.orderItems}>
                                            <div style={{width: '20%'}}>
                                                <img key={index} src={item.img} alt='' className={style.orderItemImg} />
                                            </div>
                                            <div className={style.productName}>
                                                <NavLink to={`/detail/${item.productId}`}>{item.productName}</NavLink>
                                            </div>
                                            <div className={style.specs}>
                                                {transformSpecs(item.specs)}</div>
                                            <div className={style.quantity}>
                                                <span>x{item.quantity}</span>
                                            </div>
                                            <div className={style.comment}>
                                                {(() => {
                                                    if (record.state !== 4) {
                                                        return <span />
                                                    } else if (!item.isComment) {
                                                        return <NavLink to='/comment' state={{orderItem: item}}>去评价</NavLink>
                                                    } else {
                                                        return <span className={style.orderSuccess}>已评价</span>
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    )
                                })
                            )} />
                    <Column title='金额' align='center' dataIndex='totalAmount'
                            render={(value: number) => (<span>￥{value.toFixed(2)}</span>)} />
                    <Column title='订单状态' align='center' dataIndex='state'
                            render={(value: number) => (<span>{transformOrderState(value)}</span>)} />
                    <Column title='操作' align='center' render={(value: any, record: Order, index: number) => (
                        <div className={style.edit}>
                            {(() => {
                                if (record.state === 0) {
                                    return <span>删除订单</span>
                                } else if (record.state === 1) {
                                    return (
                                        <div>
                                            <div>
                                                <NavLink to='/settlement'
                                                         state={{orderId: record.orderId}}>前往付款</NavLink>
                                            </div>
                                            <div><span className={style.cancel}>取消订单</span></div>
                                        </div>
                                    )
                                } else if (record.state === 2) {
                                    return <span className={style.notEdit}>等待商家发货</span>
                                } else if (record.state === 3) {
                                    return <span>确认收货</span>
                                } else if (record.state === 4) {
                                    return <span className={style.orderSuccess}>该订单已完成</span>
                                }
                            })()}
                        </div>
                    )} />
                </Table>
            </div>
        </div>
    )
}

export default OrdersPage