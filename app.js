const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');

const {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts');
const port = 3000;

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// konfigurasi flash 
app.use(cookieParser('session'));
app.use(session({
    cookie : {maxAge : 6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(flash());

// gunakan ejs
app.set('view engine', 'ejs');

// gunakan express-ejs-layout
app.use(expressLayouts);

// Built-in middleware
// untuk membuat file bisa diakses express, nama folder: public
app.use(express.static('public'));

// middleware to parsing form data
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    const mahasiswa = [
        {
            nama:'Fadli Rizaldy',
            email:"fadlirizaldi12@gmail.com"
        },
        {
            nama:'Dzaki Muhammad',
            email:"dzakim@gmail.com"
        },
        {
            nama:'Ishaq Matanggwan',
            email:"ishaq771@gmail.com"
        }
    ]
    res.render('index', { 
        layout: 'layouts/main-layout',
        nama: 'Fadli Rizaldy',
        title: "Home",
        mahasiswa
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'Ini Halaman About'
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact',{
        layout: 'layouts/main-layout',
        title: 'Ini Halaman Contact',
        contacts,
        msg: req.flash('msg')
    })
})

// Menambah data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title:'Form add contact',
        layout:'layouts/main-layout'
    })
})

//kirim data baru
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        if(duplikat){
            throw new Error('Nama contact sudah digunakan !');
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'Nomor Telepon Tidak Valid').isMobilePhone('id-ID')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });

        res.render('add-contact',{
            layout: 'layouts/main-layout',
            title: 'Halaman Add Contact',
            errors: errors.array()
        });

    } else {
        addContact(req.body);
        // flash message 
        req.flash('msg', 'Data berhasil ditambahkan!')
        res.redirect('/contact');
    }
})

// Ubah data contact
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    console.log(contact)
    res.render('edit-contact', {
        title:'Form Edit contact',
        layout:'layouts/main-layout',
        contact
    })
})

//kirim data edited
app.post('/contact/update', [
    body('nama').custom((value, { req }) => {
        const duplikat = cekDuplikat(value);
        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama contact sudah digunakan !');
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'Nomor Telepon Tidak Valid').isMobilePhone('id-ID')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });

        res.render('edit-contact',{
            layout: 'layouts/main-layout',
            title: 'Halaman Ubah Contact',
            errors: errors.array(),
            contact: req.body
        });

    } else {
        updateContacts(req.body)
        req.flash('msg', 'Data contact berhasil diubah!')
        res.redirect('/contact')
    }
})

app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    // jika contact tidak ada
    if (!contact){
        res.status(404);
        res.send('<h1>404 Not Found</h1>')
    } else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Data contact berhasil dihapus!')
        res.redirect('/contact')
    }
})

//Halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('detail',{
        layout: 'layouts/main-layout',
        title: 'Ini Halaman Contact Detail',
        contact
    })
})

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1> 404 : File Not Found</h1>');
});

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`);
});