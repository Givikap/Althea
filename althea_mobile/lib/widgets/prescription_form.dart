import 'package:flutter/material.dart';

class Medication {
  final String name;
  final String dosage;
  final int timesPerInterval;
  final String interval;
  final DateTime? endOfRepeatDate;

  Medication({
    required this.name,
    required this.dosage,
    required this.timesPerInterval,
    required this.interval,
    this.endOfRepeatDate,
  });
}

class PrescriptionForm extends StatefulWidget {
  const PrescriptionForm({super.key});

  @override
  _PrescriptionFormState createState() => _PrescriptionFormState();
}

class _PrescriptionFormState extends State<PrescriptionForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _dosageController = TextEditingController();
  final _timesController = TextEditingController();
  String? _selectedInterval;
  DateTime? _endRepeatDate;

  void _submitForm() {
    if (_formKey.currentState?.validate() ?? false) {
      // Create a Medication object
      Medication medication = Medication(
        name: _nameController.text,
        dosage: _dosageController.text,
        timesPerInterval: int.parse(_timesController.text),
        interval: _selectedInterval ?? 'Once a day', // Default to once a day
        endOfRepeatDate: _endRepeatDate,
      );

      // Do something with the medication object (e.g., save it)
      print('Medication: ${medication.name}, Dosage: ${medication.dosage}, Times: ${medication.timesPerInterval}, Interval: ${medication.interval}, End Date: ${medication.endOfRepeatDate}');

      // Optionally clear the form
      _formKey.currentState?.reset();
      _nameController.clear();
      _dosageController.clear();
      _timesController.clear();
      setState(() {
        _selectedInterval = null;
        _endRepeatDate = null;
      });
    }
  }

  Future<void> _selectEndRepeatDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _endRepeatDate ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
    );
    if (picked != null && picked != _endRepeatDate) {
      setState(() {
        _endRepeatDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              TextFormField(
                controller: _nameController,
                decoration: InputDecoration(labelText: 'Medication Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the medication name';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _dosageController,
                decoration: InputDecoration(labelText: 'Dosage (as a string)'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the dosage';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _timesController,
                decoration: InputDecoration(labelText: 'Times per interval (number only)'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the times per interval';
                  }
                  if (int.tryParse(value) == null) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },
              ),
              DropdownButtonFormField<String>(
                decoration: InputDecoration(labelText: 'Interval'),
                value: _selectedInterval,
                items: <String>['Once a day', 'Once a week', 'Once a month']
                    .map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setState(() {
                    _selectedInterval = newValue;
                  });
                },
              ),
              Row(
                children: [
                  Text(
                    _endRepeatDate == null
                        ? 'No end date selected'
                        : 'End of Repeat Date: ${_endRepeatDate!.toLocal()}'.split(' ')[0],
                  ),
                  TextButton(
                    onPressed: () => _selectEndRepeatDate(context),
                    child: const Text('Select Date'),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: _submitForm,
                child: const Text('Add prescription'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}