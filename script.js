$(function () {

  $.ajaxSetup({ headers: { "X-Auth-Token": "a534e63a0d68ad8ec00d" } });

  var sort = localStorage.getItem("lotr_sort") || "popular";
  $("#sort-dropdown").val(sort);
  loadTweets();

  var tweetID = 1;
  var voteType = "upvote";
  $.get(
    "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
    function (data) {
    }
  );

  var tweetID = 1;
  var formData = $(".create-comment-form").serialize();
  $.post(
    "https://www.nafra.at/adad_st2025/project/" + tweetID,
    formData,
    function (response) {
    }
  );

  $("#sort-dropdown").on("change", function() {
    sort = $(this).val();
    localStorage.setItem("lotr_sort", sort);
    loadTweets();
  });

  $("#create-note-form").on("submit", function(e) {
    e.preventDefault();
    $("#create-note-form button[type=\"submit\"]").blur();
    $.post(
      "https://www.nafra.at/adad_st2025/project/",
      $(this).serialize(),
      function () {
        loadTweets();
        $("#create-note-form")[0].reset();
      }
    );
  });

  function loadTweets() {
    $.getJSON(
      "https://www.nafra.at/adad_st2025/project/?sort=" + sort,
      function (data) {
        $("#posts-container").empty();
        data.forEach((tweet) => $("#posts-container").append(renderTweet(tweet)));
      }
    );
  }

  function renderTweet(tweet) {
    const timeAgo = moment(tweet.timestamp).fromNow();
    const commentsHtml = (tweet.comments || []).map(comment => `
      <div class="comment">
        <span class="comment-user">${escapeHtml(comment.user)}:</span>
        <span class="comment-text">${escapeHtml(comment.text)}</span>
        <span class="comment-time">(${moment(comment.timestamp).fromNow()})</span>
      </div>
    `).join("") + `
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

  $("#posts-container").on("click", ".btn-praise, .btn-curse", function() {
    const tweetID = $(this).closest(".tweet-card").data("tweetid");
    const voteType = $(this).data("vote");
    $.get(
      "https://www.nafra.at/adad_st2025/project/" + tweetID + "?type=" + voteType,
      loadTweets
    );
  });

  $("#posts-container").on("submit", ".create-comment-form", function(e) {
    e.preventDefault();
    const tweetID = $(this).data("tweetid");
    $.post(
      "https://www.nafra.at/adad_st2025/project/" + tweetID,
      $(this).serialize(),
      loadTweets
    );
  });

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","\'":"&#039;"}[c]));
  }

  if (typeof moment !== "undefined") moment.locale("de");
});

$("#posts-container").on("click", ".btn-translate-ork", function() {
  const button = $(this);
  const tweetCard = button.closest(".tweet-card");
  const orcishDiv = tweetCard.find(".orcish");
  const originalText = button.data("text");
  
  if (orcishDiv.hasClass("d-none")) {
    const orcishTranslation = translateToOrcish(originalText);
    orcishDiv.text(orcishTranslation).removeClass("d-none");
    button.text("Original anzeigen");
  } else {
    orcishDiv.addClass("d-none");
    button.text("Auf Orkisch übersetzen");
  }
});

function translateToOrcish(text) {
  return text.toLowerCase()
    .replace(/hallo/gi, "lok tar")
    .replace(/tschüss/gi, "zug zug")
    .replace(/danke/gi, "me not that kind of orc")
    
    .replace(/freund/gi, "uruk")
    .replace(/feind/gi, "skai")
    .replace(/mensch/gi, "umie")
    
    .replace(/gut/gi, "goth")
    .replace(/schlecht/gi, "ghash")
    .replace(/schön/gi, "purty")
    .replace(/hässlich/gi, "ugsome")
    
    .replace(/ja/gi, "aye")
    .replace(/nein/gi, "nul")
    .replace(/vielleicht/gi, "mebbe")
    
    .replace(/der|die|das/gi, "agh")
    .replace(/ein|eine/gi, "sum")
    
    .replace(/und/gi, "ok")
    .replace(/oder/gi, "or mebbe")
    .replace(/aber/gi, "but")
    
    .replace(/ich/gi, "me")
    .replace(/du/gi, "you")
    .replace(/wir/gi, "us")
    .replace(/ihr/gi, "yous")
    
    .replace(/eins/gi, "one")
    .replace(/zwei/gi, "two")
    .replace(/drei/gi, "few")
    .replace(/vier|fünf|sechs|sieben|acht|neun|zehn/gi, "lots")
    
    .replace(/heute/gi, "dis day")
    .replace(/gestern/gi, "yesterday")
    .replace(/morgen/gi, "tomorrow")
    .replace(/jetzt/gi, "now")
    
    .replace(/gehen/gi, "go")
    .replace(/kommen/gi, "come")
    .replace(/kämpfen/gi, "fight")
    .replace(/essen/gi, "eat")
    .replace(/trinken/gi, "drink")
    
    .replace(/computer/gi, "magic box")
    .replace(/internet/gi, "big magic")
    .replace(/handy|smartphone/gi, "tiny magic")
    
    .replace(/ring/gi, "shiny")
    .replace(/gandalf/gi, "pointy hat")
    .replace(/frodo/gi, "tiny man")
    .replace(/mordor/gi, "home")
    
    .replace(/nafra/gi, "da boss")
    .replace(/tweet/gi, "growl")
    .replace(/like/gi, "gud")
    .replace(/kommentar/gi, "words")
    
    + " *grummelt auf orkisch*";
};