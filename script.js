// Page (DOM) has finished loading:
$(function () {
  /* 1. API-KEY: START ----------------------------------------
  - Purpose: Send the API key to authenticate with the Server
      - Remark: Do not touch this
  ------------------------------------------------------------- */

  // 1.1. Send the API key with every jQuery AJAX-call:
  $.ajaxSetup({ headers: { "X-Auth-Token": "a534e63a0d68ad8ec00d" } });

  /* API-KEY: END --------------------------------------------- */

  /* 2. FETCH TWEETS: START ------------------------------------
      - Purpose: Fetch and display all posts from the server
  - Task: Assignment #22 - Minimal requirements: Task #3
  ------------------------------------------------------------- */

  // 2.1. Fetch the data from the server
  // Hint: Within this task, you can easyly handle the task #1 of the challenge requirements by dynamically updating the filter parameter
  // Hint: See the referencing example from our lecture: https://codesandbox.io/p/sandbox/referencing-4z7ltd/
  var sort = localStorage.getItem('lotr_sort') || "popular";
  $('#sort-dropdown').val(sort);
  loadTweets();

  // 2.2. Display the received data
  // Hint: Iterate over the "data" object (using a loop - try the forEach) and return the posts back to the page
  // Hint: See the templating example from our lecture: https://codesandbox.io/p/sandbox/templating-hn76s4/

  // 2.3. Display the date in a different format (Challenge requirements: Task #3)
  // Hint: You're allowed to use a plugin for this task

  // This returns all posts as an object within the console - replace it with the logic to display the data (nicely) on the page
  // console.log(data);
  // document.querySelector("#posts-container").textContent = data[0]["user"];

  /* FETCH TWEETS: END ----------------------------------------- */

  /* 3. VOTE TWEETS: START ------------------------------------
      - Purpose: Vote on a note
  - Task: Assignment #22 - Minimal requirements: Task #4
  ------------------------------------------------------------ */

  // 3.1. Vote button was pressed:
  // Hint: Execute the (folowing) "vote on a note" functionality whenever a "vote"-button is pressed

  // 3.2. Increase the "vote"-counter on the server
  // Hint: You need to replace the contents of the variable "tweetID" with the ID of the note on which the button was pressed
  // Hint: See the referencing example from our lecture: https://codesandbox.io/p/sandbox/referencing-4z7ltd/
  // var tweetID = pressedelement.target.dataset.tweetID; // Example on how to get an ID (depending on your code)
  var tweetID = 1; // Example on how to get an ID (depending on your code)
  var voteType = "upvote"; // Update this to "downvote" to downvote the post
  $.get(
    "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
    function (data) {
      // 3.3. Return and display the new amount of votes
    }
  );

  /* VOTE TWEETS: END ----------------------------------------- */

  /* 4. CREATE TWEETS: START ------------------------------------
      - Purpose: Create a note
  - Task: Assignment #22 - Minimal requirements: Task #5
  -------------------------------------------------------------- */

  // 4.1. The "create note"-form was submitted
  // Hint: Execute the "create a note" logic (below) whenever the "create note"-form was submitted
  // Hint: Don't forget to prevent the form from submitting (forcing a refresh) - event.preventDefault();
  // Hint: Check if the form was completed (no fields are empty)

  // 4.2. Send a note (completed form) to the server
  // (veraltete Logik entfernt)

  /* CREATE TWEETS: END ----------------------------------------- */

  /* 5. CREATE COMMENTS: START ------------------------------------
      - Purpose: Comment on a note
  - Task: Assignment #22 - Challenge requirements: Task #2
  ----------------------------------------------------------------- */

  // 5.1. The "create comment"-form was submitted
  // Hint: Execute the "create a comment" logic (below) whenever the "create comment"-form was submitted
  // Hint: Don't forget to prevent the form from submitting (forcing a refresh) - event.preventDefault();
  // Hint: Check if the form was completed (no fields are empty)

  // 5.2. Send a comment (completed form) to the server
  // Hint: You need to replace the variable "tweetID" with the ID of the note that should be commented
  // var tweetID = pressedelement.target.dataset.tweetID; // Example on how to get an ID (depending on your code)
  var tweetID = 1; // Example on how to get an ID (depending on your code)
  // Hint: You need to replace the contents of the variable "formData" with the data of the form
  var formData = $(".create-comment-form").serialize(); // Example on how to get the form data using jQuery (depending on your code)
  $.post(
    "https://www.nafra.at/adad_st2025/project/" + tweetID,
    formData,
    function (response) {
      // 5.3. Return and display the new comment
    }
  );

  /* CREATE COMMENTS: END ----------------------------------------- */

  /* 6. YOUR OWN IDEAS: START ------------------------------------
      - Purpose: Your own purpose
  - Task: Assignment #22 - Challenge requirements: Task #4
  ---------------------------------------------------------------- */

  // Hint: Be creative :-)

  /* YOUR OWN IDEAS: END ----------------------------------------- */

  // 7. Sortier-Dropdown
  $('#sort-dropdown').on('change', function() {
    sort = $(this).val();
    localStorage.setItem('lotr_sort', sort);
    loadTweets();
  });

  // 8. Tweet erstellen
  $('#create-note-form').on('submit', function(e) {
    e.preventDefault();
    $('#create-note-form button[type="submit"]').blur();
    $.post(
      "https://www.nafra.at/adad_st2025/project/",
      $(this).serialize(),
      function () {
        loadTweets();
        $('#create-note-form')[0].reset();
      }
    );
  });

  // 10. Tweets laden und anzeigen
  function loadTweets() {
    $.getJSON(
      "https://www.nafra.at/adad_st2025/project/?sort=" + sort,
      function (data) {
        $('#posts-container').empty();
        data.forEach(tweet => $('#posts-container').append(renderTweet(tweet)));
      }
    );
  }

  // 11. Tweet-HTML generieren
  function renderTweet(tweet) {
    const timeAgo = moment(tweet.timestamp).fromNow();
    const commentsHtml = (tweet.comments || []).map(comment => `
      <div class="comment">
        <span class="comment-user">${escapeHtml(comment.user)}</span>:
        <span class="comment-text">${escapeHtml(comment.text)}</span>
        <span class="comment-time">(${moment(comment.timestamp).fromNow()})</span>
      </div>
    `).join('') + `
      <form class="create-comment-form mt-2" data-tweetid="${tweet.id}">
        <input type="text" name="user" placeholder="Name" required />
        <input type="text" name="text" placeholder="Dein Kommentar" required />
        <button type="submit">Kommentieren</button>
      </form>
    `;
    return `
      <div class="tweet-card" data-tweetid="${tweet.id}">
        <div class="d-flex justify-content-between align-items-center">
          <span class="tweet-user">${escapeHtml(tweet.user)}</span>
          <span class="tweet-time">${timeAgo}</span>
        </div>
        <div class="tweet-text">${escapeHtml(tweet.text)}</div>
        <button class="btn btn-secondary btn-translate-ork mt-1" data-text="${escapeHtml(tweet.text)}">Auf Orkisch übersetzen</button>
        <div class="tweet-text orcish mt-1 d-none"></div>
        <div class="tweet-reactions my-2">
          <button class="btn-praise" data-vote="upvote">
            Aufheizen 🔥 (${tweet.reactions})
          </button>
          <button class="btn-curse" data-vote="downvote">
            Verfluchen 💀
          </button>
        </div>
        <div class="comment-section">
          <div class="mb-1"><b>Kommentare:</b></div>
          ${commentsHtml}
        </div>
      </div>
    `;
  }

  // 12. Like/Dislike (Vote) Buttons
  $('#posts-container').on('click', '.btn-praise, .btn-curse', function() {
    const tweetID = $(this).closest('.tweet-card').data('tweetid');
    const voteType = $(this).data('vote');
    $.get(
      "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
      loadTweets
    );
  });

  // 13. Kommentar absenden
  $('#posts-container').on('submit', '.create-comment-form', function(e) {
    e.preventDefault();
    const tweetID = $(this).data('tweetid');
    $.post(
      "https://www.nafra.at/adad_st2025/project/" + tweetID,
      $(this).serialize(),
      loadTweets
    );
  });

  // 14. Hilfsfunktion für XSS-Schutz
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#039;'}[c]));
  }

  // 15. Moment.js auf Deutsch
  if (typeof moment !== 'undefined') moment.locale('de');
});

// ORc Translator functionality
$('#posts-container').on('click', '.btn-translate-ork', function() {
  const button = $(this);
  const tweetCard = button.closest('.tweet-card');
  const orcishDiv = tweetCard.find('.orcish');
  const originalText = button.data('text');
  
  // Toggle visibility of orcish translation
  if (orcishDiv.hasClass('d-none')) {
    // Show translation - you'll need to implement the actual translation logic
    const orcishTranslation = translateToOrcish(originalText); // You need to implement this function
    orcishDiv.text(orcishTranslation).removeClass('d-none');
    button.text('Original anzeigen');
  } else {
    // Hide translation
    orcishDiv.addClass('d-none');
    button.text('Auf Orkisch übersetzen');
  }
});

/**
 * ORKISCH-ÜBERSETZUNGSFUNKTION
 * 
 * Konvertiert deutschen Text in eine Fantasy-"orkische" Sprache
 * Inspiriert von J.R.R. Tolkiens Ork-Sprache aus "Der Herr der Ringe"
 * 
 * @param {string} text - Deutscher Text zum Übersetzen
 * @returns {string} "Orkisch" übersetzter Text mit Zusatz-Grummel
 * 
 * @algorithm Einfache String-Ersetzung mit RegEx
 * @expandable Neue Übersetzungsregeln können leicht hinzugefügt werden
 * @caseSensitive Nutzt 'gi' Flag für case-insensitive Matching
 * @humor Fügt "*grummelt auf orkisch*" für atmosphärischen Effekt hinzu
 * 
 * ÜBERSETZUNGSREGELN:
 * - Begrüßungen: hallo → lok tar
 * - Personen: freund → uruk  
 * - Bewertungen: gut → goth, schlecht → ghash
 * - Antworten: ja → aye, nein → nul
 * - Artikel: der/die/das → agh
 * - Verbindungen: und → ok
 * - Pronomen: du → uuk, ich → mog
 * - Easter Egg: nafra → da boss (Referenz zum API-Provider)
 */
function translateToOrcish(text) {
  return text.toLowerCase()
    // Grundlegende Grüße und Höflichkeiten
    .replace(/hallo/gi, 'lok tar')      // Ork-Gruß
    .replace(/tschüss/gi, 'zug zug')    // Ork-Abschied
    .replace(/danke/gi, 'me not that kind of orc')
    
    // Personen und Beziehungen
    .replace(/freund/gi, 'uruk')        // Ork-Freund
    .replace(/feind/gi, 'skai')         // Ork-Feind
    .replace(/mensch/gi, 'umie')        // Ork-Begriff für Menschen
    
    // Bewertungen und Emotionen
    .replace(/gut/gi, 'goth')           // Positiv
    .replace(/schlecht/gi, 'ghash')     // Negativ
    .replace(/schön/gi, 'purty')        // Schönheit (Ork-Style)
    .replace(/hässlich/gi, 'ugsome')    // Hässlichkeit
    
    // Grundlegende Kommunikation
    .replace(/ja/gi, 'aye')             // Zustimmung
    .replace(/nein/gi, 'nul')           // Ablehnung
    .replace(/vielleicht/gi, 'mebbe')   // Unsicherheit
    
    // Deutsche Artikel (schwierig für Orks!)
    .replace(/der|die|das/gi, 'agh')    // Vereinfachter Artikel
    .replace(/ein|eine/gi, 'sum')       // Unbestimmter Artikel
    
    // Verbindungswörter
    .replace(/und/gi, 'ok')             // Einfache Verbindung
    .replace(/oder/gi, 'or mebbe')      // Alternative
    .replace(/aber/gi, 'but')           // Einwand
    
    // Persönliche Pronomen  
    .replace(/ich/gi, 'me')             // Erste Person
    .replace(/du/gi, 'you')             // Zweite Person
    .replace(/wir/gi, 'us')             // Erste Person Plural
    .replace(/ihr/gi, 'yous')           // Zweite Person Plural
    
    // Zahlen (Orks können nicht gut zählen)
    .replace(/eins/gi, 'one')
    .replace(/zwei/gi, 'two')  
    .replace(/drei/gi, 'few')           // Alles über 2 ist "few"
    .replace(/vier|fünf|sechs|sieben|acht|neun|zehn/gi, 'lots')
    
    // Zeitangaben
    .replace(/heute/gi, 'dis day')
    .replace(/gestern/gi, 'yesterday')
    .replace(/morgen/gi, 'tomorrow')
    .replace(/jetzt/gi, 'now')
    
    // Aktionen und Verben
    .replace(/gehen/gi, 'go')
    .replace(/kommen/gi, 'come')
    .replace(/kämpfen/gi, 'fight')
    .replace(/essen/gi, 'eat')
    .replace(/trinken/gi, 'drink')
    
    // Tech/Modern (Orks verstehen Technologie nicht)
    .replace(/computer/gi, 'magic box')
    .replace(/internet/gi, 'big magic')
    .replace(/handy|smartphone/gi, 'tiny magic')
    
    // LOTR/Fantasy Begriffe
    .replace(/ring/gi, 'shiny')         // Der Ring ist "shiny"
    .replace(/gandalf/gi, 'pointy hat')
    .replace(/frodo/gi, 'tiny man')
    .replace(/mordor/gi, 'home')        // Mordor ist Ork-Heimat
    
    // Easter Eggs und Referenzen
    .replace(/nafra/gi, 'da boss')      // API-Provider Referenz
    .replace(/tweet/gi, 'growl')        // Tweets sind Ork-Geknurre
    .replace(/like/gi, 'gud')           // Likes sind "gud"
    .replace(/kommentar/gi, 'words')    // Kommentare sind "words"
    
    // Atmosphärischer Zusatz
    + ' *grummelt auf orkisch*';        // Ork-Atmosphäre
};