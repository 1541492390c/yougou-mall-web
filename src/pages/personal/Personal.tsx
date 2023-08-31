import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.scss'
import Header from '@/components/header/Header'
import { Location, NavigateFunction, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '@/components/footer/Footer'
import { Button, DatePicker, Form, Input, Menu, MenuProps, message, Modal, Radio, Upload, UploadFile } from 'antd'
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
import { updateAvatarApi, updateUserApi } from '@/api/user/user-api'
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { isEmpty } from '@/utils'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { ResourceTypeEnum } from '@/enums'
import { uploadFileApi } from '@/api/extra/resource-api'

const PersonalHooks: any = (): any => {
    const location: Location = useLocation()
    const navigate: NavigateFunction = useNavigate()
    const userinfo: User = useSelector((state: any) => state.userinfo)
    const [updateUserinfoForm] = Form.useForm()
    const [reader] = useState<FileReader>(new FileReader())
    const [selectKey, setSelectKey] = useState<string>('')
    const [avatarFile, setAvatarFile] = useState<string>('')
    const [updateUserinfoOpen, setUpdateUserinfoOpen] = useState<boolean>(false)
    const [cropperOpen, setCropperOpen] = useState<boolean>(false)
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [messageApi, messageContextHolder] = message.useMessage()
    const cropperRef = useRef<ReactCropperElement>()
    const menuItems = useRef<MenuProps['items']>([
        {label: '账号安全', key: '', icon: <KeyOutlined />},
        {label: '我的订单', key: 'my_order', icon: <ContainerOutlined />},
        {label: '我的收藏', key: 'favorite', icon: <StarOutlined />},
        {label: '我的反馈', key: 'my_feedback', icon: <ContainerOutlined />},
        {label: '我的优惠券', key: 'my_coupon', icon: <WalletOutlined />},
        {label: '收货人信息', key: 'addr', icon: <WhatsAppOutlined />}
    ])

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

    // 处理关闭头像上传
    const handleCloseUploadAvatar = (): void => {
        setCropperOpen(false)
    }

    // 选择头像
    const handleSelectAvatar = (option: any): void => {
        reader.readAsDataURL(option.file)
        reader.onloadend = (ev): void => {
            setAvatarFile(ev.target?.result as string)
            setCropperOpen(true)
        }
    }

    // 图片上传之前钩子
    const beforeUploadAvatar = (file: UploadFile): boolean => {
        if (file.type !== 'image/jpeg') {
            messageApi.error('请选择png、jpg格式文件').then()
            return false
        }
        return true
    }

    // 上传头像
    const uploadAvatar = (): void => {
        setButtonDisabled(true)
        cropperRef.current?.cropper.getCroppedCanvas().toBlob((e) => {
            let formData: FormData = new FormData()
            formData.append('resourceType', ResourceTypeEnum.AVATAR.toString())
            formData.append('file', new File([e as Blob], 'file.png', {}))
            // 上传图片
            uploadFileApi(formData).then((res) => {
                if (res) {
                    // 更新用户信息
                    updateAvatarApi({avatar: res.data}).then((res) => {
                        if (res) {
                            messageApi.success({
                                content: '上传成功',
                                duration: 0.5,
                                onClose: () => {
                                    setCropperOpen(false)
                                    window.location.reload()
                                }
                            }).then()
                        }
                    }).catch((err) => {
                        console.log(err)
                    }).finally(() => {
                        setButtonDisabled(false)
                    })
                }
            }).catch((err) => {
                console.log(err)
            })
        })
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

    return {
        userinfo,
        updateUserinfoForm,
        menuItems,
        cropperRef,
        selectKey,
        avatarFile,
        updateUserinfoOpen,
        cropperOpen,
        buttonDisabled,
        messageContextHolder,
        setUpdateUserinfoOpen,
        transformGender,
        handleSelect,
        handleCloseUploadAvatar,
        handleSelectAvatar,
        beforeUploadAvatar,
        uploadAvatar,
        validateNickname,
        updateUserinfo
    }
}

const PersonalPage: React.FC = (): JSX.Element => {
    const {
        userinfo,
        updateUserinfoForm,
        menuItems,
        cropperRef,
        selectKey,
        avatarFile,
        updateUserinfoOpen,
        cropperOpen,
        buttonDisabled,
        messageContextHolder,
        setUpdateUserinfoOpen,
        transformGender,
        handleSelect,
        handleCloseUploadAvatar,
        handleSelectAvatar,
        beforeUploadAvatar,
        uploadAvatar,
        validateNickname,
        updateUserinfo
    } = PersonalHooks()

    // 上传头像
    const avatarUploadModal: JSX.Element = (
        <Modal title='上传头像'
               width={600}
               maskClosable={false}
               open={cropperOpen}
               onCancel={handleCloseUploadAvatar}
               onOk={uploadAvatar}>
            <Cropper src={avatarFile ? avatarFile : ''}
                     ref={cropperRef}
                     center
                     viewMode={1} aspectRatio={1}
                     zoomable={false} guides={false} background={false}
                     cropBoxMovable={true} scalable={true}
                     style={{height: '300px', width: '100%'}} />
        </Modal>
    )

    // 个人简介
    const personalDocumentCard: JSX.Element = (
        <div className={style.personalDocumentCard}>
            <Upload customRequest={handleSelectAvatar} beforeUpload={beforeUploadAvatar} showUploadList={false}>
                <img src={!isEmpty(userinfo) && !!userinfo.avatar ? userinfo.avatar : AvatarEmpty} alt='' />
                <div className={style.uploadAvatarText}>
                    <span>(点击上传头像)</span>
                </div>
            </Upload>
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
            <Menu defaultSelectedKeys={['']} selectedKeys={[selectKey]} items={menuItems.current}
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
            {/*头像上传*/}
            {avatarUploadModal}
        </>
    )
}

export default PersonalPage