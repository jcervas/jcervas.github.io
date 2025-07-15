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
        const authors = Array.isArray(obj.author) ? obj.author.map(author => `${author.given} ${author.family}`) : [];
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
        li.setAttribute("id", `pub${obj.title}`);
        li.setAttribute("data-pub-id", obj.title);
        li.setAttribute("class", "item");

li.innerHTML = `
    <div class="Accordion flush">
        <div class="paragraph paragraph--type--accordion-item paragraph--view-mode--default Accordion__item">
            <h3 class="Accordion__heading">
                <button class="Accordion__toggle" aria-expanded="false" aria-controls="details-${obj.title}">
                    <span class="link">
                        ${obj.URL ? `<a href="${obj.URL}" target="_blank" rel="noopener noreferrer">${obj.title}</a>` : obj.title}
                    </span>
                </button>
            </h3>
            <div class="Accordion__collapse" id="details-${obj.title}">
                <div class="Accordion__content">
                    <div class="Common flush">
                        <div class="Table__stack">
                            ${formattedAuthors ? `<span class="jc-authors">${formattedAuthors}</span>.` : ""}
                            ${year ? ` <span class="jc-year">${year}</span>.` : ""}
                            ${obj.journalAbbreviation ? `<span class="jc-journal">${obj.journalAbbreviation}</span>` : ""}
                            ${obj.volume ? `<span class="jc-volume">${obj.volume}</span>` : ""}
                            ${obj.issue ? `<span class="jc-issue">${obj.issue}</span>` : ""}
                            ${obj.page ? `<span class="jc-pages">${obj.page}</span>` : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

const button = li.querySelector('.Accordion__toggle');
const collapse = li.querySelector('.Accordion__collapse');
button.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !expanded);
    // Let the external CSS handle the show/hide based on aria-expanded
});

        newIndex.appendChild(li);
    }

    return newIndex;
}

// Fetch and display journal and working papers data in parallel
Promise.all([
    fetch("papers/pubs.json").then(response => response.json()),
    fetch("papers/working.json").then(response => response.json())
])
.then(([journalData, workingData]) => {
    const journalIndex = document.getElementById("journal");
    const journalEntry = newEntry(journalData);
    journalIndex.appendChild(journalEntry);

    const workingIndex = document.getElementById("working");
    const workingEntry = newEntry(workingData);
    workingIndex.appendChild(workingEntry);
})
.catch(error => console.error("Error loading publication data:", error));