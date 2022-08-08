import { createLogger, format, transports } from 'winston';

const Logger = createLogger({
  defaultMeta: { service: 'merchant-service' },
  format: format.combine(format.json()),
  transports: [new transports.Console()],
});
export default Logger;


