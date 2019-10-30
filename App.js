import React, { Component } from 'react';
import { TextInput, View, StyleSheet, Text, Picker, Button, TouchableOpacity} from 'react-native';

export default class ExchangeRate extends Component {
  constructor(props) {
    super(props);
    this.exchange = this.exchange.bind(this);
    this.state = {
      amount: 0,
      result: 0,
      fromCurrency: '',
      toCurrency: '',
      currencies: [],
    };
  }
  componentDidMount(){
    fetch('https://api.exchangeratesapi.io/latest', {method: 'GET',                       
    headers: {        
      'Content-Type': 'application/json',  
    }})
    .then((response) => {
      if(!response.ok){
        Alert.alert('Error',response.status.toString());
        throw Error('Error'+ response.status);
      }
      return response.json()
    })
    .then((stores) => {
      const currencyAr = ["EUR"]
      for (const key in stores.rates) {
          currencyAr.push(key)
      }
      this.setState({ currencies: currencyAr.sort() })
    })
    .catch((error) => {
      console.log(error)
    });
  }

  exchange() {
    if(this.state.fromCurrency != this.state.toCurrency){
      fetch('http://api.openrates.io/latest?base=' + this.state.fromCurrency + '&symbols=' + this.state.toCurrency, {method: 'GET',                       
      headers: {        
        'Content-Type': 'application/json',  
      }})
      .then((response) => {
        if(!response.ok){
          Alert.alert('Error',response.status.toString());
          throw Error('Error'+ response.status);
        }
        return response.json()
      })
      .then((rates) => {
        const result = this.state.amount + (rates.rates[this.state.toCurrency]);
        const val = parseFloat(result).toFixed(2);
        this.setState({ result: val })
      })
      .catch((error) => {
        console.log(error)
      });
    } else {
      this.setState({ result: "Cannot convert same currency." });
    }

  };

  render() {
    let currencyItems = this.state.currencies.map( (s, i) => {
      return <Picker.Item key={i} value={s} label={s} />
    });
    return (
      <View style={{padding: 10}}>
        <Text style={styles.name}>Currency Rate</Text>
        <View style={{marginLeft: 90, marginBottom:20}}>
          <TextInput
            value={this.state.amount}
            onChangeText={(amount)=>this.setState({amount})}
            keyboardType={'numeric'}
            style={styles.input}
          />
        </View>
        <View style={{alignItems: 'center', flexDirection: "row"}}>
            <Picker
              selectedValue={this.state.fromCurrency}
              style={{height: 50, width: 140, marginLeft: 30}}
              onValueChange={(itemValue) =>
                this.setState({fromCurrency: itemValue})
              }>
              {currencyItems}
            </Picker>
            <View style={{marginTop: 2, marginLeft:10, marginRight:-20}}>
              <Text> To </Text>
            </View>
            <Picker
              selectedValue={this.state.toCurrency}
              style={{height: 50, width: 140, marginLeft: 50}}
              onValueChange={(itemValue) =>
                this.setState({toCurrency: itemValue})
              }>
              {currencyItems}
            </Picker>
        </View>
        <Button 
          onPress={this.exchange}
          title="Convert"/>
        <Text style={{fontSize: 30, textAlign: 'center', marginTop: 20}}>
          {this.state.result}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 30,
    color: '#7A95D2',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  input2: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 30,
  },
  title: {
    marginBottom: 30,
    fontSize: 20,
  },
});


