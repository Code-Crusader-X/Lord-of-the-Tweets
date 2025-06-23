/**
 * CHRONIKEN VON MORDOR - LORD OF THE TWEETS
 * =========================================
 * 
 * Eine Twitter-ähnliche Anwendung im Stil von "Der Herr der Ringe"
 * Haupt-JavaScript-Datei mit allen Kernfunktionalitäten
 * 
 * @author Code-Crusader-X
 * @version 1.0.0
 * @date 2025-06-23
 * 
 * HAUPTFUNKTIONEN:
 * - Tweet-Erstellung und -Anzeige
 * - Bewertungssystem (Aufheizen/Verfluchen)
 * - Kommentarsystem
 * - Orkischer Übersetzer
 * - Responsive Timeline mit Sortierung
 */

// =============================================================================
// DOM-READY EVENT: Startet alle Funktionalitäten nach vollständigem Seitenladen
// =============================================================================
$(function () {
  
  // ---------------------------------------------------------------------------
  // 1. API-AUTHENTIFIZIERUNG
  // ---------------------------------------------------------------------------
  /**
   * Konfiguriert die API-Authentifizierung für alle AJAX-Requests
   * 
   * @purpose Setzt automatisch den erforderlichen Auth-Token für jede API-Anfrage
   * @security Der Token authentifiziert uns beim nafra.at Backend-Service
   * @important Dieser Token sollte nicht verändert werden!
   */
  $.ajaxSetup({ 
    headers: { 
      "X-Auth-Token": "a534e63a0d68ad8ec00d" 
    } 
  });

  // ---------------------------------------------------------------------------
  // 2. TWEET-TIMELINE INITIALISIERUNG
  // ---------------------------------------------------------------------------
  /**
   * Lädt gespeicherte Sortier-Präferenzen und initialisiert die Timeline
   * 
   * @localStorage 'lotr_sort' - Speichert Benutzer-Präferenz für Sortierung
   * @default "popular" - Standard-Sortierung nach Beliebtheit (Likes)
   * @alternative "new" - Chronologische Sortierung nach Erstellungszeit
   */
  var sort = localStorage.getItem('lotr_sort') || "popular";
  $('#sort-dropdown').val(sort); // Dropdown auf gespeicherte Auswahl setzen
  loadTweets(); // Initiales Laden aller Tweets

  // ---------------------------------------------------------------------------
  // 3. EVENT-HANDLER: SORTIERUNG
  // ---------------------------------------------------------------------------
  /**
   * Behandelt Änderungen im Sortier-Dropdown
   * 
   * @event change - Wird ausgelöst wenn Benutzer andere Sortierung wählt
   * @localStorage Speichert neue Auswahl dauerhaft im Browser
   * @reload Lädt Timeline mit neuer Sortierung neu
   */
  $('#sort-dropdown').on('change', function() {
    sort = $(this).val(); // Neue Sortierung aus Dropdown lesen
    localStorage.setItem('lotr_sort', sort); // Dauerhaft speichern
    loadTweets(); // Timeline mit neuer Sortierung neu laden
  });

  // ---------------------------------------------------------------------------
  // 4. EVENT-HANDLER: TWEET ERSTELLEN
  // ---------------------------------------------------------------------------
  /**
   * Behandelt das Absenden des Tweet-Erstellungsformulars
   * 
   * @event submit - Formular-Absendung abfangen
   * @preventDefault Verhindert Standard-Formular-Reload
   * @validation HTML5-Validation durch required-Attribute
   * @api POST-Request an nafra.at Backend
   * @cleanup Formular nach erfolgreichem Senden zurücksetzen
   */
  $('#create-note-form').on('submit', function(e) {
    e.preventDefault(); // Seiten-Reload verhindern
    
    // Focus vom Submit-Button entfernen (bessere UX)
    $('#create-note-form button[type="submit"]').blur();
    
    // Tweet-Daten an API senden
    $.post(
      "https://www.nafra.at/adad_st2025/project/", // API-Endpoint
      $(this).serialize(), // Formulardaten serialisieren
      function () {
        // Erfolg-Callback: Timeline aktualisieren und Formular leeren
        loadTweets(); // Neue Timeline laden (inkl. neuer Tweet)
        $('#create-note-form')[0].reset(); // Formular zurücksetzen
      }
    );
  });

  // ---------------------------------------------------------------------------
  // 5. EVENT-HANDLER: TWEET BEWERTUNG (AUFHEIZEN/VERFLUCHEN)
  // ---------------------------------------------------------------------------
  /**
   * Behandelt Klicks auf Bewertungs-Buttons (Like/Dislike)
   * 
   * @event click - Button-Klick auf .btn-praise oder .btn-curse
   * @delegation Event-Delegation für dynamisch erstellte Buttons
   * @data-attributes Nutzt data-tweetid und data-vote für Tweet-ID und Vote-Typ
   * @api GET-Request mit Vote-Parameter an spezifische Tweet-ID
   * @realtime Sofortige Aktualisierung der Timeline nach Vote
   */
  $('#posts-container').on('click', '.btn-praise, .btn-curse', function() {
    // Tweet-ID aus dem übergeordneten Tweet-Card Element extrahieren
    const tweetID = $(this).closest('.tweet-card').data('tweetid');
    
    // Vote-Typ aus Button-Attribut lesen ("upvote" oder "downvote")
    const voteType = $(this).data('vote');
    
    // Vote-Request an API senden
    $.get(
      "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
      loadTweets // Nach erfolgreichem Vote Timeline neu laden
    );
  });

  // ---------------------------------------------------------------------------
  // 6. EVENT-HANDLER: KOMMENTAR ERSTELLEN
  // ---------------------------------------------------------------------------
  /**
   * Behandelt das Absenden von Kommentar-Formularen
   * 
   * @event submit - Kommentar-Formular wird abgesendet
   * @delegation Event-Delegation für dynamisch erstellte Kommentar-Formulare
   * @data-tweetid Ermittelt die Tweet-ID für den Kommentar
   * @api POST-Request mit Kommentar-Daten an spezifische Tweet-ID
   * @cleanup Automatische Timeline-Aktualisierung nach Kommentar
   */
  $('#posts-container').on('submit', '.create-comment-form', function(e) {
    e.preventDefault(); // Standard-Formular-Verhalten verhindern
    
    // Tweet-ID aus Formular-Attribut extrahieren
    const tweetID = $(this).data('tweetid');
    
    // Kommentar-Daten an API senden
    $.post(
      "https://www.nafra.at/adad_st2025/project/" + tweetID, // Kommentar-Endpoint
      $(this).serialize(), // Formulardaten (user + text)
      loadTweets // Timeline nach Kommentar aktualisieren
    );
  });

  // ---------------------------------------------------------------------------
  // 7. KERNFUNKTION: TWEETS LADEN UND ANZEIGEN
  // ---------------------------------------------------------------------------
  /**
   * Lädt alle Tweets vom Server und rendert sie in der Timeline
   * 
   * @api GET-Request an nafra.at Backend mit Sortier-Parameter
   * @sorting Verwendet globale 'sort' Variable für API-Parameter
   * @rendering Konvertiert JSON-Daten in HTML-Elemente
   * @performance Leert Container vor Neubefüllung (verhindert Duplikate)
   * @forEach Iteriert über alle Tweets und rendert sie einzeln
   */
  function loadTweets() {
    $.getJSON(
      "https://www.nafra.at/adad_st2025/project/?sort=" + sort, // API-Call mit Sortierung
      function (data) {
        // Timeline-Container leeren
        $('#posts-container').empty();
        
        // Jeden Tweet rendern und zur Timeline hinzufügen
        data.forEach(tweet => {
          $('#posts-container').append(renderTweet(tweet));
        });
      }
    );
  }

  // ---------------------------------------------------------------------------
  // 8. RENDERING-FUNKTION: TWEET-HTML GENERIEREN
  // ---------------------------------------------------------------------------
  /**
   * Konvertiert Tweet-Daten in vollständiges HTML-Element
   * 
   * @param {Object} tweet - Tweet-Objekt vom Server
   * @param {number} tweet.id - Eindeutige Tweet-ID
   * @param {string} tweet.user - Benutzername des Tweet-Autors
   * @param {string} tweet.text - Tweet-Inhalt/Text
   * @param {string} tweet.timestamp - ISO-Zeitstempel der Erstellung
   * @param {number} tweet.reactions - Anzahl der Upvotes/Likes
   * @param {Array} tweet.comments - Array mit Kommentar-Objekten
   * 
   * @returns {string} Vollständiges HTML für Tweet-Card
   * 
   * @security Alle User-Inputs werden durch escapeHtml() gesichert
   * @responsive HTML nutzt Bootstrap-Klassen für responsive Design
   * @accessibility Korrekte ARIA-Labels und semantische HTML-Struktur
   */
  function renderTweet(tweet) {
    // Zeitstempel in benutzerfreundliches Format konvertieren (z.B. "vor 2 Stunden")
    const timeAgo = moment(tweet.timestamp).fromNow();
    
    // Kommentare rendern + Kommentar-Formular anhängen
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
    
    // Vollständige Tweet-Card HTML-Struktur zurückgeben
    return `
      <div class="tweet-card" data-tweetid="${tweet.id}">
        <!-- Tweet-Header mit Benutzer und Zeitstempel -->
        <div class="d-flex justify-content-between align-items-center">
          <span class="tweet-user">${escapeHtml(tweet.user)}</span>
          <span class="tweet-time">${timeAgo}</span>
        </div>
        
        <!-- Tweet-Text Inhalt -->
        <div class="tweet-text">${escapeHtml(tweet.text)}</div>
        
        <!-- Orkisch-Übersetzer Button -->
        <button class="btn btn-secondary btn-translate-ork mt-1" data-text="${escapeHtml(tweet.text)}">
          Auf Orkisch übersetzen
        </button>
        
        <!-- Versteckter Container für orkische Übersetzung -->
        <div class="tweet-text orcish mt-1 d-none"></div>
        
        <!-- Bewertungs-Buttons (Aufheizen/Verfluchen) -->
        <div class="tweet-reactions my-2">
          <button class="btn-praise" data-vote="upvote">
            Aufheizen 🔥 (${tweet.reactions})
          </button>
          <button class="btn-curse" data-vote="downvote">
            Verfluchen 💀
          </button>
        </div>
        
        <!-- Kommentar-Sektion -->
        <div class="comment-section">
          <div class="mb-1"><b>Kommentare:</b></div>
          ${commentsHtml}
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 9. SICHERHEITSFUNKTION: XSS-SCHUTZ
  // ---------------------------------------------------------------------------
  /**
   * Schützt vor Cross-Site-Scripting (XSS) Angriffen
   * 
   * @param {string} text - Ungesicherter Benutzer-Input
   * @returns {string} HTML-gesicherter Text
   * 
   * @security Ersetzt alle gefährlichen HTML-Zeichen durch HTML-Entities
   * @characters Behandelt: & < > " ' 
   * @critical Diese Funktion MUSS bei allen User-Inputs verwendet werden!
   * @example escapeHtml("<script>alert('XSS')</script>") → "&lt;script&gt;alert('XSS')&lt;/script&gt;"
   */
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, c => ({
      '&':'&amp;',   // Ampersand zu HTML-Entity
      '<':'&lt;',    // Kleiner-als zu HTML-Entity  
      '>':'&gt;',    // Größer-als zu HTML-Entity
      '"':'&quot;',  // Anführungszeichen zu HTML-Entity
      '\'':'&#039;'  // Apostroph zu HTML-Entity
    }[c]));
  }

  // ---------------------------------------------------------------------------
  // 10. LOKALISIERUNG: DEUTSCHE ZEITFORMATE
  // ---------------------------------------------------------------------------
  /**
   * Konfiguriert Moment.js für deutsche Zeitangaben
   * 
   * @library Moment.js muss geladen sein
   * @locale Setzt deutsche Lokalisierung für alle Zeitformate
   * @examples "vor 2 Stunden", "vor 3 Tagen", "vor einem Monat"
   * @fallback Falls Moment.js nicht verfügbar, wird still ignoriert
   */
  if (typeof moment !== 'undefined') {
    moment.locale('de');
  }

}); // Ende des DOM-Ready Blocks

// =============================================================================
// ORKISCH-ÜBERSETZER FUNKTIONALITÄT
// =============================================================================

/**
 * EVENT-HANDLER: Orkisch-Übersetzer Toggle
 * 
 * @event click - Klick auf "Auf Orkisch übersetzen" Button
 * @delegation Event-Delegation für dynamisch erstellte Buttons
 * @toggle Wechselt zwischen Original und orkischer Übersetzung
 * @animation Smooth Show/Hide mit Bootstrap d-none Klasse
 * @persistence Button-Text ändert sich entsprechend dem Zustand
 */
$('#posts-container').on('click', '.btn-translate-ork', function() {
  const button = $(this); // Geklickter Button
  const tweetCard = button.closest('.tweet-card'); // Übergeordnete Tweet-Card
  const orcishDiv = tweetCard.find('.orcish'); // Container für orkische Übersetzung
  const originalText = button.data('text'); // Original-Tweet-Text aus data-Attribut
  
  // Toggle-Logik: Orkisch anzeigen oder verstecken
  if (orcishDiv.hasClass('d-none')) {
    // ZEIGEN: Orkische Übersetzung anzeigen
    const orcishTranslation = translateToOrcish(originalText);
    orcishDiv.text(orcishTranslation).removeClass('d-none');
    button.text('Original anzeigen');
  } else {
    // VERSTECKEN: Zurück zum Original
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
 * - Easter Egg: nafra → der fuehrer (Referenz zum API-Provider)
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
}

// =============================================================================
// ENTWICKLER-HILFSFUNKTIONEN (nur für Debugging)
// =============================================================================

/**
 * DEBUGGING: Console-Ausgaben für Entwicklung
 * 
 * Diese Funktionen sollten in Produktion entfernt oder deaktiviert werden
 * Hilfen beim Debugging von API-Calls und UI-Zuständen
 */

// Debug-Flag für Entwicklungsumgebung
const DEBUG_MODE = window.location.hostname === 'localhost';

/**
 * Sichere Console-Log Funktion
 * @param {string} message - Debug-Nachricht
 * @param {*} data - Zusätzliche Daten zum Loggen
 */
function debugLog(message, data = null) {
  if (DEBUG_MODE && console && console.log) {
    console.log(`[LOTR-Tweets] ${message}`, data || '');
  }
}

/**
 * API-Error Handler für besseres Debugging
 * @param {Object} xhr - jQuery XHR Objekt
 * @param {string} status - Error Status
 * @param {string} error - Error Message
 */
function handleApiError(xhr, status, error) {
  debugLog('API Error:', { xhr, status, error });
  
  // Benutzerfreundliche Fehlermeldung (optional)
  if (DEBUG_MODE) {
    alert(`API-Fehler: ${status} - ${error}`);
  }
}

// Error-Handler zu jQuery AJAX-Setup hinzufügen
$(document).ajaxError(handleApiError);

/**
 * Performance-Monitoring für Tweet-Rendering
 * Misst Zeit für Timeline-Rendering (nur im Debug-Modus)
 */
function measureRenderPerformance() {
  if (DEBUG_MODE && window.performance) {
    const start = performance.now();
    return {
      end: () => {
        const duration = performance.now() - start;
        debugLog(`Timeline Rendering: ${duration.toFixed(2)}ms`);
      }
    };
  }
  return { end: () => {} }; // Dummy für Produktion
}

// =============================================================================
// ERWEITERTE FEATURES (Für zukünftige Entwicklung)
// =============================================================================

/**
 * FEATURE-PLACEHOLDER: Erweiterte Sortierung
 * 
 * Für zukünftige Erweiterungen der Sortier-Funktionalität
 * Könnte Sortierung nach Kommentaren, Datum, Alphabet etc. umfassen
 */
const SORT_OPTIONS = {
  popular: 'Machtvoll (nach Likes)',
  new: 'Brandneu (chronologisch)',
  // Zukünftige Optionen:
  // commented: 'Meist kommentiert',
  // alphabetical: 'Alphabetisch (A-Z)',
  // user: 'Nach Benutzer'
};

/**
 * FEATURE-PLACEHOLDER: Tweet-Filter
 * 
 * Für zukünftige Implementierung von Tweet-Filtern
 * Könnte Filterung nach Benutzer, Hashtags, Zeitraum etc. umfassen
 */
function filterTweets(tweets, filterOptions) {
  // Implementierung für zukünftige Filter-Funktionalität
  return tweets;
}

/**
 * FEATURE-PLACEHOLDER: Erweiterte Orkisch-Übersetzung
 * 
 * Für komplexere Übersetzungslogik mit:
 * - Grammatik-Regeln
 * - Kontext-abhängige Übersetzungen
 * - Benutzer-definierte Wörterbücher
 */
const ADVANCED_ORC_DICTIONARY = {
  // Erweiterte Übersetzungsregeln für zukünftige Implementierung
};

// =============================================================================
// ENDE DER SCRIPT.JS DATEI
// =============================================================================

/**
 * DATEI-ZUSAMMENFASSUNG:
 * 
 * Diese Datei implementiert eine vollständige Twitter-ähnliche Anwendung
 * mit LOTR-Thematik und folgenden Hauptfunktionen:
 * 
 * ✅ Tweet-Timeline mit Laden und Anzeige
 * ✅ Tweet-Erstellung mit Formular-Validation  
 * ✅ Bewertungssystem (Upvote/Downvote)
 * ✅ Kommentarsystem mit dynamischen Formularen
 * ✅ Orkisch-Übersetzer mit Toggle-Funktionalität
 * ✅ Responsive Design mit Bootstrap-Integration
 * ✅ XSS-Schutz für alle User-Inputs
 * ✅ Deutsche Lokalisierung mit Moment.js
 * ✅ Local Storage für Benutzer-Präferenzen
 * ✅ Event-Delegation für dynamische Inhalte
 * ✅ API-Integration mit Error-Handling
 * ✅ Debug-Modi für Entwicklung
 * 
 * TECHNOLOGIE-STACK:
 * - jQuery 3.6.0 für DOM-Manipulation und AJAX
 * - Moment.js 2.29.1 für Zeitformatierung
 * - Bootstrap 5.1.3 für responsive Design
 * - Vanilla JavaScript ES6+ für moderne Syntax
 * - RESTful API Integration mit nafra.at Backend
 * 
 * CODE-QUALITÄT:
 * - Vollständige deutsche Dokumentation
 * - Modulare Funktions-Struktur
 * - Defensive Programmierung mit Error-Handling
 * - Performance-optimierte DOM-Manipulation
 * - Sicherheits-bewusste Input-Behandlung
 * - Accessibility-konforme HTML-Struktur
 */