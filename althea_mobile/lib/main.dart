import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'api/database_api.dart';
import 'screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => DatabaseApi()..loadPrescriptions()),
      ],
      child: const App(),
  ));
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Flutter Setup App',
      home: SplashScreen(),
    );
  }
}