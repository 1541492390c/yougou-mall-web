import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import { Col, Form, Input, message, Modal, Row, Select, Switch } from 'antd'
import { AddrModalTypeEnum } from '@/enums'
import axios from 'axios'
import event from '@/event'
import { useSelector } from 'react-redux'
import { saveAddrApi, updateAddrApi } from '@/api/user/addr-api'
import { Addr } from '@/interface/user'
import { District } from 'src/interface/extension'

const AddrModalHooks: any = (): any => {
    const aMapKey: string = useSelector((state: any) => state.aMapKey)
    const [form] = Form.useForm()
    const [addrId, setAddrId] = useState<number>()
    const [type, setType] = useState<number>(AddrModalTypeEnum.ADD)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDefault, setIsDefault] = useState<boolean>(false)
    const [districts, setDistricts] = useState<Array<District>>([])
    const [currentProvince, setCurrentProvince] = useState<District>()
    const [currentCity, setCurrentCity] = useState<District>()
    const [currentDistrict, setCurrentDistrict] = useState<District>()

    useEffect(() => {
        axios.get(`https://restapi.amap.com/v3/config/district?subdistrict=3&key=${aMapKey}`).then((res) => {
            let districtList: Array<District> = new Array<District>()
            let result = res.data.districts[0].districts
            for (let index in result) {
                let district: District = {name: '', districts: []}
                district.name = result[index].name

                // 设置城市列表
                let cities: Array<District> = new Array<District>()
                for (let j in result[index].districts) {
                    let district: District = {name: '', districts: []}
                    district.name = result[index].districts[j].name

                    //设置区县列表
                    let districts: Array<District> = new Array<District>()
                    for (let x in result[index].districts[j].districts) {
                        let district: District = {name: '', districts: []}
                        district.name = result[index].districts[j].districts[x].name
                        districts.push(district)
                    }
                    district.districts = districts
                    cities.push(district)
                }
                district.districts = cities
                districtList.push(district)
            }
            setDistricts(districtList)
        })
    } , [])

    event.on('addrModalOpenAdd', () => {
        setIsOpen(true)
        setType(AddrModalTypeEnum.ADD)
    })

    event.on('addrModalOpenUpdate', (addr: Addr) => {
        setIsOpen(true)
        setType(AddrModalTypeEnum.UPDATE)
        setIsDefault(addr.isDefault)
        setAddrId(addr.addrId)
        form.setFieldsValue({
            consignee: addr.consignee,
            telephone: addr.telephone,
            detailedAddr: addr.detailedAddr,
        })
        for (let i in districts) {
            // 设置当前省份
            if (addr.province === districts[i].name) {
                setCurrentProvince(districts[i])

                // 设置当前城市
                for (let j in districts[i].districts) {
                    if (addr.city === districts[i].districts[j].name) {
                        setCurrentCity(districts[i].districts[j])

                        // 设置当前区、县
                        for (let x in districts[i].districts[j].districts) {
                            if (addr.district === districts[i].districts[j].districts[x].name) {
                                setCurrentDistrict(districts[i].districts[j].districts[x])
                                return
                            }
                        }
                    }
                }
            }
        }
    })

    // 关闭对话框,重置表单
    const closeAddrModal = (): void => {
        form.resetFields()
        setIsOpen(false)
        setCurrentProvince(undefined)
        setCurrentCity(undefined)
        setCurrentDistrict(undefined)
    }

    // 选择省份
    const selectProvince = (option: District): void => {
        setCurrentProvince(option)
        setCurrentCity(undefined)
        setCurrentDistrict(undefined)
    }

    // 选择所在城市
    const selectCity = (option: District): void => {
        setCurrentCity(option)
        setCurrentDistrict(undefined)
    }

    // 选择所在区县
    const selectDistrict = (option: District): void => {
        setCurrentDistrict(option)
    }

    // 是否默认修改
    const isDefaultChange = (value: boolean) => {
        setIsDefault(value)
    }

    // 验证收货人姓名
    const validateConsignee = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请填写收货人姓名'))
        }
        if (value.length >= 12) {
            return Promise.reject(new Error('姓名最长不超过12个字符'))
        }
        return Promise.resolve()
    }

    // 验证手机号码
    const validateTelephone = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请填写联系电话'))
        }
        if (value.length !== 11) {
            return Promise.reject(new Error('请填写正确的电话号'))
        }
        return Promise.resolve()
    }

    // 验证地区
    const validateDistrict = (_: any) => {
        if (!currentDistrict || !currentCity || !currentDistrict) {
            return Promise.reject(new Error('请选择所在地区'))
        }
        return Promise.resolve()
    }

    // 验证详细地址
    const validateDetailedAddr = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('请填写详细地址'))
        }
        if (value.length >= 30) {
            return Promise.reject(new Error('详细地址不超过30个字符'))
        }
        return Promise.resolve()
    }

    // 保存收货地址
    const saveAddr = (): void => {
        form.validateFields(['consignee', 'telephone', 'district', 'detailedAddr']).then((res) => {
            let addr: Addr = {
                isDefault: false,
                consignee: res.consignee,
                telephone: res.telephone,
                province: currentProvince?.name,
                detailedAddr: res.detailedAddr,
                city: currentCity?.name,
                district: currentDistrict?.name
            }
            saveAddrApi(addr).then((res) => {
                if (res) {
                    message.success('添加成功').then()
                    event.emit('addrListUpdate')
                    closeAddrModal()
                }
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    // 更新收货地址
    const updateAddr = (): void => {
        form.validateFields(['consignee', 'telephone', 'district', 'detailedAddr']).then((res) => {
            let addr: Addr = {
                addrId: addrId,
                isDefault: isDefault,
                consignee: res.consignee,
                telephone: res.telephone,
                province: currentProvince?.name,
                detailedAddr: res.detailedAddr,
                city: currentCity?.name,
                district: currentDistrict?.name
            }
            updateAddrApi(addr).then((res) => {
                if (res) {
                    message.success('修改成功').then()
                    event.emit('addrListUpdate')
                    closeAddrModal()
                }
            }).catch((err) => {
                console.log(err)
            })
        })
    }

    // 对话框确认
    const confirmModal = (): void => {
        if (type === AddrModalTypeEnum.ADD) {
            saveAddr()
        }
        if (type === AddrModalTypeEnum.UPDATE) {
            updateAddr()
        }
    }

    return {
        isOpen,
        isDefault,
        form,
        type,
        districts,
        currentProvince,
        currentCity,
        currentDistrict,
        closeAddrModal,
        selectProvince,
        selectCity,
        selectDistrict,
        isDefaultChange,
        validateConsignee,
        validateTelephone,
        validateDistrict,
        validateDetailedAddr,
        confirmModal
    }
}

const AddrModalComponent: React.FC = (): JSX.Element => {
    const {
        isOpen,
        isDefault,
        form,
        type,
        districts,
        currentProvince,
        currentCity,
        currentDistrict,
        closeAddrModal,
        selectProvince,
        selectCity,
        selectDistrict,
        isDefaultChange,
        validateConsignee,
        validateTelephone,
        validateDistrict,
        validateDetailedAddr,
        confirmModal
    } = AddrModalHooks()

    const titleElement: JSX.Element = (
        <div className={style.title}>
            <span>{type === AddrModalTypeEnum.ADD ? '添加收货地址' : '修改收货地址'}</span>
        </div>
    )

    return (
        <Modal open={isOpen} onCancel={closeAddrModal} onOk={confirmModal} title={titleElement} centered cancelText='取消'
               okText='确定' className={style.flex} width={600}>
            <div className={style.form}>
                <Form form={form} labelCol={{span: 4}}>
                    <Form.Item name='consignee' label='收货人姓名' rules={[{validator: validateConsignee}]}>
                        <Input placeholder='请输入收货人姓名' />
                    </Form.Item>
                    <Form.Item name='telephone' label='联系电话' rules={[{validator: validateTelephone}]}>
                        <Input placeholder='请输入联系人电话' />
                    </Form.Item>
                    <Form.Item name='district' label='所在地区' rules={[{validator: validateDistrict}]}>
                        <Row>
                            <Col span={8}>
                                <Select placeholder='请选择所在省份'
                                        value={!!currentProvince ? currentProvince.name : undefined}
                                        onSelect={(value: any, option: any) => selectProvince(value, option)}
                                        fieldNames={{label: 'name', value: 'name'}} options={districts} />
                            </Col>
                            <Col span={8}>
                                <Select disabled={!currentProvince} placeholder='请选择所在城市'
                                        onSelect={selectCity}
                                        value={!!currentCity ? currentCity.name : undefined}
                                        options={!!currentProvince ? currentProvince.districts : []}
                                        fieldNames={{label: 'name', value: 'name'}} />
                            </Col>
                            <Col span={8}>
                                <Select disabled={!currentCity} placeholder='请选择所在区县'
                                        onSelect={selectDistrict}
                                        value={!!currentDistrict ? currentDistrict.name : undefined}
                                        options={!!currentCity ? currentCity.districts : []}
                                        fieldNames={{label: 'name', value: 'name'}} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item name='detailedAddr' label='详细地址' rules={[{validator: validateDetailedAddr}]}>
                        <Input placeholder='请输入详细地址' />
                    </Form.Item>
                    {/*类型为更新时,可设置是否默认*/}
                    {(() => {
                        if (type === AddrModalTypeEnum.UPDATE) {
                            return (
                                <Form.Item name='isDefault' label='是否默认地址'>
                                    <Switch checked={isDefault} onChange={isDefaultChange} />
                                </Form.Item>
                            )
                        }
                    })()}
                </Form>
            </div>
        </Modal>
    )
}

export default AddrModalComponent