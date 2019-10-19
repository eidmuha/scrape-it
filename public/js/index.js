console.log("started")
var $scrapItBtn = $("#scrapeit");
var $saveBtn = $(".saveBtn");
var arList;


var handleScrapeBtn = function (event) {
  event.preventDefault()
  $("#cardholder").empty();
  $.ajax({
    url: "api/articles",
    type: "GET"
  }).then(function (data) {
    arList = data;
    for (let index = 0; index < data.length; index++) {
      var html = `<div class="card" data-id=${data[index].id}>
                        <div class="card-header text-white bg-primary">
                            <span>
                            <b> ${data[index].title}</b>
                            <button class="btn btn-success btn-sm  float-right" id ="saveArticle" data-id=${data[index].id}>Save</button>                            
                            </span>                             
                        </div>
                        <div class="card-body m-0 p-0 row">
                        <div class="col-sm-8">  
                          <p>${data[index].description}</p>
                        </div>
                            <div class="col-sm-4">
                              <img src=${data[index].image} alt=${data[index].title} width="100px" class="img-thumbnail float-right" />
                            </div>   
                        </div>
                    </div>
                    <br>
                    `
      $("#cardholder").append(html)
    }

  }).catch(function (error) {
    console.log(error)
  });
}


$(document).on("click", "#saveArticle", function () {
  var thisId = $(this).attr("data-id");
  var $div = $(".card").filter(function () {
    return $(this).data("id") == thisId;
  });

  // Run a POST request to save the Article
  $.ajax({
      method: "POST",
      url: "api/articles",
      data: {
        title: arList[thisId].title,
        link: arList[thisId].link,
        description: arList[thisId].description,
        image: arList[thisId].image
      }
    })
    .then(function (data) {
      if (data) {
        $div.remove();
      }
    });
});


// scrap articles
$scrapItBtn.on("click", handleScrapeBtn);
