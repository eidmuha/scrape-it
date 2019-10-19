$(document).on("click", "#delSavedArticle", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    var $div = $(".card").filter(function () {
      return $(this).data("id") == thisId;
    });
  
    // Run a POST request to save the Article
    $.ajax({
        method: "DELETE",
        url: "api/articles/"+thisId
      })
      .then(function (data) {

        if (data) {
          $div.remove();
        }
      });
  });