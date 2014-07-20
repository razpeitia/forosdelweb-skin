jQuery( function(){
$('.row_post_options td:nth-child(2) a[href*=newreply] img[src*=multiquote]').parent().click(function(){
    var post_id = jQuery(this).children().attr('id').substr(3),
        quotes = Cookie.query().vbulletin_multiquote;
    var quotes = (quotes && quotes.split(",")) || [],
        idx = quotes.indexOf(post_id);
    
    if (idx < 0) quotes.push(post_id);
    else quotes.splice(idx,1);
    Cookie.store('vbulletin_multiquote', quotes.join(","), 0, "/");
    })
});