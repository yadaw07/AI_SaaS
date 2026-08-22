import { useMutation } from '@tanstack/react-query';

import axios from 'axios';

type Props = {
  file_key: string;
  file_name: string;
  file_url: string;
};

export const useUploadFile = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name, file_url }: Props) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
        file_url,
      });

      return response.data;
    },
    onError: (error) => {
      console.error('Failed to save chat:', error);
    },
  });

  return { mutateAsync, isPending };
};
