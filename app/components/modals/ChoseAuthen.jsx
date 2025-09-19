import { Button, Modal, Radio } from 'antd';
import React, { useState } from 'react';
import "../../libs/i18n"
import { useTranslation } from 'react-i18next';

const ChoseAuthenModal = ({ openChoseAuthenModal, onCancelChoseAuthenModal, dataCookie = null, loadingChoseAuthen, onFinishChoseAuthen }) => {
    const { t } = useTranslation();

    const [selected, setSelected] = useState('auth_app');
    const [loading, setLoading] = useState(false);

    const { email, phone } = dataCookie || {};

    const phoneDisplay = phone ? `+${phone.slice(0, 2)} ******${phone.slice(-2)}` : '+1 ******45';
    const emailDisplay = email ? email.replace(/(.{1}).*(@.*)/, (m, a, b) => a + '*'.repeat(12) + b) : 'l************@gmail.com';

    const handleContinue = async () => {
        try {
            setLoading(true);
            const updatedData = {
                authMethod: selected
            };
            
            await onFinishChoseAuthen(updatedData);
        } catch (error) {
            console.error('Error in handleContinue:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={openChoseAuthenModal}
            centered
            onCancel={onCancelChoseAuthenModal}
            title={t('content.modal.authen_modal.title')}
            maskClosable={false}
            className='modal-items'
            footer={false}
            width={{
                xs: '90%',
                sm: '70%',
                md: '60%',
                lg: '45%',
                xl: '35%',
                xxl: '29%',
            }}
        >
            <Radio.Group
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className='option-group'
            >
                <div className='option-list'>
                    <label key='auth_app' className='option-item'>
                        <div>
                            <div className='option-label'>{t('content.modal.authen_modal.app.sub_1')}</div>
                            <div className='option-desc'>{t('content.modal.authen_modal.app.sub_1')}</div>
                        </div>
                        <Radio value='auth_app' checked={selected === 'auth_app'} className='option-radio' />
                    </label>

                    <label key='sms' className='option-item'>
                        <div>
                            <div className='option-label'>{t('content.modal.authen_modal.sms.sub_1')}</div>
                            <div className='option-desc'>{t('content.modal.authen_modal.sms.sub_2')} {phoneDisplay}</div>
                        </div>
                        <Radio value={'sms | +' + phone} checked={selected === 'sms | +' + phone} className='option-radio' />
                    </label>

                    <label key='email' className='option-item'>
                        <div>
                            <div className='option-label'>{t('content.modal.authen_modal.email.sub_1')}</div>
                            <div className='option-desc'>{t('content.modal.authen_modal.email.sub_2')} {emailDisplay}</div>
                        </div>
                        <Radio value={'email | ' + email} checked={selected === 'email | ' + email} className='option-radio' />
                    </label>
                    <label key='whatsapp' className='option-item'>
                        <div>
                            <div className='option-label'>{t('content.modal.authen_modal.whatsapp.sub_1')}</div>
                            <div className='option-desc'>{t('content.modal.authen_modal.whatsapp.sub_2')} {phoneDisplay}</div>
                        </div>
                        <Radio value={'whatsapp | +' + phone} checked={selected === 'whatsapp | +' + phone} className='option-radio' />
                    </label>
                </div>
            </Radio.Group>
            <Button 
                className='button-send' 
                type="primary"
                block
                style={{ marginTop: 32, borderRadius: 60, height: 44, fontWeight: 500, fontSize: 16 }}
                disabled={!selected}
                loading={loadingChoseAuthen}
                onClick={handleContinue}
            >
                Continue
            </Button>
        </Modal>
    );
};

export default ChoseAuthenModal;