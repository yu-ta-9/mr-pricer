import { useContext } from 'react';

import { PublishPageContext } from '@/components/pages/Publish/context';

export const usePublishPageContext = () => {
  return useContext(PublishPageContext);
};
