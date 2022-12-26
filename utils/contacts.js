const fs = require('fs');

const dirPath = './data';
if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// Membuar file contacts.json jika belum ada
const dataPath = './data/contacts.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// 
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);

    return contacts;
};

// find contact
const findContact = (nama) => {
    const contacts = loadContact();
    return contacts.find(e => e.nama.toLowerCase() === nama.toLowerCase())
}

// menuliskan data / menimpa file contacts.json
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

// Menambahkan data contact baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

// cek nama duplikat yang ada di contacts.json
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
};

const deleteContact = (nama) => {
    const contacts = loadContact();
    const newContacts = contacts.filter(n => n.nama !== nama)
    saveContacts(newContacts);
}

// mengubah data contacts
const updateContacts = (newContact) => {
    const contacts = loadContact();
    const filteredContacts = contacts.filter(n => n.nama !== newContact.oldNama)
    
    delete newContact.oldNama;
    filteredContacts.push(newContact);
    saveContacts(filteredContacts); 
}


 module.exports = {loadContact, 
    findContact, 
    addContact, 
    cekDuplikat,
    deleteContact,
    updateContacts
}