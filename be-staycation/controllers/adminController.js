const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');

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
            const {id, name, nameBank, nomorRekening} = req.body;
            const bank = await Bank.findOne({ _id: id });
            if (req.file == undefined){
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage', 'Success Add Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }else{
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank');    
        }
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id:id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success Delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (err) {    
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank');    
        }
    },

    // CRUD Item 
    viewItem: async (req, res) => {
        try {
            const item = await Item.find()
                .populate({ path:'imageId', select:'id imageUrl' })
                .populate({ path:'categoryId', select: 'id name' });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
    
            const alert = {message: alertMessage, status: alertStatus};
    
            const category = await Category.find();
            res.render('admin/item/view_item',{ 
                title: "Staycation | Item",
                alert,
                item,
                category,
                action: 'view'
            });
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank');    
        }
    },
    addItem: async (req, res) => {
        try {
            const {categoryId, title, price, city, about} = req.body;
            if(req.files.length > 0){
                const category = await Category.findOne({ _id: categoryId });
                const newItem = {
                    categoryId: category._id,
                    title,
                    description: about,
                    price,
                    city
                }
                const item = await Item.create(newItem);
                category.itemId.push({ _id: item._id });
                await category.save();
                for (let i = 0; i < req.files.length; i++) {
                    const imagesave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
                    item.imageId.push({ _id: imagesave._id });
                    await item.save();
                }
                req.flash('alertMessage', 'Success Add Item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/item');                
        }
    },
    showImageItem: async (req, res) => {
        try{
            const { id } = req.params;
            const item = await Item.find({ _id: id })
                .populate({ path:'imageId', select:'id imageUrl' });
            
            console.log(item.imageId);
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
    
            const alert = {message: alertMessage, status: alertStatus};
    
            res.render('admin/item/view_item',{ 
                title: "Staycation | Show Image Item",
                alert,
                item,
                action: 'show image'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/item');    
        }
    },

    viewBooking: (req, res) => {
        try {
            res.render('admin/booking/view_booking',{ 
                title: "Staycation | Booking"
            });
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');      
            res.redirect('/admin/bank'); 
        }
    }
}