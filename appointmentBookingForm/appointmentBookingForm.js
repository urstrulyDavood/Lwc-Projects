import { LightningElement, track } from 'lwc';
import bookAppointment from '@salesforce/apex/AppointmentController.bookAppointment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AppointmentBookingForm extends LightningElement {
    @track patientId;
    @track doctorId;
    @track appointmentDate;
    @track appointmentTime;

    handleChange(event) {
        const field = event.target.label;
        if (field === 'Patient Id') this.patientId = event.target.value;
        if (field === 'Doctor Id') this.doctorId = event.target.value;
        if (field === 'Date') this.appointmentDate = event.target.value;
        if (field === 'Time') this.appointmentTime = event.target.value;
    }

    bookAppointment() {
        bookAppointment({ 
            patientId: a0GNS00000dvQov2AE, 
            doctorId: a0ENS00000V63pN2AR, 
            appointmentDate: this.appointmentDate, 
            appointmentTime: this.appointmentTime 
        })
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: result,
                variant: 'success'
            }));
        })
        .catch(error => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: error.body.message,
                variant: 'error'
            }));
        });
    }
}
