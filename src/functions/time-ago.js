import { date } from 'quasar';
import { parseDate } from 'src/functions'

export const timeAgo = val => {
  const dateVal = parseDate(val)
  if (date.isValid(dateVal)) {
    // process val
    // seconds ago
    // mins ago
    // hours ago
    // days ago
    // weeks ago
    // months ago
    // years ago
    const today = new Date();
    const diff = date.getDateDiff(today, dateVal, 'seconds');

    let formattedTimeAgo = '';

    // do an if - else based on number of seconds
    if (diff < 60) {
      formattedTimeAgo = diff + ' seconds ago';
    } else if (diff >= 60 && diff < 3600) {
      formattedTimeAgo = Math.ceil(diff / 60) + ' minutes ago';
    } else if (diff >= 3600 && diff < 86400) {
      formattedTimeAgo = Math.ceil(diff / 3600) + ' hours ago';
    } else if (diff >= 86400 && diff < 604800) {
      formattedTimeAgo = Math.ceil(diff / 86400) + ' days ago';
    } else if (diff >= 604800 && diff < 2592000) {
      formattedTimeAgo = Math.ceil(diff / 604800) + ' weeks ago';
    } else if (diff >= 2592000 && diff < 31536000) {
      formattedTimeAgo = Math.ceil(diff / 2592000) + ' months ago';
    } else if (diff >= 31536000) {
      formattedTimeAgo = Math.ceil(diff / 31536000) + ' years ago';
    } else {
      formattedTimeAgo = '';
    }

    return formattedTimeAgo;
  }
  return '';
};