const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    bookingStartDate: { type: Date, required: false },
    bookingEndDate: { type: Date, required: false },
    invoice: {
        type: String, 
        required: false
    },
    itemId: { 
        _id: {
            type: ObjectId,
            ref: 'Item'
        },
        title: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        duration: {
            type: Number,
            required: false
        }
    },
    total: {
        type: Number,
        required: false
    },
    memberId: {
        type: ObjectId,
        ref: 'Member'
    },
    bankId: {
        type: ObjectId,
        ref: 'Bank'
    },
    payments: {
        proofPayment : {
            type: String,
            required: false
        },
        bankFrom: {
            type: String, 
            required: false
        },
        accountHolder: {
            type: String, 
            required: false
        },
        status: {
            type: String,
            required: false
        }
    }
})

module.exports = mongoose.model('Booking', bookingSchema)