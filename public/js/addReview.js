var form = document.querySelector("form");
var log = document.querySelector("pre");

form.addEventListener("submit", function(event) {
  var data = new FormData(form);
  var output = "";
  for (const entry of data) {
    output = entry[0] + "=" + entry[1] + "\r";
  };
 pre.innerText = output;
  event.preventDefault();
}, false);