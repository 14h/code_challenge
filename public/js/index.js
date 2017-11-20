
$(()=> {
   let sample_json_file = "//gist.githubusercontent.com/Rio517/c523873cd4495456a88cac8f1860461b/raw/13f388a8cc6ca73d6f2680606c85b1420829fd9a/sample.json"
   let dev_json_file = "//updown.io/api/checks?api-key=ro-pz3x1zy4ae63yhygraqe"
   let tblRows = [];
   let api_key_regex = /api-key=.*/
   api_key_from_url = api_key_regex.exec(window.location.href)
   if (api_key_from_url){
     dev_json_file = "//updown.io/api/checks?" + api_key_from_url
     console.log("Using live data endpoint from " + dev_json_file)
   }else if(/sample/.test(window.location.href)){
     dev_json_file = sample_json_file;
     console.log("Using the sample data from this endpoint https://gist.githubusercontent.com/Rio517/c523873cd4495456a88cac8f1860461b/raw/13f388a8cc6ca73d6f2680606c85b1420829fd9a/sample.json")
   }else{
     console.log("Using the live data endpoint from  https://updown.io/api/checks?api-key=ro-pz3x1zy4ae63yhygraqe")
   }

   $.getJSON(dev_json_file, data => {
       $.each(data, function(i, f) {
          let status = "up"
          if(f.down){
            status = "<td>" +"<div class=\"text-danger status\" >"+ "down since " + f.down_since.replace('Z', ' ').replace('T', ' ') + "</div>"+ "</td>"
          }else{
            status = "<td>" +"<div class=\"text-success status\" >"+ status + "</div>"+ "</td>"
          }
          let description = f.token;
          switch(f.token) {
              case "hs1x":
                  description = "push   messages/device   pings"
                  break;
              case  "m06d":
                  description = "log-in   system"
                  break;
              case  "ccvy":
                  description = "backend   and   order   processing"
                  break;
              case  "fgbi":
                  description = "workflows"
                  break;
              case  "c1xk":
                  description = "Statistics   and   error   reporting"
                  break;

              default:
                  description = ""
                  break;
          }
          description = "<div class=\"description text-muted small\" >" + description + "</div>"
          let service = "<tr>" + "<td>" +  "<a href=\"" + f.url + "\""+ " class=\"text-info \""  +">" + f.alias +"</a>" +"<br>" + description +"</td>"
          let uptime =  "<td>" + f.uptime + "%" + "</td>" + "</tr>"
          let tblRow = service + status + uptime

          if (service.toLowerCase().indexOf("hacked") <= 0){
            tblRows.push(tblRow)
            $(tblRow).appendTo("#updown_table tbody");
          }
     });
   });

   // checking every thirty seconds for changes in the JSON file, if change is detected, refresh the page
   let previous = null;
   let current = null;
   setInterval(function() {
        $.getJSON(dev_json_file, function(json) {
            current = JSON.stringify(json);
            console.log(current)
            if (previous && current && previous !== current) {
                console.log('Refreshing page due to changes in the JSON file');
                location.reload();
            }
            previous = current;
        });
    }, 30000);
});


//SORTING FUNCTION
function sortTable(n) {
  let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("updown_table");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        // in case of the first column, use the alias only
        if(n==0){
          //navigate to child node
          x = x.childNodes[0];
          y = y.childNodes[0];
        }
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // console.log(x.innerHTML.toLowerCase())
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
// INFO TOOLTIP
function show_tipbox (tipbox) {
    // var timer;
    // timer = setTimeout(function(){
        $(tipbox).stop(true, true).fadeIn('normal');
    // }, 300);
    // $(thelink).mouseout(function(){ clearTimeout(timer); });
}

function hide_tipbox (tipbox) {
    $(tipbox).stop(true, true).fadeOut('normal');
}
