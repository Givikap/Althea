import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../widgets/prescription_form.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() =>
      _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final String _greeting = getGreeting();
  late final String _name;

  int _selectedIndex = 0;
  
  @override
  void initState() {
    super.initState();
    _getName();
  }

  Future<void> _getName() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      _name = prefs.getString('name')!;
    });
  }

  static const TextStyle optionStyle = TextStyle(fontSize: 30, fontWeight: FontWeight.bold);
  static const List<Widget> _widgetOptions = <Widget>[
    Column(
      children: [
        Text(
          'Index 0: Home',
          style: optionStyle,
        ),
      ],
    ),
    Scrollbar(
      child: PrescriptionForm(),
    ),
    Column(
      children: [
        Text(
          'Index 2: Survey',
          style: optionStyle,
        ),
      ],
    ),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          '$_greeting, $_name',
          style: const TextStyle(
            fontSize: 20, // Set text size
            color: Colors.white, // Set text color
          ),
        ),
        backgroundColor: const Color(0xFF3D9991),
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.medication),
            label: 'Prescriptions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.check),
            label: 'Self-Check',
          ),
        ],
        selectedItemColor: Colors.deepPurple,
        unselectedItemColor: Colors.grey,

        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

String getGreeting() {
  final hour = DateTime.now().hour;

  if (hour > 6 && hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else if (hour < 24){
    return "Good evening";
  } else {
    return "Good night";
  }
}
