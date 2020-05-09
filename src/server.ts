import app from './app';
import { port } from './config';
import logger from './util/logger';

app
  .listen(port, () => logger.info(`[your-service-here] running on port: ${port}`))
  .on('error', (e) => logger.error(e));
