import { DataSource } from 'typeorm';

import { datasourceOptions } from './datasourceOptions';

export default new DataSource(datasourceOptions);
