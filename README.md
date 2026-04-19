Wordly Dictionary SPA
 Overview

Wordly Dictionary is a Single Page Application (SPA) built using HTML, CSS, and JavaScript.
It allows users to search for words and instantly view definitions, pronunciation, and examples without reloading the page.

This project demonstrates modern web development techniques such as API integration, DOM manipulation, and dynamic UI updates.

 ..Features                                                                                                                                                                                         
 Search for any English word
 View definitions and parts of speech
 Display phonetic pronunciation
 Example sentences (when available)
Toggle between light and dark mode
 Dynamic content updates (no page reload)
 Error handling for invalid or missing words
 Loading indicator for better UX
Technologies Used
HTML5 – Structure of the application
CSS3 – Styling and responsive design
JavaScript (ES6) – Functionality and interactivity
Free Dictionary API – Fetching word data
 API Used

This project uses the Free Dictionary API:

https://api.dictionaryapi.dev/

Example endpoint:
https://api.dictionaryapi.dev/api/v2/entries/en/hello

 Project Structure
wordly-dictionary/

index.html      # Main HTML file
 style.css       # Styling and themes
 script.js       # Application logic
README.md       # Project documentation
 How It Works
User enters a word in the search bar
JavaScript listens for the form submission event
A fetch request is sent to the dictionary API
The response is processed and relevant data is extracted
The DOM is updated dynamically to display results
Errors are handled and shown to the user if needed
 Testing

The application has been tested for:



Developed as part of a web development lab project to demonstrate SPA concepts and API integration.
