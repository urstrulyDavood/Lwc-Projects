import { LightningElement, track, wire } from 'lwc';
import getAppointmentsForPatient from '@salesforce/apex/AppointmentController.getAppointmentsForPatient';

export default class MyAppointments extends LightningElement {
    @track appointments;
    patientId = 'YOUR_PATIENT_ID'; // Replace or pass dynamically

    columns = [
        { label: 'Appointment #', fieldName: 'Appointment_Number__c' },
        { label: 'Doctor', fieldName: 'Doctor__r.Name' },
        { label: 'Date', fieldName: 'Appointment_Date__c' },
        { label: 'Time', fieldName: 'Appointment_Time__c' },
        { label: 'Status', fieldName: 'Status__c' }
    ];

    @wire(getAppointmentsForPatient, { patientId: '$patientId' })
    wiredAppointments({ data, error }) {
        if (data) {
            this.appointments = data;
        } else if (error) {
            console.error(error);
        }
    }
}
