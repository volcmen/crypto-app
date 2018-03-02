const CryptoIcons = name => {
  switch (name) {
    case 'btc':
      return require('../../icons/crypto/btc.png');
    case 'zrx':
      return require('../../icons/crypto/zrx.png');
    case 'sub':
      return require('../../icons/crypto/sub.png');
    case 'xrp':
      return require('../../icons/crypto/xrp.png');
    case 'ada':
      return require('../../icons/crypto/ada.png');
    case 'waves':
      return require('../../icons/crypto/waves.png');
    default:
      return require('../../icons/crypto/unknown.png');
  }
};

export default CryptoIcons;
