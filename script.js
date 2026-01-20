const searchForm = document.querySelector(".search-form");
const output = document.querySelector(".results");

async function onSearchFormSubmit(event){
    event.preventDefault();
    const search = (new FormData(event.target)).get("book");
    if (search === "") {
        return;
    }
    
    const url = `https://openlibrary.org/search.json?q=${search.replaceAll(' ', '+')}&page=1`;
    output.innerHTML = "";
    

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const result = await response.json();
	for (let doc of result.docs) {
            const newBook = makeBook({
                title: doc.title,
                author: doc.author_name ? doc.author_name[0] : "",
                image: `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}.jpg`,
                alt: doc.cover_edition_key
            });
            output.appendChild(newBook);
        }
        console.log(result);
    } catch(error) {
        console.log(error);
        output.textContent = "Error searching";
    }
}

searchForm.addEventListener("submit", onSearchFormSubmit);


function makeBook(info) {
    /*

    <div class="book">
      <img class="book__pic" />
      <div class="book__info">
        <h4 class="book__title">name</h4>
        <p class="book__author">author</p>
      </div>
    </div>

    */

    const book = document.createElement("div");
    book.classList.add("book");
    
    const image = document.createElement("img");
    image.classList.add("book__pic");
    image.src = info.image;
    image.alt = info.alt;
    book.appendChild(image);
    
    const content = document.createElement("div");
    content.classList.add("book__info");
    book.appendChild(content);

    const title = document.createElement("h4");
    title.classList.add("book__title");
    title.textContent = info.title;
    content.appendChild(title);
    
    const author = document.createElement("p");
    author.classList.add("book__author");
    author.textContent = info.author;
    content.appendChild(author);

    return book;
}
