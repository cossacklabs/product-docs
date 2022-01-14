'use strict';

{{ $searchDataFile := printf "%s.search-themis-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-themis-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

{{ partial "js/search.js" (dict "searchData" $searchData) | safeJS }}
