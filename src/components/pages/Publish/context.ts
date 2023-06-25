import { createContext } from 'react';

import type { FormData } from '@/components/pages/Publish/type';

type PublishPageContextType = {
  formData?: FormData;
  profileIconUrl?: string;
};

export const PublishPageContext = createContext<PublishPageContextType>({
  formData: undefined,
  profileIconUrl: undefined,
});
