function newEntry(data) {
    var newIndex = document.createElement('ul');
    newIndex.classList.add('jc-item');

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var authors = obj.author.map(author => author.given + " " + author.family).join(" and ");
        var li = document.createElement('li');
        li.setAttribute("id", "#pub" + parseInt(i + 1));
        li.setAttribute("data-pub-id", parseInt(i + 1));
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