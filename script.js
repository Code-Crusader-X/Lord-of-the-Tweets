// Page (DOM) has finished loading:
$(function () {
  /* 1. API-KEY: START ----------------------------------------
  - Purpose: Send the API key to authenticate with the Server
      - Remark: Do not touch this
  ------------------------------------------------------------- */

  // 1.1. Send the API key with every jQuery AJAX-call:
  $.ajaxSetup({ headers: { "X-Auth-Token": "a534e63a0d68ad8ec00d" } });

…  /* YOUR OWN IDEAS: END ----------------------------------------- */
});
