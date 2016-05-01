import { inspect } from 'util';

export const inspectOpts = {
  hidden: false,
  color: true,
  depth: 10
};

export function formatAs(flag, val) {
  switch (flag) {
    case 'j':
      return inspect(val, inspectOpts);

    case 'n':
      return parseFloat(val);

    case 's':
    default:
      return String(val);
  }
}

export function formatMsg(msg) {
  if (!Array.isArray(msg)) return msg;

  const format = msg[0] || '';
  const args = msg.slice(1);

  return [
    format.replace(/(.?)%([jsd])/g, (a, pre, flag) => {
      if (!args.length) return a;
      if (pre === '%') return `%${flag}`;
      return (pre || '') + formatAs(flag, args.shift());
    }),
    ...args
  ].join(' ')
}
