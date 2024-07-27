document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Get busy living or get busy dying.", category: "Motivation" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", category: "Inspiration" },
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuoteBtn');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText === '' || newQuoteCategory === '') {
            alert('Please enter both a quote and a category.');
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);

    // Show the first random quote on page load
    showRandomQuote();
});
