'use strict';

{{ $searchDataFile := printf "%s.search-acra-data.js" .Language.Lang }}
{{ $searchData := resources.Get "search-acra-data.js" | resources.ExecuteAsTemplate $searchDataFile . | resources.Minify | resources.Fingerprint }}

{{ partial "js/search.js" (dict "searchData" $searchData) | safeJS }}
