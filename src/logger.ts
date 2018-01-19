
export function log(data: string, source = ''){
  data.split('\n').forEach(line => console.log(source ? `[${source}]: ${line}` : line));
}
