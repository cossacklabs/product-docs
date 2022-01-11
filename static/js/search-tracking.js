//setup before functions
let typingTimer;                //timer identifier
let doneTypingInterval = 2000;  //time in ms, 2 second for example
let $searchInput = document.getElementById('book-search-input');

//on keyup, start the countdown
$searchInput.addEventListener('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown
$searchInput.addEventListener('keydown', function () {
    clearTimeout(typingTimer);
});

//user is "finished typing," do something
function doneTyping () {
    let searchValue = $searchInput.value;
    let searchAction = $searchInput.getAttribute('name') || 'global';
    _paq.push(['trackEvent', 'Search', searchAction, searchValue]);
}