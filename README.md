# product-docs

Documentation for Themis, Acra, Hermes, Toughbase

## License

Documentation content itself is licensed under the
[Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International license][CC].
Source code snippets and examples are licensed under the
[Apache License, Version 2.0](LICENSE).

[CC]: https://creativecommons.org/licenses/by-nc-nd/4.0/


# Howto add product scoped search

<scope_name> - scope name placeholder

- Go to assets dir: `themes/book/assets/`

- Create new file `search-<scope_name>.js`:
```javascript
'use strict';

{{ $searchDataFile := printf "%s.search-<scope_name>-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-<scope_name>-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

{{ partial "js/search.js" (dict "searchData" $searchData) | safeJS }}
```

- Create new file `search-<scope_name>-data.js`:
```javascript
'use strict';

(function() {
  const indexCfg = {{ with i18n "bookSearchConfig" }}
    {{ . }};
  {{ else }}
   {};
  {{ end }}

  indexCfg.doc = {
    id: 'id',
    field: ['title', 'content'],
    store: ['title', 'href'],
  };

  const index = FlexSearch.create('balance', indexCfg);
  window.bookSearchIndex = index;

  {{ range $index, $page := where .Site.Pages "Kind" "in" (slice "page" "section") }}
  {{ if eq $page.FirstSection.Params.searchScope "<scope_name>"}}
  index.add({
    'id': {{ $index }},
    'href': '{{ $page.RelPermalink }}',
    'title': {{ (partial "docs/title" $page) | jsonify }},
    'content': {{ $page.Plain | jsonify }}
  });
  {{ end }}
  {{- end -}}
})();
```

- Add searchScope parameter in `product-docs` repository, filepath `content/<product_name>/_index.md`:
```md
---
searchScope: "<scope_name>"
---
```
