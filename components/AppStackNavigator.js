import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import BookDonateScreen from '../screens/ExchangeScreen';
import RecieverDetailsScreen  from '../screens/HomeScreen';




export const AppStackNavigator = createStackNavigator({
    ExchangeList:{
        screen:ExchangeScreen,
        navigationOPtions:{
            headerShown:false
        }
    },
    RecieverDetails:{
        screen:RecieverDetailsScreen,
        navigationOPtions:{
            headerShown:false
        }
    },

},
{
    initialRouteName:'ItemDonateList'
}
); 