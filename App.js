import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import Hmacsha256 from 'crypto-js/hmac-sha256';
import CryptoIcons from './src/components/cryptoIcons/CryptoIcons';
import BackImage from './src/images/BackImage.jpg';

const apiKey =
  '<yourBinanceApiKey>';
const secret =
  '<yourBinanceSecretKey>';
const apiBinance = 'https://api.binance.com/';

export default class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.getPrice = this.getPrice.bind(this);
    this.state = {
      fetching: false,
      data: null,
      accBictions: null,
      accVal: null
    };
  }

  async getData() {
    this.setState({ fetching: true });
    const timestamp = `timestamp=${new Date().getTime()}`;
    const signature = Hmacsha256(timestamp, secret);
    const fetchConf = {
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    };
    const res = await fetch(
      `${apiBinance}api/v3/account?${timestamp}&signature=${signature}`,
      fetchConf
    );
    const data = await res.json();
    const elmtsn = [];
    await data.balances.map(elm => (elm.free > 0.0 ? elmtsn.push(elm) : ''));
    await this.setState({ data: elmtsn });
    await this.getPrice();
  }

  async getPrice() {
    this.setState({ fetching: true });
    const timestamp = `timestamp=${new Date().getTime()}`;
    const signature = Hmacsha256(timestamp, secret);
    const fetchConf = {
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    };
    const res = await fetch(`${apiBinance}/api/v1/ticker/allPrices`);
    const data = await res.json();
    // console.log('dat!!!', data);
    let bitCoins = 0;
    let USDT = 0;
    await data.map(elm => {
      this.state.data.map(curr => {
        if (elm.symbol === `${curr.asset}BTC`) {
          console.log('found value in wallet', elm.symbol);
          console.log('found value in wallet', elm.price);
          bitCoins += elm.price * curr.free;
        }
        if (elm.symbol === 'BTCUSDT') {
          USDT = elm.price;
        }
      });
    });

    console.log('elm.price USDt', USDT);
    console.log('Bits in alts', bitCoins);

    this.state.data.map(elm => {
      if (elm.asset === 'BTC') {
        bitCoins += +elm.free;
      }
    });

    this.setState({
      accBictions: bitCoins,
      accVal: bitCoins * USDT,
      fetching: false
    });
    console.log(`my bits = ${bitCoins} Wallet price = ${bitCoins * USDT}`);

    // const elmtsn = [];
    // await data.balances.map(elm => (elm.free > 0.0 ? elmtsn.push(elm) : ''));
    // console.log('elmtsn', elmtsn);
    // this.setState({ data: elmtsn, fetching: false });
  }

  showCurrencies(curr) {
    const imageSrc = CryptoIcons(curr.asset.toLowerCase());
    return (
      <View key={curr.asset} style={styles.showCurrencies}>
        <Image source={imageSrc} style={{ width: 40, height: 40 }} />
        <Text
          style={{
            backgroundColor: 'transparent',
            color: '#00daff',
            marginLeft: 5
          }}
        >
          {curr.asset}
        </Text>
        <Text
          style={{
            backgroundColor: 'transparent',
            color: '#7950f3',
            marginLeft: 5
          }}
        >
          {curr.free}
        </Text>
      </View>
    );
  }

  render() {
    const { data, fetching, accBictions, accVal } = this.state;
    if (fetching)
      return (
        <View style={styles.container}>
          <Image source={BackImage} style={styles.imageBack} />
          <ActivityIndicator />
        </View>
      );
    if (data) {
      return (
        <View style={styles.container}>
          <Image source={BackImage} style={styles.imageBack} />
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {data.map(elm => this.showCurrencies(elm))}
            <Text style={styles.touchText}>{`Bits ${accBictions}`}</Text>
            <Text style={styles.touchText}>{`Price ${accVal}`}</Text>
            <TouchableOpacity onPress={this.getData}>
              <Text style={styles.touchText}>Update</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image source={BackImage} style={styles.imageBack} />
        <TouchableOpacity onPress={this.getData}>
          <Text style={styles.touchText}>Get my portfolio</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBack: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  touchText: {
    fontSize: 20,
    color: '#09a2ff',
    backgroundColor: 'rgba(175, 71, 147, 0.5)',
    padding: 15
  },
  showCurrencies: {
    paddingVertical: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  contentContainer: {
    paddingVertical: 20
  }
});
