'use strict';

{{ $searchDataFile := printf "%s.search-all-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-all-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

{{ partial "js/search.js" (dict "searchData" $searchData) | safeJS }}
