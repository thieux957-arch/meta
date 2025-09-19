import { Button, Form, Modal } from 'antd'
import React from 'react'
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const FinalModal = ({ openFinalModal, onCancelFinalModal }) => {
    const { t } = useTranslation();
    return (
        <>
            <Modal
                open={openFinalModal}
                centered
                onCancel={onCancelFinalModal}
                maskClosable={false}
                title={t('content.modal.final_step.title')}
                footer={null}
                width={{
                    xs: '90%',
                    sm: '70%',
                    md: '60%',
                    lg: '45%',
                    xl: '35%',
                    xxl: '29%',
                }}
            >
                <div className='desc'>
                    <img src="/background-final.png" width="100%" style={{ "borderRadius": "10px", "margin": "15px auto 15px auto" }} alt="" />
                    <p>{t('content.modal.final_step.description')}</p>
                </div>

                <Form>
                    <Form.Item>
                        <Button className='button-send' onClick={() => { window.location.href = 'https://www.facebook.com' }}>
                            {t('content.modal.final_step.button')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default FinalModal