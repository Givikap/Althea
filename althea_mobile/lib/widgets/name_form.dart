import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../screens/main_screen.dart';

class NameForm extends StatefulWidget {
  const NameForm({super.key});

  @override
  _NameFormState createState() => _NameFormState();
}

class _NameFormState extends State<NameForm> {
  final _formKey = GlobalKey<FormState>();

  final _nameController = TextEditingController();

  Future<void> _setName() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isWelcomeComplete', true);
    await prefs.setString('name', _nameController.text); // Save the value
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _nameController,
            decoration: getInputDecorator('Enter your name'),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your name';
              }
              return null;
            },
            style: const TextStyle(
              color: Colors.white,
            ),
            cursorColor: Colors.deepPurple,
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  await _setName();

                  Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const MainScreen())
                  );
                }
              },
              child: const Text(
                'Get Started',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.deepPurple,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

InputDecoration getInputDecorator(String hintText) {
  return InputDecoration(
    labelText: hintText,
    labelStyle: const TextStyle(
      color: Colors.white,
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10.0),
      borderSide: const BorderSide(color: Colors.deepPurple, width: 1.0),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(10.0),
      borderSide: const BorderSide(color: Colors.deepPurple, width: 1.0),
    ),
  );
}
