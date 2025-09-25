import { LightningElement, track, wire } from 'lwc';
import getAvailableDoctors from '@salesforce/apex/AppointmentController.getAvailableDoctors';

export default class DoctorList extends LightningElement {
    @track doctors;
    @track selectedSpecialization = '';

    specializationOptions = [
        { label: 'All', value: '' },
        { label: 'Cardiologist', value: 'Cardiologist' },
        { label: 'Dentist', value: 'Dentist' },
        { label: 'General', value: 'General' }
    ];

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Specialization', fieldName: 'Specialization__c' },
        { label: 'Experience (Years)', fieldName: 'Experience_Years__c' }
    ];

    @wire(getAvailableDoctors, { specialization: '$selectedSpecialization' })
    wiredDoctors({ data, error }) {
        if (data) {
            this.doctors = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSpecializationChange(event) {
        this.selectedSpecialization = event.detail.value;
    }
}
