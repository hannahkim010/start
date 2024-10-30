import React, { useEffect, useState } from 'react';
import { AppRegistry, View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar, Agenda } from 'react-native-calendars';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// landing
const LandingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('TouchID');
    }, 4000); // 4 sec delay

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./CacaoTax.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

// touch id
const TouchIDScreen = ({ navigation }) => {
  const authenticateWithBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Error', 'Biometric authentication is not available on this device.');
        navigation.navigate('Login');
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Error', 'No biometric records found. Please set up biometrics on your device.');
        navigation.navigate('Login');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Touch ID',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        navigation.navigate('HomeTabs');
      } else {
        Alert.alert('Authentication Failed', 'Unable to authenticate using biometrics. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication. Please try again.');
      console.error('Authentication Error:', error);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.touchIDContainer}>
      <Icon name="finger-print" size={100} color="#000" />
      <Text style={styles.touchIDTitle}>Login with Touch ID</Text>
      <Text style={styles.touchIDSubtitle}>Use Touch ID for faster, easier access to your account.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={authenticateWithBiometrics}>
        <Text style={styles.buttonText}>Use Touch ID</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login with Username/Password</Text>
      </TouchableOpacity>
    </View>
  );
};

// login 
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'cacao' && password === 'cacao') {
      navigation.navigate('HomeTabs');
    } else {
      Alert.alert('Error', 'Incorrect username or password.');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// home
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.homeTitle}>Cacao Order App</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('OrderOptions')}>
        <Text style={styles.buttonText}>Start an Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton} onPress={() => alert('Review Past Orders')}>
        <Text style={styles.buttonText}>Review Past Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <Icon name="person-circle" size={40} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

// order options screen
const OrderOptionsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.homeTitle}>Order Options</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => alert('Internal Order')}>
        <Text style={styles.buttonText}>Internal Order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.primaryButton} onPress={() => alert('External Order')}>
        <Text style={styles.buttonText}>External Order</Text>
      </TouchableOpacity>
    </View>
  );
};

// pf screen
const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const saveProfile = () => {
    alert(`Profile saved:\nName: ${name}\nEmail: ${email}`);
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileText}>Update Your Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tax Payer ID"
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput
        style={styles.input}
        placeholder="Outlet #"
        value={email} 
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const ScheduleScreen = () => {
  const [viewMode, setViewMode] = useState('month');

  const renderCalendar = () => {
    if (viewMode === 'month') {
      return <Calendar />;
    } else if (viewMode === 'week') {
      return <Agenda />;
    } else if (viewMode === 'day') {
      return renderDayView();
    }
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const renderTimeSlots = () => {
      return timeSlots.map((time, index) => (
        <View key={index} style={styles.timeSlot}>
          <Text style={styles.timeText}>{time}</Text>
          <View style={styles.line} />
        </View>
      ));
    };

    const renderEvents = () => {
      const events = [
        { time: '10:00', title: 'Team Meeting' },
        { time: '13:00', title: 'Project Review' },
        { time: '15:00', title: 'Lunch with Client' },
      ];

      return events.map((event, index) => (
        <View key={index} style={[styles.eventContainer, { top: event.time.replace(':', '0') * 4 }]}>
          <Text style={styles.eventTitle}>{event.title}</Text>
        </View>
      ));
    };

    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.scheduleContainer}>
          {renderTimeSlots()}
          {renderEvents()}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarButtons}>
        <TouchableOpacity style={styles.viewButton} onPress={() => setViewMode('day')}>
          <Text style={styles.viewButtonText}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton} onPress={() => setViewMode('week')}>
          <Text style={styles.viewButtonText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewButton} onPress={() => setViewMode('month')}>
          <Text style={styles.viewButtonText}>Month</Text>
        </TouchableOpacity>
      </View>
      {renderCalendar()}
    </View>
  );
};

// stack nav for home flow
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OrderOptions" component={OrderOptionsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// nav bar
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="calendar" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// main app comp
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TouchID" component={TouchIDScreen} options={{ title: 'Touch ID' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="HomeTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
  },
  touchIDContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  touchIDTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2C3E50',
  },
  touchIDSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: '#D0E6C9',
    padding: 15,
    borderRadius: 30,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    marginTop: 20,
    backgroundColor: '#D0E6C9',
    padding: 15,
    borderRadius: 30,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2C3E50',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  calendarContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  calendarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  viewButton: {
    padding: 10,
    backgroundColor: '#D0E6C9',
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#2C3E50',
  },
  calendarContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
  },
  calendarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  viewButton: {
    padding: 10,
    backgroundColor: '#D0E6C9',
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scheduleContainer: {
    position: 'relative',
    width: '100%',
  },
  timeSlot: {
    position: 'relative',
    height: 60, 
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
  },
  timeText: {
    position: 'absolute',
    left: 10,
    color: '#666',
  },
  line: {
    position: 'absolute',
    left: 50,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  eventContainer: {
    position: 'absolute',
    left: 60,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    width: '70%', 
  },
  eventTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
AppRegistry.registerComponent('main', () => App);
