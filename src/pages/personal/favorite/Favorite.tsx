import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Favorite } from '@/interface'
import { message, Table } from 'antd'
import { deleteFavoriteApi, getFavoritePagesApi } from '@/api/product-api'
import Column from 'antd/es/table/Column'
import { NavLink } from 'react-router-dom'

const FavoriteHooks: any = (): any => {
    const [total, setTotal] = useState<number>(0)
    const [favoriteList, setFavoriteList] = useState<Favorite[]>([])
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        getFavoritePagesApi().then((res) => {
            setTotal(res.data.total)
            setFavoriteList(res.data.list)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    // 取消收藏
    const deleteFavorite = (favoriteId: number, index: number): void => {
        deleteFavoriteApi(favoriteId).then((res) => {
            if (res) {
                messageApi.success('取消收藏成功').then()
                setFavoriteList((pre) => {
                    pre.splice(index, 1)
                    return pre
                })
            }
        })
    }

    return {total, favoriteList, messageContextHolder, deleteFavorite}
}

const FavoritePage: React.FC = (): JSX.Element => {
    const {total, favoriteList, messageContextHolder, deleteFavorite} = FavoriteHooks()

    return (
        <div className={style.main}>
            <div className={style.card}>
                <Table pagination={{pageSize: 10, total: total}} dataSource={favoriteList}>
                    <Column title='商品图片' align='center' dataIndex='cover' render={(value: string) => {
                        return <img src={value} alt='' className={style.favoriteItemImg} />
                    }} />
                    <Column title='商品名称' align='center' dataIndex='productName'
                            render={(value: string, record: Favorite) => {
                                return (
                                    <div className={style.productName}>
                                        <NavLink to={`/detail/${record.productId}`}>{value}</NavLink>
                                    </div>
                                )
                            }} />
                    <Column title='操作' align='center' render={(value, record: Favorite, index: number) => {
                        return (
                            <div className={style.edit}>
                                <span onClick={() => deleteFavorite(record.favoriteId, index)}>取消收藏</span>
                            </div>
                        )
                    }} />
                </Table>
            </div>
            {/*全局消息提醒*/}
            {messageContextHolder}
        </div>
    )
}

export default FavoritePage