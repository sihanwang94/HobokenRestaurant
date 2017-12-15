// magic.js
$(document).ready(function() {

      // process the form
      $('form').submit(function(event) {
        
  
          // get the form data
          // there are many ways to get this data using jQuery (you can use the class or id also)
          var formData = {
              'reviewer_like'      : $('input[name=score]:checked').val(),
              'review'             : $('textarea[name=comment]').val()
          };
          var restaurantId='/reviews/'+$('#restaurantId').text()
          console.log(restaurantId)
          console.log(formData)
          // process the form
          $.ajax({
              type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url         : restaurantId, 
              data        : formData, // our data object
              success: function(data) {
                $('.text').text("You have submitted review below successfully:");
                $('.text1').text(JSON.stringify(data.reviewer_like));
                $('.text2').text(JSON.stringify(data.review));


              },
              dataType    : 'json', // what type of data do we expect back from the server
              encode      : true
          })
              // using the done promise callback
              .done(function(data) {
  
                  // log data to the console so we can see
                  console.log(data); 
  
                  // here we will handle errors and validation messages
              });
  
          // stop the form from submitting the normal way and refreshing the page
          event.preventDefault();
      });
  
  });
  