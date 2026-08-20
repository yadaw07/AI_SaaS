import { useMutation } from '@tanstack/react-query';

import axios from 'axios';

type Props = {
  file_key: string;
  file_name: string;
};

export const useUploadFile = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name }: Props) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });

      return response.data;
    },
    onError: (error) => {
      console.error('Failed to save chat:', error);
    },
  });

  return { mutate, isPending };
};
