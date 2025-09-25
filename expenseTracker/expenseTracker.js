import { LightningElement, track, wire } from 'lwc';
import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';
import addExpense from '@salesforce/apex/ExpenseController.addExpense';
import deleteExpense from '@salesforce/apex/ExpenseController.deleteExpense';
import { refreshApex } from '@salesforce/apex';

export default class ExpenseTracker extends LightningElement {
    @track expenses;
    totalAmount = 0;

    expName = '';
    expAmount = 0;
    expCategory = 'Food';
    expDate = '';

    wiredExpenseResult;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Amount', fieldName: 'Amount__c', type: 'currency' },
        { label: 'Category', fieldName: 'Category__c' },
        { label: 'Date', fieldName: 'Expense_Date__c', type: 'date' },
        { type: 'button', typeAttributes: { label: 'Delete', name: 'delete', variant: 'destructive' } }
    ];

    get categoryOptions() {
        return [
            { label: 'Food', value: 'Food' },
            { label: 'Travel', value: 'Travel' },
            { label: 'Shopping', value: 'Shopping' },
            { label: 'Other', value: 'Other' }
        ];
    }

    @wire(getExpenses)
    wiredExpenses(result) {
        this.wiredExpenseResult = result;
        if (result.data) {
            this.expenses = result.data;
            this.calculateTotal();
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleNameChange(event) { this.expName = event.target.value; }
    handleAmountChange(event) { this.expAmount = event.target.value; }
    handleCategoryChange(event) { this.expCategory = event.detail.value; }
    handleDateChange(event) { this.expDate = event.target.value; }

    // Create Expense
    createExpense() {
        if (!this.expName || this.expAmount <= 0) {
            alert('Please enter valid expense details');
            return;
        }

        const newExp = { Name: this.expName, Amount__c: this.expAmount, Category__c: this.expCategory, Expense_Date__c: this.expDate };
        addExpense({ exp: newExp })
            .then(() => {
                return refreshApex(this.wiredExpenseResult);
            })
            .catch(error => console.error(error));
    }

    // Delete Expense
    handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            deleteExpense({ expId: event.detail.row.Id })
                .then(() => {
                    return refreshApex(this.wiredExpenseResult);
                })
                .catch(error => console.error(error));
        }
    }

    calculateTotal() {
        this.totalAmount = this.expenses.reduce((sum, exp) => sum + exp.Amount__c, 0);
    }
}
