import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:althea_mobile/api/database_api.dart';

class PrescriptionsReminders extends StatefulWidget {
  const PrescriptionsReminders({super.key});

  @override
  _PrescriptionsRemindersState createState() => _PrescriptionsRemindersState();
}

class _PrescriptionsRemindersState extends State<PrescriptionsReminders> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<DatabaseApi>(
        builder: (context, databaseProvider, child) {
          return databaseProvider.prescriptions.isNotEmpty
              ? ListView.builder(
            itemCount: databaseProvider.prescriptions.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Card(
                  child: ListTile(
                    title: Text(databaseProvider.prescriptions[index].name),
                    trailing: ElevatedButton(
                      onPressed: () {
                        databaseProvider.recordPrescription(index);
                      },
                      child: Text('Done'),
                    ),
                  ),
                ),
              );
            },
          )
              : const Center(
            child: Text('No prescriptions yet.'),
          );
        }
      )
    );
  }
}
