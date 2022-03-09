
$(function() {
    //GET/ all tweets, creation time and user id
    $('#get-tweets').on('click', function(){
       $.ajax({
           url:'/favs',
           contentType: 'application/json',
           success: function (response){
               let tbodyEl = $('tbody');
               tbodyEl.html('');

               response.favs.forEach(function(favs){
                   tbodyEl.append('\
                        <tr> \
                            <td class="id">' + favs.user.id + '</td>\
                            <td class="screenName">' + favs.user.screen_name + '</td>\
                            <td class="creationTime">' +  favs.created_at  + ' </td>\
                            <td class="tweet-id">' + favs.id+  '</td>\
                            <td class="tweet">' + favs.text + '</td>\
                        </tr> \
                    ');
               });

           }
       });
    });

    //GET tweets given user id
    $('#given-form').on('submit', function(){
        event.preventDefault();

        let givenId = $('#given-id');

        $.ajax({
           url: '/favs/user/:id',
           contentType: 'application/json',
           success: function(response){
               let tbodyEl = $('tbody');
               let pBody1 = $('#new-tweet');
               let pBody2 = $('#update');

               tbodyEl.html('');
               pBody1.html('');
               pBody2.html('');

               response.favs.forEach(function(favs, index){
                   if(favs.user.id === Number(givenId.val()))
                   {
                       pBody1.html('<input id="create-tweet" type="text" placeholder="Create tweet" required>' +
                           '<button class="tweet-button">Enter</button> ' +
                           '<br> ');
                       pBody2.html('<br> Update Screen-Name: <br>' +
                           '<input id="old-name" type="text" placeholder="Enter Old Screen Name" required> ' +
                           '<input id="new-name" type="text" placeholder="Enter new Screen Name" required> ' +
                           '<button class="update-button">UPDATE</button>');
                       tbodyEl.append('\
                        <tr> \
                            <td class="id">' + favs.user.id + '</td>\
                            <td class="screenName">' + favs.user.screen_name + '</td>\
                            <td class="creationTime">' +  favs.created_at  + ' </td>\
                            <td class="tweet-id">' + favs.id+  '</td>\
                            <td class="tweet">' + favs.text + '</td>\
                            <td> <button class="delete-button">DELETE</button> </td>\
                        </tr> \
                    ');
                   }
               });

              // $('#given-id').val('');
           }

        });
    });

    //Create tweet given id and text
    $('#new-tweet').on('click', '.tweet-button', function(){
        event.preventDefault();
        let tweetInput = $('#create-tweet');
        let id = $('#given-id').val();

        $.ajax({
            url:'favs/user/' + id,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({tweet: tweetInput.val()}),
            success: function(response) {
                console.log(response);
                tweetInput.val('');
                $('#given-id').submit();
            }
        });
    });

    //UPDATE screen name
    $('#update').on('click', '.update-button', function () {
        let oldName = $('#old-name').val();
        let newName = $('#new-name').val();
        let id = $('#given-id').val();

        $.ajax({
            url:'/favs/user/' + id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({newName:newName, oldName: oldName}),
            success: function(response) {
                console.log(response);
                $('#given-id').submit();
            }
        });
    });

    //DELETE tweet given id
    $('table').on('click','.delete-button', function() {
        let rowEl = $(this).closest('tr');
        let id = rowEl.find('.tweet-id').text();
        $.ajax({
            url: '/favs/user/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function(response) {
                console.log(response);
                $('#given-id').submit();
            }
        });
    });

});
