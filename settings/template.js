
import _ from 'lodash';
import settings from './default.js';


const localSettings = {
  PORT: 8080,
  SSL: false,
};


export default _.extend(settings, localSettings);
