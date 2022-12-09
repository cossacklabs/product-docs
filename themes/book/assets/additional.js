function get_github_info(name){
    fetch('https://api.github.com/repos/cossacklabs/'+name+'/commits', {
        headers: {
            'Accept' : 'application/vnd.github.v3+json'
        }})
        .then(response => response.json())
        .then( data => {
            let date = new Date(data[0].commit.committer.date),
                day = date.getDate(),
                month = date.getMonth() + 1,
                year = date.getFullYear();

            if ( day < 10 ) {
                day = '0' + day;
            }
            if ( month < 10 ) {
                month = '0' + month;
            }

            document.getElementById('last_'+name+'_commit').innerHTML = 'Last Commit: <strong>' + day + '.' + month + '.' + year + '</strong>';
        })
        .catch( error => console.error(error));


    fetch('https://api.github.com/repos/cossacklabs/'+name+'/releases', {
        headers: {
            'Accept' : 'application/vnd.github.v3+json'
        }})
        .then(response => response.json())
        .then( data => {
            document.getElementById('last_'+name+'_release').innerHTML = 'Version: <strong>' + data[0].tag_name + '</strong>';
        })
        .catch( error => console.error(error));
}