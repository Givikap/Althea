import 'package:althea_mobile/classes/prescription.dart';
import 'package:flutter/material.dart';
import 'database_service.dart';

class DatabaseApi with ChangeNotifier {
  List<Prescription> _prescriptions = [];
  List<Prescription> _takenPrescription = [];

  List<Prescription> get prescriptions => _prescriptions;

  Future<void> loadPrescription() async {
    List<Prescription> prescriptions = await queryAllPrescription();
    _prescriptions = prescriptions.where((p) => !_takenPrescription.contains(p)).toList();
    notifyListeners();

    print(_takenPrescription);
  }

  Future<void> insertPrescription(Prescription prescription) async {
    await DatabaseService.instance.insert('prescriptions', prescription);
    _prescriptions.add(prescription);
    notifyListeners();
  }

  Future<List<Prescription>> queryAllPrescription() async {
    List<Map<String, dynamic>> items = await DatabaseService.instance.queryAll('prescriptions');
    return items.map((item) => Prescription.fromMap(item)).toList();
  }

  void recordPrescription(int index) {
    _takenPrescription.add(_prescriptions[index]);
    _prescriptions.removeAt(index);
    notifyListeners();
  }

  Future<void> deletePrescription(String name) async {
    await DatabaseService.instance.delete('prescriptions', 'name = ?', [name]);
    _prescriptions.removeAt(_prescriptions.indexWhere((p) => p.name == name));
    _takenPrescription.removeAt(_takenPrescription.indexWhere((p) => p.name == name));
    notifyListeners();
  }
}