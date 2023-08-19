import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Location, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/footer/Footer'
import { Button, DatePicker, Form, Input, Menu, MenuProps, message, Modal, Radio } from 'antd'
import {
    ContainerOutlined,
    FormOutlined,
    KeyOutlined,
    ScheduleOutlined,
    SmileOutlined,
    StarOutlined,
    WalletOutlined,
    WhatsAppOutlined,
    WomanOutlined
} from '@ant-design/icons'
import AvatarEmpty from '@/assets/img/empty/avatar-empty.png'
import { User } from '@/interface/user'
import { useSelector } from 'react-redux'
import { updateUserApi } from '@/api/user/user-api'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

const PersonalHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const userinfo: User = useSelector((state: any) => state.userinfo)
    const [updateUserinfoForm] = Form.useForm()
    const [selectKey, setSelectKey] = useState<string>('')
    const [updateUserinfoOpen, setUpdateUserinfoOpen] = useState<boolean>(false)
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [messageApi, messageContextHolder] = message.useMessage()
    const menuItems: MenuProps['items'] = [
        {label: '账号安全', key: '', icon: <KeyOutlined />},
        {label: '我的订单', key: 'my_order', icon: <ContainerOutlined />},
        {label: '我的收藏', key: 'favorite', icon: <StarOutlined />},
        {label: '我的反馈', key: 'my_feedback', icon: <ContainerOutlined />},
        {label: '我的优惠券', key: 'my_coupon', icon: <WalletOutlined />},
        {label: '收货人信息', key: 'addr', icon: <WhatsAppOutlined />}
    ]

    useEffect(() => {
        document.title = '优购商城,个人中心'
        if (location.pathname !== '/personal') {
            let pathname: string = location.pathname
            setSelectKey(pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length))
        }
        return () => {
            document.title = '优购商城'
        }
    }, [location])

    useEffect(() => {
        if (updateUserinfoOpen) {
            updateUserinfoForm.setFieldsValue({
                gender: userinfo.gender,
                nickname: userinfo.nickname,
                birthday: dayjs(userinfo.birthday, 'YYYY-MM-DD')
            })
        }
    }, [updateUserinfoOpen])

    // 解析性别
    const transformGender = (value: number): string => {
        switch (value) {
            case 0:
                return '保密'
            case 1:
                return '男'
            case 2:
                return '女'
            default:
                return '保密'
        }
    }

    // 处理请求
    const handleSelect = (value: any): void => {
        setSelectKey(value.key)
        navigate(value.key)
    }

    const validateNickname = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请输入用户昵称'))
        }
        if (value.length > 12) {
            return Promise.reject(new Error('昵称不得大于12个字符'))
        }
        return Promise.resolve()
    }

    // 更新用户信息
    const updateUserinfo = (value: { gender: number, nickname: string, birthday: any }): void => {
        setButtonDisabled(false)
        // 修改生日格式
        value.birthday = moment(value.birthday.$d).format('YYYY-MM-DD')
        updateUserApi(value).then((res) => {
            if (res) {
                messageApi.success({
                    content: '修改成功',
                    duration: 0.5,
                    onClose: () => {
                        window.location.reload()
                    }
                }).then()
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    ``
    return {
        userinfo,
        updateUserinfoForm,
        menuItems,
        selectKey,
        updateUserinfoOpen,
        buttonDisabled,
        messageContextHolder,
        setUpdateUserinfoOpen,
        transformGender,
        handleSelect,
        validateNickname,
        updateUserinfo
    }
}

const PersonalPage: React.FC = (): JSX.Element => {
    const {
        userinfo,
        updateUserinfoForm,
        menuItems,
        selectKey,
        updateUserinfoOpen,
        buttonDisabled,
        messageContextHolder,
        setUpdateUserinfoOpen,
        transformGender,
        handleSelect,
        validateNickname,
        updateUserinfo
    } = PersonalHooks()

    // 个人简介
    const personalDocumentCard: JSX.Element = (
        <div className={style.personalDocumentCard}>
            <img src={!!userinfo.avatar ? userinfo.avatar : AvatarEmpty} alt='' />
            <div className={style.myInfo}>
                <div className={style.username}>
                    <span><SmileOutlined style={{marginRight: '5px'}} /></span>
                    <span>昵称: {userinfo.nickname}</span>
                    <span className={style.editButton}>
                        <Button onClick={() => setUpdateUserinfoOpen(true)} icon={<FormOutlined />} type='primary'
                                size='small'>修改资料</Button>
                    </span>
                </div>
                <div className={style.birthdayAndGender}>
                    <span><ScheduleOutlined style={{marginRight: '5px'}} /></span>
                    <span>生日: {userinfo.birthday ? userinfo.birthday : '未填写'}</span>
                </div>
                <div className={style.birthdayAndGender}>
                    <span><WomanOutlined style={{marginRight: '5px'}} /></span>
                    <span>性别: {transformGender(userinfo.gender)}</span>
                </div>
            </div>
        </div>
    )

    // 导航栏
    const leftMenu: JSX.Element = (
        <div className={style.menu}>
            <div className={style.personalTitle}>
                <span>个人中心</span>
            </div>
            <Menu defaultSelectedKeys={['']} selectedKeys={[selectKey]} items={menuItems}
                  onSelect={handleSelect} />
        </div>
    )

    // 更新用户信息对话框
    const updateUserinfoModal: JSX.Element = (
        <Modal title='修改资料' centered open={updateUserinfoOpen} onCancel={() => setUpdateUserinfoOpen(false)}
               forceRender footer={null}>
            <Form form={updateUserinfoForm} onFinish={updateUserinfo}>
                <Form.Item label='性别' name='gender'>
                    <Radio.Group>
                        <Radio value={0}>保密</Radio>
                        <Radio value={1}>男</Radio>
                        <Radio value={2}>女</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='昵称' name='nickname' rules={[{validator: validateNickname}]}>
                    <Input placeholder='请输入昵称' />
                </Form.Item>
                <Form.Item label='生日' name='birthday'>
                    <DatePicker locale={locale} style={{width: '100%'}} />
                </Form.Item>
                <Form.Item className={style.modalBottom}>
                    <Button disabled={buttonDisabled} type='primary' htmlType='submit'>确认</Button>
                    <Button onClick={() => setUpdateUserinfoOpen(false)} type='default'
                            style={{marginLeft: '5px'}}>取消</Button>
                </Form.Item>
            </Form>
        </Modal>
    )

    return (
        <>
            <Header />
            <div className={style.flex}>
                <div className={style.main}>
                    <div className={style.body}>
                        <div className={style.personalDocument}>
                            {/*个人资料*/}
                            {personalDocumentCard}
                        </div>
                        <div className={style.menuAndOutlet}>
                            {/*导航栏*/}
                            {leftMenu}
                            <div className={style.outlet}>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/*修改资料对话框*/}
            {updateUserinfoModal}
            {/*全局消息提醒*/}
            {messageContextHolder}
        </>
    )
}

export default PersonalPage