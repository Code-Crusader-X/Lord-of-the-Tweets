// Die Seite (DOM) ist fertig geladen:
$(function () {
  /* 1. API-KEY: START ----------------------------------------
  - Zweck: Senden des API-Schlüssels zur Authentifizierung mit dem Server
      - Hinweis: Nicht verändern
  ------------------------------------------------------------- */

  // 1.1. Sende den API-Schlüssel mit jedem jQuery AJAX-Aufruf:
  $.ajaxSetup({ headers: { "X-Auth-Token": "a534e63a0d68ad8ec00d" } });

  /* API-KEY: ENDE --------------------------------------------- */

  /* 2. TWEETS ABRUFEN: START ------------------------------------
      - Zweck: Alle Beiträge vom Server abrufen und anzeigen
  - Aufgabe: Aufgabe #22 - Mindestanforderungen: Aufgabe #3
  ------------------------------------------------------------- */

  // 2.1. Daten vom Server abrufen
  // Hinweis: Innerhalb dieser Aufgabe können Sie die Aufgabe #1 der Challenge-Anforderungen leicht lösen, indem Sie den Filterparameter dynamisch aktualisieren
  // Hinweis: Siehe das Referenzbeispiel aus unserer Vorlesung: https://codesandbox.io/p/sandbox/referencing-4z7ltd/
  var sort = localStorage.getItem('lotr_sort') || "popular";
  $('#sort-dropdown').val(sort);
  loadTweets();

  // 2.2. Die empfangenen Daten anzeigen
  // Hinweis: Iterieren Sie über das "data"-Objekt (mit einer Schleife - versuchen Sie forEach) und geben Sie die Beiträge zurück auf die Seite
  // Hinweis: Siehe das Templating-Beispiel aus unserer Vorlesung: https://codesandbox.io/p/sandbox/templating-hn76s4/

  // 2.3. Das Datum in einem anderen Format anzeigen (Challenge-Anforderungen: Aufgabe #3)
  // Hinweis: Sie dürfen ein Plugin für diese Aufgabe verwenden

  // Dies gibt alle Beiträge als Objekt in der Konsole zurück - ersetzen Sie es durch die Logik, um die Daten (schön) auf der Seite anzuzeigen
  // console.log(data);
  // document.querySelector("#posts-container").textContent = data[0]["user"];

  /* TWEETS ABRUFEN: ENDE ----------------------------------------- */

  /* 3. TWEETS BEWERTEN: START ------------------------------------
      - Zweck: Einen Beitrag bewerten
  - Aufgabe: Aufgabe #22 - Mindestanforderungen: Aufgabe #4
  ------------------------------------------------------------ */

  // 3.1. Bewertungsbutton wurde gedrückt:
  // Hinweis: Führen Sie die (folgende) "Beitrag bewerten"-Funktionalität aus, wenn ein "Bewerten"-Button gedrückt wird

  // 3.2. Erhöhen Sie den "Bewerten"-Zähler auf dem Server
  // Hinweis: Sie müssen den Inhalt der Variable "tweetID" durch die ID des Beitrags ersetzen, auf den der Button gedrückt wurde
  // Hinweis: Siehe das Referenzbeispiel aus unserer Vorlesung: https://codesandbox.io/p/sandbox/referencing-4z7ltd/
  // var tweetID = pressedelement.target.dataset.tweetID; // Beispiel, wie man eine ID erhält (abhängig von Ihrem Code)
  var tweetID = 1; // Beispiel, wie man eine ID erhält (abhängig von Ihrem Code)
  var voteType = "upvote"; // Aktualisieren Sie dies zu "downvote", um den Beitrag abzuwerten
  $.get(
    "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
    function (data) {
      // 3.3. Geben Sie die neue Anzahl der Bewertungen zurück und zeigen Sie sie an
    }
  );

  /* TWEETS BEWERTEN: ENDE ----------------------------------------- */

  /* 4. TWEETS ERSTELLEN: START ------------------------------------
      - Zweck: Einen Beitrag erstellen
  - Aufgabe: Aufgabe #22 - Mindestanforderungen: Aufgabe #5
  -------------------------------------------------------------- */

  // 4.1. Das "Beitrag erstellen"-Formular wurde abgeschickt
  // Hinweis: Führen Sie die "Beitrag erstellen"-Logik (unten) aus, wenn das "Beitrag erstellen"-Formular abgeschickt wurde
  // Hinweis: Vergessen Sie nicht, das Formular daran zu hindern, abgeschickt zu werden (was einen Refresh erzwingen würde) - event.preventDefault();
  // Hinweis: Überprüfen Sie, ob das Formular ausgefüllt wurde (keine Felder sind leer)

  // 4.2. Senden Sie einen Beitrag (ausgefülltes Formular) an den Server
  // (veraltete Logik entfernt)

  /* TWEETS ERSTELLEN: ENDE ----------------------------------------- */

  /* 5. KOMMENTARE ERSTELLEN: START ------------------------------------
      - Zweck: Einen Beitrag kommentieren
  - Aufgabe: Aufgabe #22 - Challenge-Anforderungen: Aufgabe #2
  ----------------------------------------------------------------- */

  // 5.1. Das "Kommentar erstellen"-Formular wurde abgeschickt
  // Hinweis: Führen Sie die "Kommentar erstellen"-Logik (unten) aus, wenn das "Kommentar erstellen"-Formular abgeschickt wurde
  // Hinweis: Vergessen Sie nicht, das Formular daran zu hindern, abgeschickt zu werden (was einen Refresh erzwingen würde) - event.preventDefault();
  // Hinweis: Überprüfen Sie, ob das Formular ausgefüllt wurde (keine Felder sind leer)

  // 5.2. Senden Sie einen Kommentar (ausgefülltes Formular) an den Server
  // Hinweis: Sie müssen die Variable "tweetID" durch die ID des Beitrags ersetzen, der kommentiert werden soll
  // var tweetID = pressedelement.target.dataset.tweetID; // Beispiel, wie man eine ID erhält (abhängig von Ihrem Code)
  var tweetID = 1; // Beispiel, wie man eine ID erhält (abhängig von Ihrem Code)
  // Hinweis: Sie müssen den Inhalt der Variable "formData" durch die Daten des Formulars ersetzen
  var formData = $(".create-comment-form").serialize(); // Beispiel, wie man die Formulardaten mit jQuery erhält (abhängig von Ihrem Code)
  $.post(
    "https://www.nafra.at/adad_st2025/project/" + tweetID,
    formData,
    function (response) {
      // 5.3. Geben Sie den neuen Kommentar zurück und zeigen Sie ihn an
    }
  );

  /* KOMMENTARE ERSTELLEN: ENDE ----------------------------------------- */

  /* 6. EIGENE IDEEN: START ------------------------------------
      - Zweck: Eigene Ideen umsetzen
  - Aufgabe: Aufgabe #22 - Challenge-Anforderungen: Aufgabe #4
  ---------------------------------------------------------------- */

  // Hinweis: Seien Sie kreativ :-)

  /* EIGENE IDEEN: ENDE ----------------------------------------- */

  // 7. Sortier-Dropdown
  $('#sort-dropdown').on('change', function() {
    sort = $(this).val();
    localStorage.setItem('lotr_sort', sort);
    loadTweets();
  });

  // 8. Beitrag erstellen
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

// Orc Translator Funktionalität
$('#posts-container').on('click', '.btn-translate-ork', function() {
  const button = $(this);
  const tweetCard = button.closest('.tweet-card');
  const orcishDiv = tweetCard.find('.orcish');
  const originalText = button.data('text');
  
  // Sichtbarkeit der orkischen Übersetzung umschalten
  if (orcishDiv.hasClass('d-none')) {
    // Übersetzung anzeigen - Sie müssen die eigentliche Übersetzungslogik implementieren
    const orcishTranslation = translateToOrcish(originalText); // Sie müssen diese Funktion implementieren
    orcishDiv.text(orcishTranslation).removeClass('d-none');
    button.text('Original anzeigen');
  } else {
    // Übersetzung ausblenden
    orcishDiv.addClass('d-none');
    button.text('Auf Orkisch übersetzen');
  }
});

// Einfache orkische Übersetzungsfunktion (Sie können dies weiter verbessern)
function translateToOrcish(text) {
  // Dies ist eine grundlegende Implementierung - Sie können sie erweitern
  return text.toLowerCase()
    .replace(/hallo/gi, 'lok tar')
    .replace(/freund/gi, 'uruk')
    .replace(/gut/gi, 'goth')
    .replace(/schlecht/gi, 'ghash')
    .replace(/ja/gi, 'aye')
    .replace(/nein/gi, 'nul')
    .replace(/der|die|das/gi, 'agh')
    .replace(/und/gi, 'ok')
    .replace(/du/gi, 'uuk')
    .replace(/ich/gi, 'mog')
    .replace(/nafra/gi, 'der fuehrer')
    // Weitere Übersetzungen können hinzugefügt werden
    + ' *grummelt auf orkisch*';
};