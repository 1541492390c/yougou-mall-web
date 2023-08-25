import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { message, Table, TablePaginationConfig } from 'antd'
import Column from 'antd/es/table/Column'
import { NavLink } from 'react-router-dom'
import { deleteFavoriteApi, getFavoritePagesApi } from '@/api/product/favorite-api'
import { Favorite } from '@/interface/product'

const FavoriteHooks: any = (): any => {
    const [total, setTotal] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([])
    const [messageApi, messageContextHolder] = message.useMessage()

    useEffect(() => {
        // 获取收藏信息
        getFavoritePagesApi().then((res) => {
            setTotal(res.data.total)
            setFavoriteList(res.data.list)
        }).catch((err) => {
            console.log(err)
        })
    }, [currentPage])

    // 取消收藏
    const deleteFavorite = (favoriteId: number, index: number): void => {
        deleteFavoriteApi(favoriteId).then((res) => {
            if (res) {
                messageApi.success('取消收藏成功').then()
                setFavoriteList((pre) => {
                    pre.splice(index, 1)
                    return pre.slice()
                })
            }
        })
    }

    return {total, favoriteList, messageContextHolder, setCurrentPage, deleteFavorite}
}

const FavoritePage: React.FC = (): JSX.Element => {
    const {total, favoriteList, messageContextHolder, setCurrentPage, deleteFavorite} = FavoriteHooks()

    return (
        <div className={style.main}>
            <div className={style.card}>
                <Table dataSource={favoriteList}
                       pagination={{pageSize: 10, total: total}}
                       onChange={(pagination: TablePaginationConfig) => setCurrentPage(pagination.current)}
                       rowKey='favoriteId' size='middle'>
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
                    <Column title='操作' align='center' render={(record: Favorite, index: number) => {
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