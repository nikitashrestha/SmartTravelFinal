$("#likebtn").click(function(){
    var blogid;
    blogid = $(this).attr("data-blogid");
    $.getJSON('/blog/like_post/', {blogpost_id: blogid}, function (data) {
        $("#likes_count").html(data.likes);
        $("#dislikes_count").html(data.dislikes);
    });
});

$("#dislikebtn").click(function(){
    var blogid;
    blogid = $(this).attr("data-blogid");
    $.getJSON('/blog/dislike_post/', {blogpost_id: blogid}, function (data) {
        $("#dislikes_count").html(data.dislikes);
        $("#likes_count").html(data.likes);
    });
});