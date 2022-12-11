import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Modal,
} from 'react-native';
import {COLORS} from '../../styles/Colors';
import PrimaryButton from '../buttons/PrimaryButton';

const Width = Dimensions.get('window').width;
const Height_Modal = 130;
export const CommonModal = (props: any) => {
  const closeModal = (bool: any, data: any) => {
    props.changeModalVisible(bool);
    // props.setData(data);
  };
  return (
    <>
      <Modal
        transparent={true}
        animationType="fade"
        visible={props.modalVisibility}
        onRequestClose={() => props.changeModalVisible(false)}>
        <TouchableOpacity disabled={true} style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.textView}>
              <Text style={styles.textTitle}>{props.setDescription}</Text>
              <View style={styles.buttonsView}>
                <PrimaryButton
                  label="Cancel"
                  callback={() => {
                    closeModal(false, 'cancel');
                  }}
                  color={COLORS.RED}
                  bgColor={COLORS.WHITE}
                  borderColor={COLORS.RED}
                />
                <PrimaryButton
                  label="Confirm"
                  callback={() => {
                    closeModal(false, 'confirm');
                  }}
                  color={COLORS.BLUE}
                  bgColor={COLORS.WHITE}
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    height: Height_Modal,
    width: Width - 80,
    paddingTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  textView: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  textTitle: {
    margin: 10,
    fontSize: 16,
    color: 'black',
  },
  buttonsView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  touchableOpacity: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonStyle: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    width: 80,
    borderColor: 'black',
  },
});
