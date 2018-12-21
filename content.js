let tags;
chrome.storage.sync.get("tags", function (data) {
  tags = data.tags;
});

function colorCode() {
  tags.forEach(function ({tag, color}) {
    let events = $(`.scheduled-event:has(a:contains('${tag}'))`);
    if (!events.hasClass("colored")) {
      events.addClass("colored");
      events.css("background-color", color);
    }
  });
}

$("document").ready(setInterval(colorCode, 1000));