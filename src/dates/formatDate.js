import moment from 'moment';

export default function formatDate(date) {
  if (date) {
    return moment(date).format('lll');
  }

  return 'N/A';
}
