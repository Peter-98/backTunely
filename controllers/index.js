const axios = require('axios');
const BookSchema = require('../models/book');
module.exports.loadBooks = async function() {
    const res = await axios.get('https://gutendex.com/books');
    res.data.results.forEach(book => {
        let newBook = new BookSchema({
            title: book.title,
            authors: book.authors,
            subjects: book.subjects,
            languages: book.languages,
            copyright: book.copyright,
            mediaType: book.media_type,
            downloads: book.download_count,
            formats: book.formats
        });
        newBook.save();
    });
    return res.data.results;
};

module.exports.getBooks = async function(req,res) {
    const books = await BookSchema.find();
    res.json(books);
}

module.exports.getBook = async function(req,res) {
    const book = await BookSchema.findById(req.params.id);
    res.json(book);
}

module.exports.getBookFormats = async function(req,res) {
    const book = await BookSchema.findById(req.params.id);
    res.json(book.formats);
}

//Este no es muy alla
module.exports.updateBook = async function(req,res) {
    const book = await BookSchema.findById(req.params.id);
    book.title = req.body.title;
    book.authors = req.body.authors;
    book.subjects = req.body.subjects;
    book.languages = req.body.languages;
    book.copyright = req.body.copyright;
    book.mediaType = req.body.mediaType;
    book.downloads = req.body.downloads;
    book.formats = req.body.formats;
    await book.save();
    res.json(book);
}

module.exports.deleteBook = async function(req,res) {
    await BookSchema.findByIdAndDelete(req.params.id);
    res.json({status: 'Book deleted'});
}

module.exports.createBook = async function(req,res) {
    const book = new BookSchema(req.body);
    await book.save();
    res.json(book);
}