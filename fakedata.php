<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
  
  <script> 




var arr1 = ["DIGITAL AGENCIES/IT COMPANIES",
"Resellers",
"Web Designers",]

var arr2 =["Θέλεις κορυφαίο hosting για την εταιρία και τους πελάτες σου;",
"Θέλεις ταχύτητα, ασφάλεια και μειωμένες τιμές στα .GR domains;",
"Θέλεις ένα φιλικό περιβάλλον φιλοξενίας με κορυφαία υποστήριξη:",]

var arr_names=["title","text"];

    
function make_json(arr,objnames,name){
var jsonarr = [];
$(arr[0]).each(function(index){
    var arrobj = index;
    var obj = {};
    $(objnames).each(function(index){
        obj[this]= arr[index][arrobj];
             
        
       
    }); 
    jsonarr.push(obj);


    });
    console.log(name+"= json_decode('"+JSON.stringify(jsonarr, null, 2)+"'); " );  
   
}


make_json([arr1,arr2],arr_names,"$firstblock");



</script>





<?php  $firstblock= json_decode('[
  {
    "title": "DIGITAL AGENCIES/IT COMPANIES",
    "text": "Θέλεις κορυφαίο hosting για την εταιρία και τους πελάτες σου;"
  },
  {
    "title": "Resellers",
    "text": "Θέλεις ταχύτητα, ασφάλεια και μειωμένες τιμές στα .GR domains;"
  },
  {
    "title": "Web Designers",
    "text": "Θέλεις ένα φιλικό περιβάλλον φιλοξενίας με κορυφαία υποστήριξη:"
  }
]');
?>

