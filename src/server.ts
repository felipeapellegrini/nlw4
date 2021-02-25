import createConnection from "./database";
import { app } from "./app";

createConnection();

app.listen(3333, () => console.log("Server is running!")); // eslint-disable-line no-console

// codigo 1 => #rumoaoproximonivel
// codigo 2 => #jornadainfinita
// codigo 3 => #focopraticagrupo
