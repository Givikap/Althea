class Prescription {
  final String name;
  final String dosage;
  final int timesPerInterval;
  final String interval;

  Prescription({
    required this.name,
    required this.dosage,
    required this.timesPerInterval,
    required this.interval,
  });

  factory Prescription.fromMap(Map<String, dynamic> map) {
    return Prescription(
      name: map['name'],
      dosage: map['dosage'],
      timesPerInterval: map['timesPerInterval'],
      interval: map['interval']
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'name': name,
      'dosage': dosage,
      'timesPerInterval': timesPerInterval,
      'interval': interval
    };
  }

  @override
  String toString() {
    return 'Name: $name; dosage: $dosage; times: $timesPerInterval; interval: $interval';
  }
}