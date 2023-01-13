
var h = document.querySelectorAll("ol.footnotes > li");
var s = document.querySelectorAll("sup");
// var fn = document.getElementsByClassName("jc-footnote");
var fn = document.querySelectorAll("footnote");
var f = document.getElementsByClassName("jc-footnote-link");
var fnindex = document.getElementById("footnotes");

// console.log(fn[12]);
// console.log(fnindex);

for (var i = 0; i < fn.length; i++) {
     var span = document.createElement("span");
     var sup = document.createElement("span");
     span.className = 'jc-footnote-link';
     sup.setAttribute("id", "ss-" + parseInt(i + 1));
     fn[i].setAttribute("id", "fn-" + parseInt(i + 1));
     sup.innerHTML += parseInt(i + 1);
     span.appendChild(sup);
     fn[i].before(span);

     var li = document.createElement('li');
     li.setAttribute("id", "#fn" + parseInt(i + 1));
     li.setAttribute("data-footnote-id", parseInt(i + 1));
     li.innerHTML += fn[i].innerHTML;
     fnindex.appendChild(li);
     // fn[i].innerHTML = "";
}


for (var i = 0; i < f.length; i++) {
     f[i].onclick = function() {
          var id = this.childNodes[0].getAttribute("id")
          id = id.replace(/\D/g, '');
          console.log(id);
          if (this.childNodes.length > 1) {
               this.childNodes[1].classList.remove("expanded");
               var ss = document.getElementById("ss-" + id)
               ss.innerHTML = id;
               this.removeChild(this.childNodes[1]);
          } else {
               var div = document.createElement('div');
               var sup_div = document.createElement('sup');
               sup_div.setAttribute("style", "padding-right: 5px;");
               sup_div.innerHTML += id
               div.appendChild(sup_div);
               this.appendChild(div);
               div.className = 'jc-note-inline graybox expanded';
               var footnote = document.getElementById("fn-" + id);
               console.log(footnote.innerHTML);
               div.innerHTML += footnote.innerHTML;
               var ss = document.getElementById("ss-" + id);
               ss.innerHTML = "x";
          };

     };
};
