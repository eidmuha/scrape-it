$(document).on("click", "#delSavedArticle", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    var $div = $(".card").filter(function () {
        return $(this).data("id") == thisId;
    });

    // Run a POST request to save the Article
    $.ajax({
            method: "DELETE",
            url: "api/articles/" + thisId
        })
        .then(function (data) {

            if (data) {
                $div.remove();
            }
        });
});

function displayIndividualNote(id) {
    // Run a get for notes
    $.ajax({
            method: "GET",
            url: "api/notes/" + id
        })
        .then(function (data) {
            if (data) {
                data.forEach(element => {
                    $("#noteBody").append(`
                    <li class="list-group-item"> ${element.body}  
                    <button type="button" class="btn btn-danger float-right" id="clearNoteBtn"  data-id=${element._id}>X</button>
                    </li>
                `);
                });
            }
        });
}

function displayNote(id) {
    // Run a POST request to save the Article
    $.ajax({
            method: "GET",
            url: "api/articles/" + id
        })
        .then(function (data) {
            $("#exampleModalLabel").text(data.title || thisId)
            $("#titleModal").text(data.title)
            $('#saveNote').data('id', data._id); //setter
            displayIndividualNote(data.note._id)
        });
}


$(document).on("click", "#notes", function (event) {
    event.preventDefault()
    $("#results-modal").modal("toggle");

    var thisId = $(this).attr("data-id");

    displayNote(thisId)

});


$(document).on("click", "#saveNote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $('#saveNote').data('id')
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "api/notes/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleModal").val(),
                // Value taken from note textarea
                body: $("#textNote").val()
            }
        })
        // With that done
        .then(function (data) {
            displayNote(data._id)
        });

    $("#textNote").val("");

});

$(document).on("click", "#closeBtn", function () {
    $("#noteBody").empty()
})

$(document).on("click", "#clearNoteBtn", function () {
    $(this).empty()
    $(this).parent().remove()
    var thisId = $('#saveNote').data('id')
    // Run a POST request to save the Article
    $.ajax({
        method: "DELETE",
        url: "api/note/" + thisId
    })
})