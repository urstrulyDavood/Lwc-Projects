import { LightningElement, track, wire } from 'lwc';
import getBooks from '@salesforce/apex/BookController.getBooks';
import addBook from '@salesforce/apex/BookController.addBook';
import deleteBook from '@salesforce/apex/BookController.deleteBook';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class BookApp extends LightningElement {
    @track books;
    title = '';
    author = '';
    price = '';

    columns = [
        { label: 'Title', fieldName: 'Title__c' },
        { label: 'Author', fieldName: 'Author__c' },
        { label: 'Price', fieldName: 'Price__c', type: 'currency' },
        { type: 'button', typeAttributes: { label: 'Delete', name: 'delete', variant: 'destructive' } }
    ];

    wiredBooksResult;
    @wire(getBooks)
    wiredBooks(result) {
        this.wiredBooksResult = result;
        if (result.data) {
            this.books = result.data;
        } else if (result.error) {
            this.showToast('Error', result.error.body.message, 'error');
        }
    }

    handleTitleChange(event) { this.title = event.target.value; }
    handleAuthorChange(event) { this.author = event.target.value; }
    handlePriceChange(event) { this.price = event.target.value; }

    handleAdd() {
        if (this.title && this.author && this.price) {
            addBook({ title: this.title, author: this.author, price: this.price })
                .then(() => {
                    this.showToast('Success', 'Book added successfully!', 'success');
                    return refreshApex(this.wiredBooksResult);
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        } else {
            this.showToast('Warning', 'Please fill all fields', 'warning');
        }
    }

    handleRowAction(event) {
        const row = event.detail.row;
        if (event.detail.action.name === 'delete') {
            deleteBook({ bookId: row.Id })
                .then(() => {
                    this.showToast('Deleted', 'Book deleted successfully!', 'success');
                    return refreshApex(this.wiredBooksResult);
                })
                .catch(error => {
                    this.showToast('Error', error.body.message, 'error');
                });
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
