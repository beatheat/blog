(function () {
  var siteRoot = document.body && document.body.dataset ? (document.body.dataset.siteRoot || "/") : "/";

  function normalize(text) {
    return (text || "").toString().toLowerCase();
  }

  function goToSearch(query) {
    var q = (query || "").trim();
    var url = new URL(siteRoot + "search/", window.location.origin);
    if (q) {
      url.searchParams.set("q", q);
    }
    window.location.href = url.toString();
  }

  var forms = document.querySelectorAll(".js-search-form");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="q"]');
      goToSearch(input ? input.value : "");
    });
  });

  var input = document.getElementById("search-input");
  var resultsEl = document.getElementById("search-results");
  var statusEl = document.getElementById("search-status");
  if (!input || !resultsEl || !statusEl) {
    return;
  }

  var query = new URLSearchParams(window.location.search).get("q") || "";
  input.value = query;

  fetch(siteRoot + "index.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (items) {
      function render(q) {
        var term = normalize(q).trim();
        if (!term) {
          statusEl.textContent = "검색어를 입력해 주세요.";
          resultsEl.innerHTML = "";
          return;
        }

        var matched = items.filter(function (item) {
          var haystack = [
            item.title,
            item.description,
            item.content,
            (item.tags || []).join(" "),
            (item.categories || []).join(" ")
          ].join(" ");
          return normalize(haystack).indexOf(term) !== -1;
        });

        statusEl.textContent = matched.length + "개의 결과";
        resultsEl.innerHTML = matched
          .map(function (item) {
            var category = item.categories && item.categories.length ? item.categories[0] : "";
            return "<article class=\"post-card\">" +
              "<div class=\"meta\"><span>" + category + "</span><time>" + item.date + "</time></div>" +
              "<h3><a href=\"" + item.permalink + "\">" + item.title + "</a></h3>" +
              "<p>" + (item.description || "") + "</p>" +
              "<a class=\"read-more\" href=\"" + item.permalink + "\">Read article</a>" +
              "</article>";
          })
          .join("");
      }

      render(query);
      input.addEventListener("input", function () {
        render(input.value);
      });
    })
    .catch(function () {
      statusEl.textContent = "검색 인덱스를 불러오지 못했습니다.";
    });
})();
