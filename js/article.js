// var obj = JSON.parse(meta);
// console.log(obj)

// document.getElementById("title").innerHTML = obj.title;
// document.title = obj.title;

// var authors = obj.authors;
// var authors_text = authors[0];

// if (authors.length == 2) {
//      authors_text = authors[0] + " and " + authors[1];
// } else {
//      for (var i = 1; i < authors.length; i++) {
//           if (i == authors.length) {
//                authors_text = authors_text + ", and " + authors[i];
//           } else {
//                authors_text = authors_text + ", " + authors[i];
//           }
//      }
// }

// document.getElementById("authors").innerHTML = authors_text;



var h = document.querySelectorAll("ol.footnotes > li");
var s = document.querySelectorAll("sup");
var fn = document.getElementsByClassName("jc-footnote-link");
var fnindex = document.getElementById("footnotes");

console.log(fn[12]);
console.log(fnindex);

for (var i = 0; i < fn.length; i++) {
     var sup = document.createElement('sup');
     sup.setAttribute("id", "ss-" + parseInt(i + 1));
     sup.innerHTML += parseInt(i + 1);
     fn[i].appendChild(sup);

     var li = document.createElement('li');
     li.setAttribute("id", "#fn" + parseInt(i + 1));
     li.setAttribute("data-footnote-id", parseInt(i + 1));
     li.innerHTML += fn[i].getAttribute("data-footnote-content");
     fnindex.appendChild(li);
}

for (var i = 0; i < fn.length; i++) {
     fn[i].onclick = function() {
          var id = this.childNodes[0].getAttribute("id")
          id = id.replace(/\D/g, '');
          if (this.childNodes.length > 1) {

               this.childNodes[1].classList.remove("expanded");
               this.childNodes[0].innerHTML = id;
               this.removeChild(this.childNodes[1]);

          } else {
               var div = document.createElement('div');
               this.appendChild(div);
               div.className = 'jc-note-inline graybox expanded';
               div.innerHTML += this.getAttribute("data-footnote-content");
               var ss = document.getElementById("ss-" + id);
               ss.innerHTML = "x";
          };

     };
};
