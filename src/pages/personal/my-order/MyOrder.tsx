import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { confirmOrderApi, deleteOrderApi, getOrderPagesApi } from '@/api/order/order-api'
import { message, Modal, Table, TablePaginationConfig } from 'antd'
import Column from 'antd/es/table/Column'
import { NavLink } from 'react-router-dom'
import { Order, OrderItem } from '@/interface/order'
import { OrderStateEnum } from '@/enums'

const OrdersHooks: any = (): any => {
    const [total, setTotal] = useState<number>(0)
    const [orderList, setOrderList] = useState<Array<Order>>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [modal, modalContextHolder] = Modal.useModal()
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        getOrderPagesApi(currentPage, 5).then((res) => {
            setTotal(res.data.total)
            setOrderList(res.data.list)
        }).catch((err) => {
            console.log(err)
        })
    }, [currentPage])

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

    const confirmOrder = (id: number): void => {
        modal.confirm({
            title: '确认收货',
            content: '请确认您已经收货',
            okType: 'danger',
            onOk: () => {
                confirmOrderApi(id).then((res) => {
                    if (res) {
                        messageApi.success('已确认收货').then()
                        // 更新订单列表
                        let list: Array<Order> = [...orderList]
                        // 更新订单状态
                        list.forEach((item: Order) => {
                            if (item.orderId === id) {
                                item.state = OrderStateEnum.FINISHED
                            }
                        })
                        setOrderList(list)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }

    // 删除订单
    const deleteOrder = (id: number, index: number): void => {
        modal.confirm({
            title: '删除订单',
            content: '此操作将删除订单,是否继续?',
            okType: 'danger',
            onOk: () => {
                deleteOrderApi(id).then((res) => {
                    if (res) {
                        messageApi.success('删除订单成功').then()
                        // 更新订单列表
                        let list: Array<Order> = [...orderList]
                        list.splice(index, 1)
                        setOrderList(list)
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }

    return {
        total,
        orderList,
        modalContextHolder,
        messageContextHolder,
        setCurrentPage,
        transformOrderState,
        transformSpecs,
        confirmOrder,
        deleteOrder
    }
}

const MyOrderPage: React.FC = (): JSX.Element => {
    const {
        total,
        orderList,
        modalContextHolder,
        messageContextHolder,
        setCurrentPage,
        transformOrderState,
        transformSpecs,
        confirmOrder,
        deleteOrder
    } = OrdersHooks()

    return (
        <div className={style.card}>
            <Table dataSource={orderList} pagination={{pageSize: 5, total: total}}
                   onChange={(pagination: TablePaginationConfig) => setCurrentPage(pagination.current)}
                   rowKey='orderId' scroll={{x: 'max-content', y: 'max-content'}}>
                <Column title='订单号' align='center' width={200} dataIndex='orderNo' />
                <Column title='订单详情' align='center' width={600} dataIndex='orderItemList'
                        render={(value: Array<OrderItem>, record: Order) => (
                            value.map((item: OrderItem, index: number) => {
                                return (
                                    <div key={index} className={style.orderItems}>
                                        {/*商品图片*/}
                                        <div style={{width: '10%'}}>
                                            <img key={index} src={item.img} alt='' className={style.orderItemImg} />
                                        </div>
                                        {/*商品名称*/}
                                        <div className={style.productName}>
                                            <NavLink to={`/detail/${item.productId}`}>{item.productName}</NavLink>
                                        </div>
                                        {/*商品规格*/}
                                        <div className={style.specs}>
                                            <span>{transformSpecs(item.specs)}</span>
                                        </div>
                                        {/*购买数量*/}
                                        <div className={style.quantity}>
                                            <span>x {item.quantity}</span>
                                        </div>
                                        {/*是否评价*/}
                                        <div className={style.isComment}>
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
                <Column title='实付款' align='center' width={100} dataIndex='payAmount'
                        render={(value: number) => (<span>￥{value.toFixed(2)}</span>)} />
                <Column title='时间' align='center' width={250} render={(record: Order) => (
                    <div className={style.time}>
                        {!!record.submitTime && <div>下单时间:{record.submitTime?.toString()}</div>}
                        {!!record.payTime && <div>支付时间:{record.payTime.toString()}</div>}
                        {!!record.deliveryTime && <div>配送时间:{record.deliveryTime.toString()}</div>}
                        {!!record.finishTime && <div>完成时间:{record.finishTime.toString()}</div>}
                    </div>
                )} />
                <Column title='订单状态' align='center' width={90} dataIndex='state'
                        render={(value: number) => (
                            <span style={{fontSize: '12px'}}>{transformOrderState(value)}</span>)} />
                <Column title='操作' align='center' width={120} fixed={'right'} render={(record: Order, index: number) => (
                    <div className={style.edit}>
                        {/*已取消*/}
                        {record.state === OrderStateEnum.CANCEL && <span onClick={() => deleteOrder(record.orderId, index)}>删除订单</span>}
                        {/*待付款*/}
                        {record.state === OrderStateEnum.WAIT_PAY && (
                            <div>
                                <div>
                                    <NavLink to='/payment' state={{orderId: record.orderId}}>前往付款</NavLink>
                                </div>
                                <div>
                                    <span onClick={() => deleteOrder(record.orderId, index)} className={style.cancel}>取消订单</span>
                                </div>
                            </div>
                        )}
                        {/*待发货*/}
                        {record.state === OrderStateEnum.WAIT_DELIVERY && <span className={style.notEdit}>等待商家发货</span>}
                        {/*配送中*/}
                        {record.state === OrderStateEnum.DELIVERING && <span onClick={() => confirmOrder(record.orderId)}>确认收货</span>}
                        {/*已完成*/}
                        {record.state === OrderStateEnum.FINISHED && <span className={style.orderSuccess}>该订单已完成</span>}
                    </div>
                )} />
            </Table>
            {/*对话框*/}
            {modalContextHolder}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </div>
    )
}

export default MyOrderPage