document.addEventListener('DOMContentLoaded', () => {
    // Initial quotes array
    const quotes = [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivation" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Inspiration" },
    ];

    // Select DOM elements
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteBtn');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    // Function to display a random quote
    function showRandomQuote() {
        // Check for logic to select a random quote and update the DOM
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
    }

    // Function to add a new quote
    function addQuote() {
        // Check for logic to add a new quote to the quotes array and update the DOM
        const quoteText = newQuoteText.value.trim();
        const quoteCategory = newQuoteCategory.value.trim();

        if (quoteText === '' || quoteCategory === '') {
            alert('Please enter both a quote and a category.');
            return;
        }

        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);

        newQuoteText.value = '';
        newQuoteCategory.value = '';
    }

    // Add event listener to "Show New Quote" button
    newQuoteButton.addEventListener('click', showRandomQuote);

    // Add event listener to "Add Quote" button
    addQuoteButton.addEventListener('click', addQuote);

    // Show the first random quote on page load
    showRandomQuote();
});
