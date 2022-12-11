export function getFileNameFromUrl(url) {
  if (url) {
    const m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return `${m[1]}.${url.split('.').pop()}`;
    }
  }
  return '';
}
export function stringEscape(s) {
  return s
    ? s
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/[\x00-\x1F\x80-\x9F]/g, hex)
    : s;
  function hex(c) {
    const v = '0' + c.charCodeAt(0).toString(16);
    return '\\x' + v.substr(v.length - 2);
  }
}

export function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function getRandomId(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
