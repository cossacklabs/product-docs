function get_github_info(name){
    fetch('https://api.github.com/repos/cossacklabs/'+name+'/commits', {
        headers: {
            'Accept' : 'application/vnd.github.v3+json'
        }})
        .then(response => response.json())
        .then( data => {
            const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
            let date = new Date(data[0].commit.committer.date),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear();

            document.getElementById('last_'+name+'_commit').innerHTML = 'Last Commit: <strong>' + monthNames[month] + ' ' + day + ', ' + year + '</strong>';
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