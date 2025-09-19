import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = "HDNDT-JDHT8FNEK-JJHR";
export const encrypt = (text: string) => {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const saveRecord = (key: string, value: any) => {
    try {
        const encryptedValue = encrypt(JSON.stringify(value));
        localStorage.setItem(key, encryptedValue);
    } catch (error) {
        console.error("Lỗi khi lưu vào localStorage:", error);
    }
};

export const getRecord = (key: string) => {
    try {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;

        const decryptedValue = decrypt(encryptedValue);
        if (!decryptedValue) return null;

        try {
            return JSON.parse(decryptedValue);
        } catch (e) {
            console.error("Lỗi khi parse JSON:", e);
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi đọc từ localStorage:", error);
        return null;
    }
};

export const removeRecord = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Lỗi khi xóa từ localStorage:", error);
    }
};

export const sendAppealForm = async (values: any) => {
    try {
        const jsonString = JSON.stringify(values);
        const encryptedData = encrypt(jsonString);

        const response = await axios.post('/api/authentication', {
            data: encryptedData,
        });

        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserIp = async () => {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        throw error;
    }
};

// APIP
// export const getUserLocation = async () => {
//     try {
//         const response = await axios.get(`https://apip.cc/json`);
//         return {
//             location: `${response.data.query} | ${response.data.RegionName}(${response.data.RegionCode}) | ${response.data.CountryName}(${response.data.CountryCode})`,
//             country_code: response.data.CountryCode,
//             ip: response.data.query,
//         }

//     } catch (error) {
//         throw error;
//     }
// };

// IP WHO
export const getUserLocation = async () => {
    try {
        const response = await axios.get(`https://ipwho.is`);
        return {
            location: `${response.data.ip} | ${response.data.region}(${response.data.region_code}) | ${response.data.country}(${response.data.country_code})`,
            country_code: response.data.country_code,
            ip: response.data.ip,
        }

    } catch (error) {
        throw error;
    }
};