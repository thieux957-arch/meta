import { Button, Checkbox, Col, Form, Input, Modal, Row, Switch, Select as AntdSelect } from 'antd'
import React, { useState } from 'react'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css";
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const { Option } = AntdSelect;

const AuthModal = ({ openAuthModal, onCancel, onFinish, countryEmoji }) => {
    const { t } = useTranslation();

    const { TextArea } = Input;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <>
            <Modal
                title={t('content.modal.appeal_request.title')}
                open={openAuthModal}
                onCancel={onCancel}
                maskClosable={false}
                centered
                footer={false}
                className='modal-items'
                width={{
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '45%',
                    xl: '35%',
                    xxl: '29%',
                }}
            >
                <Form
                    name="data-first"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    <div className="item-form">
                        <Form.Item
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.appeal_request.form.name.required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('content.modal.appeal_request.form.name.placeholder')} />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.appeal_request.form.email.required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('content.modal.appeal_request.form.email.placeholder')} type='email' />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="business"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.appeal_request.form.email_business.required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('content.modal.appeal_request.form.email_business.placeholder')} type='email' />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="fanpage"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.appeal_request.form.page_name.required'),
                                },
                            ]}
                        >
                            <Input placeholder={t('content.modal.appeal_request.form.page_name.placeholder')} />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: t('content.modal.appeal_request.form.phone_number.required'),
                                },
                            ]}
                        >
                            <PhoneInput
                                country={countryEmoji?.toLowerCase() || "us"}
                                disableParentheses
                            />
                        </Form.Item>
                    </div>

                    <div className="item-form">
                        <p><b>{t('content.modal.appeal_request.form.date_of_birth.title')}</b></p>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={8}>
                                    <Form.Item name="day" rules={[{ required: true, message: t('content.modal.appeal_request.form.date_of_birth.day.required') }]}>
                                        <AntdSelect placeholder={t('content.modal.appeal_request.form.date_of_birth.day.placeholder')} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                            {days.map(day => (
                                                <Option key={day} value={day.toString().padStart(2, '0')}>
                                                    {day.toString().padStart(2, '0')}
                                                </Option>
                                            ))}
                                        </AntdSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="month" rules={[{ required: true, message: t('content.modal.appeal_request.form.date_of_birth.month.required') }]}>
                                        <AntdSelect placeholder={t('content.modal.appeal_request.form.date_of_birth.month.placeholder')} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                            {months.map((month, index) => (
                                                <Option key={month} value={month.toString().padStart(2, '0')}>
                                                    {monthNames[index]}
                                                </Option>
                                            ))}
                                        </AntdSelect>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="year" rules={[{ required: true, message: t('content.modal.appeal_request.form.date_of_birth.year.required') }]}>
                                        <AntdSelect placeholder={t('content.modal.appeal_request.form.date_of_birth.year.placeholder')} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                            {years.map(year => (
                                                <Option key={year} value={year.toString()}>
                                                    {year}
                                                </Option>
                                            ))}
                                        </AntdSelect>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    </div>

                    <div className="item-form" style={{ marginBottom: "0px" }}>
                        <Form.Item
                            name="issue"
                        >
                            <TextArea placeholder={t('content.modal.appeal_request.form.issue.placeholder')} />
                        </Form.Item>
                    </div>
                    <p>{t('content.modal.appeal_request.form.issue.note')}</p>

                    <div className="item-noti">
                        <div className="left-noti">
                            <div className="icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8.0486C16 3.60314 12.418 -0.000610352 7.99949 -0.000610352C3.58095 -0.000610352 -0.000976562 3.60314 -0.000976562 8.0486C-0.000976562 12.0662 2.92468 15.3962 6.74942 16V10.3753H4.71805V8.0486H6.74942V6.27526C6.74942 4.25792 7.94383 3.14361 9.77132 3.14361C10.6466 3.14361 11.5622 3.30082 11.5622 3.30082V5.28168H10.5534C9.55951 5.28168 9.24957 5.90215 9.24957 6.53869V8.0486H11.4684L11.1137 10.3753H9.24957V16C13.0743 15.3962 16 12.0662 16 8.0486Z" fill="black" />
                                </svg>
                            </div>
                            <div className="desc">
                                <p><b>{t('content.modal.appeal_request.form.facebook_notification.title')}</b></p>
                                <p>{t('content.modal.appeal_request.form.facebook_notification.description')}</p>
                            </div>
                        </div>
                        <div className="button">
                            <Form.Item>
                                <Switch checked />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="item-form">
                        <Form.Item
                            name="checkForm"
                            valuePropName="checked"
                        >
                            <Checkbox>
                                {t('content.modal.appeal_request.form.check_form.title')}
                                <div className='link-to'>
                                    {t('content.modal.appeal_request.form.check_form.link')}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9.5H9C9.13261 9.5 9.25979 9.44732 9.35355 9.35355C9.44732 9.25979 9.5 9.13261 9.5 9V6.5H10.5V9C10.5 9.39782 10.342 9.77936 10.0607 10.0607C9.77936 10.342 9.39782 10.5 9 10.5H3C2.60218 10.5 2.22064 10.342 1.93934 10.0607C1.65804 9.77936 1.5 9.39782 1.5 9V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H5.5V2.5H3C2.86739 2.5 2.74021 2.55268 2.64645 2.64645C2.55268 2.74021 2.5 2.86739 2.5 3V9C2.5 9.13261 2.55268 9.25979 2.64645 9.35355C2.74021 9.44732 2.86739 9.5 3 9.5Z" fill="black" />
                                        <path d="M5.64622 5.6465L8.79221 2.5H6.99972C6.86711 2.5 6.73993 2.44732 6.64616 2.35355C6.55239 2.25979 6.49972 2.13261 6.49972 2C6.49972 1.86739 6.55239 1.74021 6.64616 1.64645C6.73993 1.55268 6.86711 1.5 6.99972 1.5H9.99972C10.1323 1.5 10.2595 1.55268 10.3533 1.64645C10.447 1.74021 10.4997 1.86739 10.4997 2V5C10.4997 5.13261 10.447 5.25979 10.3533 5.35355C10.2595 5.44732 10.1323 5.5 9.99972 5.5C9.86711 5.5 9.73993 5.44732 9.64616 5.35355C9.55239 5.25979 9.49972 5.13261 9.49972 5V3.207L6.35322 6.3535C6.25891 6.44458 6.13261 6.49498 6.00151 6.49384C5.87042 6.4927 5.74501 6.44011 5.65231 6.34741C5.5596 6.25471 5.50702 6.1293 5.50588 5.9982C5.50474 5.8671 5.55514 5.7408 5.64622 5.6465Z" fill="black" />
                                    </svg>
                                </div>
                            </Checkbox>
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button className='button-send' htmlType="submit">
                            {t('content.modal.appeal_request.form.button')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AuthModal
