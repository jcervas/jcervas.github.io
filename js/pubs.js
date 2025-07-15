function newEntry(data) {
    // Sort data by year (descending), then title (alphabetically)
    data.sort((a, b) => {
        const yearA = a.issued?.["date-parts"]?.[0]?.[0] ?? 0;
        const yearB = b.issued?.["date-parts"]?.[0]?.[0] ?? 0;

        if (yearA !== yearB) {
            return yearB - yearA; // Descending year
        }

        const titleA = a.title?.toLowerCase() ?? "";
        const titleB = b.title?.toLowerCase() ?? "";
        return titleA.localeCompare(titleB); // Alphabetical title
    });

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

        const year = obj.issued?.["date-parts"]?.[0]?.[0] ?? "";

        const li = document.createElement('li');
        li.setAttribute("id", `#pub${obj.id}`);
        li.setAttribute("data-pub-id", obj.id);
        li.setAttribute("class", "item");

        li.innerHTML = `
            ${obj.title ? `<span class="jc-title"><a href="${obj.URL}">${obj.title}</a></span>.` : ""}
            ${formattedAuthors ? `<span class="jc-authors">${formattedAuthors}</span>.` : ""}
            ${year ? ` <span class="jc-year">${year}</span>.` : ""}
            ${obj.journalAbbreviation ? `<span class="jc-journal">${obj.journalAbbreviation}</span>` : ""}
            ${obj.volume ? `<span class="jc-volume">${obj.volume}</span>` : ""}
            ${obj.issue ? `<span class="jc-issue">${obj.issue}</span>` : ""}
            ${obj.page ? `<span class="jc-pages">${obj.page}</span>` : ""}
        `;

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