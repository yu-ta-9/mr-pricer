import { stackMiddlewares } from '@/middeleware/stackMiddlewares';
import { withAuthorization } from '@/middeleware/withAuthorization';

const middlewares = [withAuthorization];
export default stackMiddlewares(middlewares);
