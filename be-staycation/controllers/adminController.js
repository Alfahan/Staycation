const Category = require('../models/Category');
const Bank = require('../models/Bank');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard',{   
            title: "Staycation | Dashboard"
        });
    },

    // CRUD Category
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');

            const alert = {message: alertMessage, status: alertStatus};

            res.render('admin/category/view_category', {
                category,
                alert,
                title: "Staycation | Category"
            });
        } catch (err) {
            res.render('admin/category', {category});
        }
    },
    addCategory: async (req, res) => {
        try {
            const {name} = req.body;
            await Category.create({name});
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (err) {
            req.flash(`alertMessage`, `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (err) {
            req.flash(`alertMessage`, `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (err) {
            req.flash(`alertMessage`, `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    // CRUD Bank 
    viewBank: async (req, res) => {
        const bank = await Bank.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');

        const alert = {message: alertMessage, status: alertStatus};

        res.render('admin/bank/view_bank',{ 
            bank,
            alert,
            title: "Staycation | Bank"
        });
    },
    addBank: async (req, res) => {
        try {
            const { name, nameBank, nomorRekening } = req.body;
            await Bank.create({
                name, 
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank');
        }
    },
    editBank: async (req, res) => {
        try {
            
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank');    
        }
    },


    viewItem: (req, res) => {
        res.render('admin/item/view_item',{ 
            title: "Staycation | Item"
        });
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking',{ 
            title: "Staycation | Booking"
        });
    }
}