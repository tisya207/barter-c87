import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';

import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId:firebase.auth().currentUser.email,
      receiverId:this.props.navigation.getParam('details')['user_id'],
      requestId:this.props.navigation.getParam('details')['request_id'],
      itemName:this.props.navigation.getParam('details')['item_name'],
      itemDescription:this.props.navigation.getParam('details')['item_description'],
      receiverName:'',
      receiverContact:'',
      receiverAddress:'',
      receiverRequestDocId:'',
    }
  }

  getUserDetails = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

getRecieverDetails(){
  db.collection('users').where('email_id','==',this.state.receiverId).get()
.then((snapshot)=>{
snapshot.forEach((doc)=>{
  this.setState({
    receiverName:doc.data().first_name,
    receiverContact:doc.data().contact,
    receiverAddress:doc.data().address
  })
})
})
 }
 updateBookStatus = () => {
  db.collection("all_barters").add({
    item_name: this.state.itemName,
    request_id: this.state.requestId,
    request_by: this.state.reaceiverName,
    donor_id: this.state.userId,
    request_status: "Donor Interested",
  });
};
 addNotification=()=>{
  var message= this.state.userName+'HAS SHOWN INTEREST IN DONATING THE BOOK'
  db.collection('all_notifications').add({
  targeted_user_id:this.state.receiverId,
  doner_id:this.state.userId,
  request_id:this.state.requestId,
  item_name:this.state.itemName,
  date:firebase.firestore.FieldVlaue.serverTimestamp(),
  notification_status:'unread',
  messsage:message
  })
}
render() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.1 }}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="feather"
              color="#696969"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={{
            text: "Donate Books",
            style: { color: "#90A5A9", fontSize: 20, fontWeight: "bold" },
          }}
          backgroundColor="#eaf8fe"
        />
      </View>
      <View style={{ flex: 0.3 }}>
        <Card title={"Item Information"} titleStyle={{ fontSize: 20 }}>
          <Card>
            <Text style={{ fontWeight: "bold" }}>
              Name : {this.state.itemName}
            </Text>
          </Card>
          <Card>
            <Text style={{ fontWeight: "bold" }}>
              Description : {this.state.itemDescription}
            </Text>
          </Card>
        </Card>
      </View>
      <View style={{ flex: 0.3 }}>
        <Card title={"Receiver Information"} titleStyle={{ fontSize: 20 }}>
          <Card>
            <Text style={{ fontWeight: "bold" }}>
              name : {this.state.reaceiverName}
            </Text>
          </Card>
          <Card>
            <Text style={{ fontWeight: "bold" }}>
              Contact : {this.state.receiverContact}
            </Text>
          </Card>
          <Card>
            <Text style={{ fontWeight: "bold" }}>
              address : {this.state.receiverAddress}
            </Text>
          </Card>
        </Card>
      </View>
      <View style={styles.buttonContainer}>
        {this.state.receiverId !== this.state.userId ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.addNotification();
              this.props.navigation.navigate("MyBarters");
            }}
          >
            <Text>i want to exchange </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}}

const styles = StyleSheet.create({
container: {
  flex: 1,
},
buttonContainer: {
  flex: 0.3,
  justifyContent: "center",
  alignItems: "center",
},
button: {
  width: 200,
  height: 50,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 10,
  backgroundColor: "orange",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 8,
  },
  elevation: 16,
},
});

