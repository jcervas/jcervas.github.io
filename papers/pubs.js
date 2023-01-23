function newEntry(data) {
    const newIndex = document.createElement('ul');
    newIndex.classList.add('jc-item');

    for (const obj of data) {

const authors = obj.author.map(author => `${author.given} ${author.family}`);
let formattedAuthors;
if (authors.length === 1) {
    formattedAuthors = authors.join("");
} else if (authors.length === 2) {
    formattedAuthors = authors.join(" and ");
} else {
    const lastTwoAuthors = authors.slice(-2).join(", and ");
    const remainingAuthors = authors.slice(0, -2);
    formattedAuthors = `${remainingAuthors.join(", ")}, ${lastTwoAuthors}`;
}

        const li = document.createElement('li');
        li.setAttribute("id", `#pub${obj.id}`);
        li.setAttribute("data-pub-id", obj.id);
        li.setAttribute("class", "item");
        li.innerHTML = `
            ${obj.title ? `<span class="jc-title"><a href="${obj.pdf}">${obj.title}</a>.</span>` : ""}
            ${formattedAuthors ? `${formattedAuthors}` : ""}
            ${obj.year ? ` <span class="jc-year">${obj.year}</span>.` : ""}
            ${obj.journal ? `<span class="jc-journal"> ${obj.journal}</span> ` : ""}
            ${obj.volume ? `<span class="jc-volume">${obj.volume}</span>` : ""}
            ${obj.issue ? `<span class="jc-issue">${obj.issue}</span> ` : ""}
            ${obj.page ? `<span class="jc-pages">${obj.page}.</span> ` : ""}
        `
        newIndex.appendChild(li);
    }
    return newIndex;
}



// This starts the collection of data from the JSON database
fetch("papers/pubs.json")
    .then(response => response.json())
    .then(data => {
        var journalindex = document.getElementById("journal");
        var JournalEntry = newEntry(data)
        journalindex.appendChild(JournalEntry);
    })
    .catch(error => console.error(error));

fetch("papers/working.json")
    .then(response => response.json())
    .then(data => {
        var workingindex = document.getElementById("working");
        var WorkingEntry = newEntry(data)
        workingindex.appendChild(WorkingEntry);
    })
    .catch(error => console.error(error));