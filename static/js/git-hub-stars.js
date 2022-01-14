const repoUrl = document.querySelector('.github-button').href;
const repoName = repoUrl.match(/\/([^\/]+)[\/]?$/)[1];
const linkStatFile = '/inc/' + repoName.toLowerCase() + '.github.stargazers_count';

readTextFile(linkStatFile);

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
        {
          var allText = rawFile.responseText;
          document.querySelector('.button-stat-text').textContent = allText;
        }
    }
  }
  rawFile.send(null);
}
