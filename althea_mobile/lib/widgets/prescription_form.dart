import 'package:althea_mobile/api/database_api.dart';
import 'package:althea_mobile/classes/prescription.dart';
import 'package:flutter/material.dart';

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

  Future<void> _submitForm() async {
    if (_formKey.currentState?.validate() ?? false) {
      Prescription prescription = Prescription(
        name: _nameController.text,
        dosage: _dosageController.text,
        timesPerInterval: int.parse(_timesController.text),
        interval: _selectedInterval ?? 'Once a day',
      );

      DatabaseApi().addPrescription(prescription);
      await DatabaseApi().insertPrescription(prescription);

      _formKey.currentState?.reset();
      _nameController.clear();
      _dosageController.clear();
      _timesController.clear();

      setState(() {
        _selectedInterval = null;
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
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              const Text(
                'Add a new prescription',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple
                ),
              ),
              TextFormField(
                controller: _nameController,
                decoration: getInputDecorator('Medication'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the medication name';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _dosageController,
                decoration: getInputDecorator('Dosage'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the dosage';
                  }
                  return null;
                },
              ),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _timesController,
                      decoration: getInputDecorator('Times'),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter the number';
                        }
                        return null;
                      },
                    ),
                  ),
                  const Padding(
                    padding: EdgeInsets.fromLTRB(20.0, 25.0, 20.0, 10.0),
                    child: Text('per',
                    style: TextStyle(color: Colors.deepPurple),),
                  ),
                  Expanded(child:
                    DropdownButtonFormField<String>(
                      decoration: getInputDecorator('Interval'),
                      value: _selectedInterval,
                      items: <String>['day', 'week', 'month'].map((String value) {
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
                  ),
                ],
              ),
              // const SizedBox(height: 20.0),
              // InputDatePickerFormField(
              //   firstDate: DateTime(1900),
              //   lastDate: DateTime(2100),
              //   initialDate: DateTime.now(),
              //   fieldHintText: 'Select end of repeat date',
              //   onDateSubmitted: (date) {
              //     setState(() {
              //       _endRepeatDate = date;
              //     });
              //   },
              //   onDateSaved: (date) {
              //     _endRepeatDate = date;
              //   },
              // ),
              const SizedBox(height: 20.0),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitForm,

                  style: const ButtonStyle(backgroundColor: WidgetStatePropertyAll<Color>(Color(0xFF3D9991))),
                  child: const Text(
                    'Add prescription',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

InputDecoration getInputDecorator(String labelText) {
  return InputDecoration(
    labelText: labelText,
    labelStyle: const TextStyle(
      color: Colors.deepPurple
    ),
    border: const UnderlineInputBorder(
      borderSide: BorderSide(color: Colors.deepPurple),
    ),
    enabledBorder: const UnderlineInputBorder(
      borderSide: BorderSide(color: Colors.deepPurple),
    ),
  );
}