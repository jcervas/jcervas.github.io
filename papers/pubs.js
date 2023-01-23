function newEntry(data) {
    const newIndex = document.createElement('ul');
    newIndex.classList.add('jc-item');

    for (const obj of data) {
        const authors = obj.author.map(author => `${author.given} ${author.family}`).join(" and ");
        const li = document.createElement('li');
        li.setAttribute("id", `#pub${obj.id}`);
        li.setAttribute("data-pub-id", obj.id);
        li.setAttribute("class", "item");
        li.innerHTML = `
            ${obj.title ? `. <span class="jc-title"><a href="${obj.pdf}">${obj.title}</a>.</span>` : ""}
            ${authors ? `${authors}` : ""}
            ${obj.year ? ` <span class="jc-year">${obj.year}</span>.` : ""}
            ${obj.journal ? `<span class="jc-journal"> ${obj.journal}</span> ` : ""}
            ${obj.volume ? `<span class="jc-volume">${obj.volume}</span>` : ""}
            ${obj.issue ? `<span class="jc-issue">${obj.issue}</span> ` : ""}
            ${obj.page ? `<span class="jc-pages">${obj.page}.</span> ` : ""}
        `
        newIndex.appendChild(li);
    }
    document.body.appendChild(newIndex);
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
