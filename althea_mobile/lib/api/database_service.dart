import 'package:althea_mobile/classes/prescription.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._internal();

  static Database? _database;

  DatabaseService._internal();

  Future<Database> get database async {
    if (_database != null) {
      return _database!;
    }

    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, 'database.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDatabase,
    );
  }

  Future<void> _createDatabase(Database db, _) async {
    return await db.execute('''
      CREATE TABLE prescriptions (
        name TEXT,
        dosage TEXT,
        timesPerInterval INT,
        interval TEXT
      )'''
    );
  }

  Future<void> insert(String table, Prescription prescription) async {
    final db = await instance.database;
    await db.insert(table, prescription.toMap());
  }

  Future<List<Map<String, dynamic>>> queryAll(String table) async {
    final db = await instance.database;
    return await db.query(table);
  }

  Future<List<Map<String, dynamic>>> query(String table, String where) async {
    final db = await instance.database;
    return await db.query(table, where: where);
  }

  Future<void> delete(String table, String where, List<dynamic> arg) async {
    final db = await instance.database;
    await db.delete(table, where: where, whereArgs: arg);
  }
}