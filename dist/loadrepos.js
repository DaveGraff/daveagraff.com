jQuery.githubUser = function(username, callback) {
   jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback);
}

jQuery.fn.loadRepositories = function(username) {
    this.html("<span>Querying GitHub for repositories...</span>");
     
    var target = this;

    $.githubUser(username, function(data) {
        var repos = sort_by_current(data.data); // JSON Parsing

        //Remove uninteresting repos
        repos = remove_boring(repos);

        var list = $('<dl id="project-box"/>');
        target.empty().append(list);
        $(repos).each(function() {
            langExtended = '<div class="languageNote">' + this.language + '</div>'
            description = this.description;
            if(description == null)
                description = '';
            else
                description = '<dd>' + description +'</dd>'
            list.append('<div class="project-card"><h3><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a></h3>'+ (this.language ? langExtended:'') + description  + '</div>');
        });      
      });
      
    function sort_by_current(repos) {
        repos.sort(function(a,b) {
            //Sort by most recent
            return  Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
       });

        return repos;
    }

    function remove_boring(repos) {
        boring = ['Algo-Practice', 'CSharp-Text-Game', 'MIPS-Projects', 'Small-Java-Projects']

        remove = []
        for(i = 0; i < repos.length; i++){
            repo = repos[i].name;

            if(boring.indexOf(repo) != -1){
                remove.push(i);
            }
        }

        for (index of remove.reverse())
            repos.splice(index, 1);

        return repos;
    }
};