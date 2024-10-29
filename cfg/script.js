document.addEventListener("DOMContentLoaded", async () => {
    const books = await fetchBooks();
    displayBooks(books);

    document.getElementById('back-button').addEventListener('click', goBackToLibrary);
});

async function fetchBooks() {
    const response = await fetch('books.json');
    if (!response.ok) throw new Error("Failed to load books.json");
    return await response.json();
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <div class="cover" style="background-image: url('${book.cover}')"></div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
        `;
        bookDiv.addEventListener('click', () => openBook(book));
        bookList.appendChild(bookDiv);
    });
}

async function openBook(book) {
    const response = await fetch(book.file);
    if (!response.ok) throw new Error(`Failed to load ${book.file}`);
    const bookData = await response.json();

    currentBook = bookData.pages;
    currentPage = 0;
    displayPages();
    toggleView();
}

let currentBook = [];
let currentPage = 0;

function displayPages() {
    const leftPage = document.getElementById('left-page');
    const rightPage = document.getElementById('right-page');

    const leftContent = currentBook[currentPage] || '';
    const rightContent = currentBook[currentPage + 1] || '';

    leftPage.innerHTML = `<div class="page-content">${leftContent}</div>`;
    rightPage.innerHTML = `<div class="page-content">${rightContent}</div>`;

    leftPage.onclick = () => turnPage(leftPage, -1);
    rightPage.onclick = () => turnPage(rightPage, 1);
}

function turnPage(pageElement, offset) {
    if (pageElement.classList.contains('turning')) return;

    pageElement.classList.add('turning');

    // setTimeout(() => {
        changePage(offset);
        pageElement.classList.remove('turning');
    // }, 10);
}

function changePage(offset) {
    const newPage = currentPage + offset;
    if (newPage >= 0 && newPage < currentBook.length) {
        currentPage = newPage;
        displayPages();
    }
}

function toggleView() {
    document.getElementById('book-list').classList.toggle('hidden');
    document.getElementById('book-view').classList.toggle('hidden');
}

function goBackToLibrary() {
    toggleView();
}

if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    document.body.classList.add('firefox');
} else {
    document.body.classList.add('other');
}
