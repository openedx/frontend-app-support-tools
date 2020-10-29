import moment from 'moment';

export default function formatDate(date) { // todo: move this utils/index.js
  if (date) {
    return moment(date).format('lll');
  }

  return 'N/A';
}
