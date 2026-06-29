// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => ({
  route(name, params = {}) {
    let url = app.reverse(name);
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
    return url;
  },
  t(key) {
    return i18next.t(key);
  },
  _,
  getAlertClass(type) {
    switch (type) {
      // case 'failure':
      //   return 'danger';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        throw new Error(`Unknown flash type: '${type}'`);
    }
  },
  formatDate(str) {
    const date = new Date(str);
    return date.toLocaleString();
  },
});
