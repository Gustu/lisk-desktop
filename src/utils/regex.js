export default {
  address: /^[1-9]\d{0,19}L$/,
  amount: /^\d+(\.\d{1,8})?$/,
  delegateName: /^[a-z0-9!@$&_.]{0,20}$/,
  transactionId: /^[1-9]\d{0,19}$/,
  btcAddressTrunk: /^(.{10})(.+)?(.{10})$/,
  delegateSpecialChars: /[a-z0-9!@$&_.]+/g,
  htmlElements: /<(\w+).*?>([\s\S]*?)<\/\1>(.*)/,
  releaseSummary: /<h4>([\s\S]*?)<\/h4>/i,
};
