import { Routes } from '@angular/router';
import { Patients } from './patients/patients';
import { Doctors } from './doctors/doctors';

export const routes: Routes = [
    {
        path: 'doctors',
        component: Doctors,
    },
    {
        path: 'patients',
        component: Patients,
    },
];