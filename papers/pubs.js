
function newEntry(data) {
    var newIndex = document.createElement('ul');
    newIndex.classList.add('jc-item');
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        
        for (var j = 0; j < obj.author.length; j++) {

            if (j == 0) {
                authors = obj.author[j].given + " " + obj.author[j].family

            } else {
                authors += " and " + obj.author[j].given + " " + obj.author[j].family;
            }
            // console.log(authors)
        }
        var year = " <span class=\"jc-year\">" + obj.year + "</span>."
        var title = ". <span class=\"jc-title\"><a href=" + obj.pdf + ">" +  obj.title + "</a>.</span> "
        var journal = "<span class=\"jc-journal\"> " + obj.journal + "</span> "
        var volume = "<span class=\"jc-volume\">" + obj.volume + "</span>"
        var issue = "<span class=\"jc-issue\">" + obj.issue + "</span> "
        var pages = "<span class=\"jc-pages\">" + obj.page + ".</span> "
        var pdf = "<span class=\"jc-pdf\"><a href=" + obj.pdf + ">Read online</a></span>"
        var fulltext = "<span class=\"jc-fulltext\"><a href=" + obj.fulltext + ">Full text</a></span>"
        var bibtex = "<span class=\"jc-download\"><a href=" + obj.bibtex + ">bibTex</a> | "
        var xml = "<a href=" + obj.xml + ">XML</a></span>"

        // console.log(pdf)

        var li = document.createElement('li');
        li.setAttribute("id", "#pub" + parseInt(i + 1));
        li.setAttribute("data-pub-id", parseInt(i + 1));
        li.setAttribute("class", "item");

        if (typeof obj.title !== 'undefined') {
            li.innerHTML += title;
        };
        if (typeof obj.author !== 'undefined') {
            li.innerHTML += authors;
        };
        if (typeof obj.year !== 'undefined') {
            li.innerHTML += year;
        }
        if (typeof obj.journal !== 'undefined') {
            li.innerHTML += journal;
        };
        if (typeof obj.volume !== 'undefined') {
            li.innerHTML += volume;
        };
        if (typeof obj.issue !== 'undefined') {
            li.innerHTML += issue;
        };
        if (typeof obj.page !== 'undefined') {
            li.innerHTML += pages;
        };

    // var span = document.createElement('span');
    //         span.setAttribute("class", "jc-cite");
    //     if (typeof obj.pdf | obj.fulltext !== 'undefined') {
            
    //         li.innerHTML += "<span class=\"jc-cite\">";

    //         if (typeof obj.pdf !== 'undefined') {
    //             span.innerHTML += pdf;
    //         };
    //         // if (typeof obj.fulltext !== 'undefined') {
    //         //     span.innerHTML += fulltext;
    //         // };
    //     }

        // if (typeof (obj.bibtex !== 'undefined') || (obj.xml !== 'undefined')) {
        //     var span_cite = document.createElement('span');
        //     span_cite.setAttribute("class", "jc-citedownload");

        //     if (typeof obj.bibtex !== 'undefined') {
        //         span_cite.innerHTML += bibtex;
        //     };

        //     if (typeof obj.xml !== 'undefined') {
        //         span_cite.innerHTML += xml;
        //     };
        //     span.appendChild(span_cite);
        // };

        
        li.appendChild(span);
        newIndex.appendChild(li);
    }
    return newIndex;
}


// This starts the collection of data from the JSON database
d3.json("papers/pubs.json")
    .then(function(data) {
        // if (error) throw error;
        var journalindex = document.getElementById("journal");
        var JournalEntry = newEntry(data)
        journalindex.appendChild(JournalEntry);
    });

d3.json("papers/working.json")
    .then(function(data) {
        // if (error) throw error;
        var workingindex = document.getElementById("working");
        var WorkingEntry = newEntry(data)
        workingindex.appendChild(WorkingEntry);
    });
