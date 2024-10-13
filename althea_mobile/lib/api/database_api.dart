import 'package:althea_mobile/classes/prescription.dart';
import 'package:flutter/material.dart';
import 'database_service.dart';

class DatabaseApi with ChangeNotifier {
  List<Prescription> _prescriptions = [];

  List<Prescription> get prescriptions => _prescriptions;

  Future<void> loadPrescriptions() async {
    _prescriptions = await queryAllPrescriptions();
    notifyListeners();
  }

  void addPrescription(Prescription prescription) {
    _prescriptions.add(prescription);
    notifyListeners();
  }

  Future<void> insertPrescription(Prescription prescription) async {
    await DatabaseService.instance.insert('prescriptions', prescription);
  }

  Future<List<Prescription>> queryAllPrescriptions() async {
    List<Map<String, dynamic>> items = await DatabaseService.instance.queryAll('prescriptions');
    return items.map((item) => Prescription.fromMap(item)).toList();
  }

  void recordPrescription(int index) {
    _prescriptions.removeAt(index);
    notifyListeners();
  }

  Future<void> deletePrescription(String name) async {
    await DatabaseService.instance.delete('prescriptions', 'name = ?', [name]);
    notifyListeners();
  }
}