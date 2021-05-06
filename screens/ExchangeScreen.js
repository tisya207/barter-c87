import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      itemName: "",
      description: "",
      exchangeId:'',
    };
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addItem = (itemName, description) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("requested_items").add({
      user_id: userId,
      item_name: itemName,
      item_description: description,
      request_id: randomRequestId,
      exchange_id:exchangeId,
      item_status: 'requested',
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await this.getExchangeRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsItemRequestActive: true,
          });
        });
      });
    this.setState({
      itemName: "",
      description: "",
    });

    return Alert.alert("Item Requested Successfully");
  };

  receivedItems = (itemName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_items").add({
      user_id: userId,
      item_name: itemName,
      request_id: requestId,
      itemStatus: "received",
    });
  };

  getIsExchangeRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsItemRequestActive: doc.data().IsItemRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }
  
  getExchangeRequest = () => {
    var ItemRequest = db
      .collection("requested_items")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedItemName: doc.data().item_name,
              itemStatus: doc.data().item_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var itemName = doc.data().item_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the item " + itemName,
                  notification_status: "unread",
                  item_name: itemName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getExchangeRequest();
    this.getIsExchangeRequestActive();
  }

  updateExchangeRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection("requested_books").doc(this.state.docId).update({
      book_status: "recieved",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: false,
          });
        });
      });
  };


  render() {
    if (this.state.IsExchangeRequestActive === true) {
      return (
        // Status screen

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text> Item Status </Text>

            <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "orange",
              backgroundColor: "orange",
              width: 300,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateExchangeRequestStatus();
              this.receivedItems(this.state.requestedItemName);
            }}
          >
            <Text>I recieved the item </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        // Form screen
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Item" navigation={this.props.navigation} />

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text) => {
                  this.setState({
                    itemName: text,
                  });
                }}
                value={this.state.itemName}
              />
              <TextInput
                style={[styles.formTextInput, { height: 300 }]}
                multiline
                numberOfLines={8}
                placeholder={"describe the item"}
                onChangeText={(text) => {
                  this.setState({
                    description: text,
                  });
                }}
                value={this.state.description}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.addRequest(
                    this.state.itemName,
                    this.state.description
                  );
                }}
              >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
