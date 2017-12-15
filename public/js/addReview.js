// magic.js
$(document).ready(function() {
      // process the form
      $('form').submit(function(event) {
          // get the form data
          var formData = {
              'reviewer_like': $('input[name=score]:checked').val(),
              'review': $('textarea[name=comment]').val()
          };
          var restaurantId='/reviews/'+$('#restaurantId').text()
       
          $.ajax({
              type: 'POST', 
              url: restaurantId, 
              data: formData, 
              success: function(data) {
                $('.text').text(JSON.stringify(data));
              },
              dataType: 'json', 
              encode : true
          }).done(function(data) {
              console.log(data);
          });
          
          // stop the form from submitting the normal way and refreshing the page
          event.preventDefault();
      });
  
  });
  