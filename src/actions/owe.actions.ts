import axios from 'axios';

export const payFriend = async (oweId: string) => {
    const response = await axios.post(`/api/owe/pay-friend/${oweId}`);
    return response.data.data;
};
