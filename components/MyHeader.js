import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import db from '../config'

export default class MyHeader extends Component{
  constructor(props){
    super(props);
this.state={
  value:'',
}

  }
  getNoOfUnreadNotifications(){
    db.collection('all_notifications').where('notification_status','==','unread')
    .onSnapshot((snapshot)=>{
   var unreadNotifications=snapshot.docs.map((doc)=>{
     doc.data()
   })
   this.setState({
     value:unreadNotifications.length
   })
    })
  }

  componentDidMount(){
    this.getNoOfUnreadNotifications()
  }

BellIconWithBadge=()=>{
return(
  <View>
<Icon name='bell'
type='font-awesome'
color='red'
size={25}
onPress={()=>{this.props.navigation.navigate('notification')}} />
<Badge value={this.state.value}
containerStyle={{position:'absolute',top:-4,right:-4}} />
  </View>
)
}

  render(){
  return (
    <Header
    leftComponent={<Icon name='bars' type='font-awesome' color='black' onPress={()=>{
      this.props.navigation.toggleDrawer()
    }} />}
    centerComponent={{
      text:this.props.title , style:{color:'grey', fontSize:20, fontWeight:'bold'}
    }
    }
    rightComponnent={
      <this.BellIconWithBadge{...this.props} />
    }
      backgroundColor = "#eaf8fe"
    />
  );
};

}