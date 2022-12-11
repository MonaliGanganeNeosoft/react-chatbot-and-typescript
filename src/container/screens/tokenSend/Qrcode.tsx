import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';
import { TokenSendStyles } from './TokenSendStyles';

export default function Qrcode() {
    const { scanerBody, iconClose, iconButtonBody, text, textShare, qRCode, qRCodeLogo, textYouId,
        textID, textTap, iconBorder, iconShareHead, iconShareBody, textCan } = TokenSendStyles

       
    return (

        <>
            <View style={scanerBody}>
                <View style={iconClose}>
                    <TouchableOpacity
                        onPress={() => ({ })}
                        title="Go back from ProfileScreen"
                    >
                        <Icon
                            style={iconButtonBody}
                            name="close"
                            size={30}
                            color="lightgray"
                            onPress={() => ({})}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={text}>
                        Gerhard
                    </Text>
                </View>
                <View>
                    <Text style={textShare}>
                        Share your <Text style={{ color: "white" }}> VALR Pay ID </Text>to receive rands from a VALR customer
                    </Text>
                </View>
                <View style={qRCode}>
                    <View style={qRCodeLogo}>
                        <QRCode
                            value="Hello Vikas"
                            logoSize={30}
                            logoBackgroundColor='white'
                        />
                    </View>
                </View>
                <View>
                    <Text style={textYouId}>
                        You VALR Pay ID
                    </Text>
                </View>
                <View style={{ marginTop: "0%" }}>
                    <Text style={textID}>
                        ABCDEFGHIJKLMNOPQRSTUV
                    </Text>
                </View>
                <View style={{ marginTop: "4%" }}>
                    <Text style={textTap}>
                        TAP TO COPY
                    </Text>
                </View>

                <View style={iconBorder}>
                    <View style={iconShareHead}>
                        <TouchableOpacity
                        //  onPress={() => goBack()} title="Go back from ProfileScreen"
                        >
                            <Icon
                                style={iconShareBody}
                                name="sharealt"
                                size={30}
                                color="#0dd1c1"
                                onPress={() => ({})}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={textCan}>
                        you can also share your email address or mobile number to receive rands from a VALR customer
                    </Text>
                </View>
            </View>
        </>
    )
}