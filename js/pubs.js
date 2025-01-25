function newEntry(data) {
    const newIndex = document.createElement('ul');
    newIndex.classList.add('jc-item');

    // Loop through each publication
    for (const obj of data) {
        // Format authors
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

        // Get publication year from date-parts (handling cases when year is undefined)
        const year = obj.issued && obj.issued["date-parts"] ? obj.issued["date-parts"][0][0] : null;

        // Create the list item and set attributes
        const li = document.createElement('li');
        li.setAttribute("id", `#pub${obj.id}`);
        li.setAttribute("data-pub-id", obj.id);
        li.setAttribute("class", "item");

        // Build the inner HTML dynamically
        li.innerHTML = `
            ${obj.title ? `<span class="jc-title"><a href="${obj.URL}">${obj.title}</a></span>.` : ""}
            ${formattedAuthors ? `<span class="jc-authors">${formattedAuthors}</span>.` : ""}
            ${year ? ` <span class="jc-year">${year}</span>.` : ""}
            ${obj.journalAbbreviation ? `<span class="jc-journal">${obj.journalAbbreviation}</span>` : ""}
            ${obj.volume ? `<span class="jc-volume">${obj.volume}</span>` : ""}
            ${obj.issue ? `<span class="jc-issue">${obj.issue}</span>` : ""}
            ${obj.page ? `<span class="jc-pages">${obj.page}</span>` : ""}
        `;
        
        // Append the new list item to the index
        newIndex.appendChild(li);
    }

    return newIndex;
}

// Fetch and display journal data
fetch("papers/pubs.json")
    .then(response => response.json())
    .then(data => {
        const journalIndex = document.getElementById("journal");
        const journalEntry = newEntry(data);
        journalIndex.appendChild(journalEntry);
    })
    .catch(error => console.error("Error loading journal data:", error));

// Fetch and display working papers data
fetch("papers/working.json")
    .then(response => response.json())
    .then(data => {
        const workingIndex = document.getElementById("working");
        const workingEntry = newEntry(data);
        workingIndex.appendChild(workingEntry);
    })
    .catch(error => console.error("Error loading working papers data:", error));
