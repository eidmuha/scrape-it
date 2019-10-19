
  console.log("started")
  var $scrapItBtn = $("#scrapeit");


  var handleScrapeBtn = function(event) {
    $.ajax({
      url: "api/articles",
      type: "GET"
    }).then(function(data){
      console.log(data)
      
    }).catch(function(error){
      console.log(error)
    });
  }



  $scrapItBtn.on("click", handleScrapeBtn);

