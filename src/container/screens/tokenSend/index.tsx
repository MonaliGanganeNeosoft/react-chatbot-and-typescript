import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {TokenSendStyles} from './TokenSendStyles';

const TokenSend = () => {
  const {
    header,
    iconButtonBody,
    textCenter,
    textZar,
    card,
    textYou,
    textTo,
    To,
    dropdownMenu,
    textRecipient,
    iconUser,
    textMessageview,
    textMessage,
    textNote,
    textSendView,
    textSend,
    switchButton,
    textNext,
    nextView1,
    iconQRCode,
    iconQRView,
  } = TokenSendStyles;

  const [value, setValue] = useState(null);

  const [switchValue, setSwitchValue] = useState(false);
  const toggleSwitch = (value: any) => {
    setSwitchValue(value);
  };
  var data = [['', 'Hadoop', 'Spark', 'Hive']];

  const navigation = useNavigation();
  const transfer = () => {
    // navigation.navigate('')
    // history.push('/DepositDetails');
  };

  return (
    <>
      <View style={header}>
        <TouchableOpacity
        // onPress={() => goBack()} title="Go back from ProfileScreen"
        >
          <Icon
            style={iconButtonBody}
            name="arrowleft"
            size={30}
            color="white"
            onPress={() => ({})}
          />
        </TouchableOpacity>
        <Text style={textCenter}>Enter amount</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={textZar}>10.00 ZAR</Text>
        </View>
        <View>
          <View style={card}>
            <Text style={textYou}>
              You can send to any Aroko ETF Platform user
            </Text>

            {/* ******This text is close for now but in future we can use it ********* */}
            {/* <View style={To}>
              <Text style={textTo}>
                To:Mobile
              </Text>
            </View>
            <View style={dropdownMenu}>
              <DropdownMenu
                bgColor={COLORS.BLACK}

                //  tintColor={'#666666'}
                style={{ flex: 1, maxHeight: "28px", maxWidth: "29px" }}
                data={data} />
            </View> */}

            <View
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                width: '95%',
                marginLeft: '3.2%',
                marginTop: '25%',
              }}
            />
            <View>
              <Text style={textRecipient}>Recipient:</Text>
            </View>
            <View style={{backgroundColor: '#b1f2d4'}}>
              {/* ******This text is close for now but in future we can use it ********* */}

              {/* <TouchableOpacity onPress={() => { }}>
                <Icon
                  style={iconUser}
                  // backgroundColor="#b1f2d4"
                  name="user"
                  size={30}
                  color="#0dd1c1"
                  onPress={() => ({})}
                />
              </TouchableOpacity> */}
            </View>
            <View style={iconQRView}>
              <TouchableOpacity
                onPress={() => {
                  transfer();
                }}>
                <Icon
                  style={iconQRCode}
                  // backgroundColor="#b1f2d4"
                  name="qrcode"
                  size={30}
                  color="#0dd1c1"
                  onPress={() => ({})}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                height: '12%',
                width: '95%',
                marginLeft: '3.2%',
                marginTop: '3%',
              }}
            />
            <View style={textMessageview}>
              <Text style={textMessage}>Message to recipient:</Text>
            </View>
            <View>
              <TextInput
                style={{
                  height: 40,
                  marginTop: '3%',
                  fontSize: 15,
                  paddingLeft: '4%',
                }}
                placeholder="Enter note"
                onChangeText={(text: any) => setValue(text)}
              />
            </View>
            <View
              style={{
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                width: '95%',
                marginLeft: '3.2%',
                marginTop: '19%',
              }}
            />
          </View>
          <View>
            <Text style={textNote}>Note to self:</Text>
          </View>

          <View>
            <TextInput
              style={{
                height: 40,
                marginTop: '-89%',
                fontSize: 15,
                paddingLeft: '4%',
              }}
              placeholder="Enter note(optional)"
              onChangeText={(text: any) => setValue(text)}
            />
          </View>
          <View style={textSendView}>
            {/* <Text style={textSend} >
              Send anonymously:
            </Text> */}
          </View>
          <View>
            {/* ******This text is close for now but in future we can use it ********* */}

            {/* <View style={switchButton}>


              <Text>{switchValue ? true : false}</Text>
              <Switch
                style={{ marginTop: 60 }}
                onValueChange={toggleSwitch}
                value={switchValue}
              />
            </View> */}
            <TouchableOpacity onPress={() => {}}>
              <View style={nextView1}>
                <Text style={textNext}>NEXT</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default TokenSend;
