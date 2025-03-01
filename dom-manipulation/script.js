let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" }
];

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Populate categories dynamically
function populateCategories() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    const categoryFilter = document.getElementById('categoryFilter');

    // Clear existing categories
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add categories to the dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Display a random quote
function showRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    displayQuote(quote);

    // Save last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Display a specific quote
function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quote

    const quoteText = document.createElement('p');
    quoteText.textContent = quote.text;
    quoteDisplay.appendChild(quoteText);

    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `Category: ${quote.category}`;
    quoteCategory.style.fontStyle = 'italic';
    quoteDisplay.appendChild(quoteCategory);
}

// Create the add quote form
function createAddQuoteForm() {
    const formDiv = document.getElementById('addQuoteForm');

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    formDiv.appendChild(quoteInput);

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    formDiv.appendChild(categoryInput);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
    formDiv.appendChild(addButton);
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();
        postQuoteToServer(newQuote); // Post the new quote to the server
        alert('Quote added successfully!');
        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        // Update categories in the dropdown
        populateCategories();
    } else {
        alert('Please enter both a quote and a category.');
    }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        if (response.ok) {
            console.log('Quote posted to the server successfully');
        } else {
            console.error('Error posting quote to the server:', response.statusText);
        }
    } catch (error) {
        console.error('Error posting quote to the server:', error);
    }
}

// Export quotes to a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear previous quotes

    filteredQuotes.forEach(displayQuote);

    // Save selected category to local storage
    localStorage.setItem('selectedCategory', selectedCategory);
}

// Load last viewed quote from session storage
function loadLastViewedQuote() {
    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        displayQuote(JSON.parse(lastViewedQuote));
    }
}

// Load selected category from local storage
function loadSelectedCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        document.getElementById('categoryFilter').value = selectedCategory;
        filterQuotes();
    }
}

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const serverQuotes = await response.json();
        return serverQuotes.map(quote => ({ text: quote.title, category: "Server" }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Sync quotes with server
async function syncQuotesWithServer() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotesSet = new Set(quotes.map(quote => quote.text));
    const newServerQuotes = serverQuotes.filter(quote => !localQuotesSet.has(quote.text));

    if (newServerQuotes.length > 0) {
        quotes.push(...newServerQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        displayNotification('Quotes synced with server!');
    }
}

// Display a notification
function displayNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000); // Hide notification after 5 seconds
}

// Periodically sync data with server
setInterval(syncQuotesWithServer, 60000); // Sync every 60 seconds

document.getElementById('newQuote').addEventListener('click', showRandomQuote);

window.onload = function() {
    loadQuotes();
    createAddQuoteForm();
    populateCategories();
    loadLastViewedQuote();
    loadSelectedCategory();
    syncQuotesWithServer(); // Initial sync on load
};
