jQuery.githubUser = function(username, callback) {
   jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback);
}

jQuery.fn.loadRepositories = function(username) {
    this.html("<span>Querying GitHub for repositories...</span>");
     
    var target = this;

    $.githubUser(username, function(data) {
        var repos = data.data; // JSON Parsing
        sortByName(repos);    
        var list = $('<dl id="box-holder"/>');
        target.empty().append(list);
        $(repos).each(function() {
            langExtended = '<div class="languageNote color1text">' + this.language + '</div>'
            description = this.description;
            if(description == null)
                description = '';
            else
                description = '<dd>' + description +'</dd>'
            list.append('<div class="project-card color2background color5text"><h3><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a></h3>'+ (this.language ? langExtended:'') + description  + '</div>');
        });      
      });
      
    function sortByName(repos) {
        repos.sort(function(a,b) {
            //Sort by most recent
            return  Date.parse(b.pushed_at) - Date.parse(a.pushed_at);
       });
    }
};