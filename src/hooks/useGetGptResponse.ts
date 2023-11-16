import { useMutation } from '@tanstack/react-query';

import { API } from '../api';

export const useGetGptResponse = () => {
    const mutation = useMutation({
        mutationFn: API.getGptResponse,
        onSuccess: (data, variables) => {
            console.log(data);
            switch (data.code) {
                case 201:
                    console.log(variables)
                    break;
                case 200:
                    console.log(variables)
                    break;
                default:
                    break;
            }
        },
        onError: error => {
            console.log(error);
            // TODO: 구현 예정
        },
    });

    return mutation;
};
