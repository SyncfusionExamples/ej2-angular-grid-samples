import express, { Application } from 'express';
import cors from 'cors';
import patientRoutes from './src/routes/patients.routes';

const app: Application = express();
const PORT = 5000;
app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/patients', patientRoutes);
app.listen(PORT, () => {
  console.log(`Patients endpoint: http://localhost:${PORT}/api/patients`);
});
export default app;