import axios from 'axios';

const baseURL = import.meta.env.BASE_URL;
console.log(baseURL)
// client 생성
export const client = axios.create({
    baseURL,
});
// API 네임스페이스
export const API = {
    getGptResponse: async (params) => {
        const response = await client.post(`/getGptResponse`, params);

        return response.data;
    },
};
