let submit = document.getElementById("submit"); 
let form = document.getElementById("bookForm");
  submit.addEventListener("click", () => {  
    addBookToLibrary(); 
    form.reset();
  })


let myLibrary = [{ author: "Tolkien", title: "Hobbit", pages: 279, read: true}, 
{ author: "Coelho", title: "Alchemist", pages: 279, read: false}, 
{ author: "Reagan", title: "American Life", pages: 279, read: false},
   
  ];

function Book(title, author, pages, read) {
  this.title = title; 
  this.author = author; 
  this.pages = Number(pages); 
  this.read = function() { 
    if ("read") { 
      return true;
    } else { 
      return false;
    }
  }; 
  console.log(this.read);
}

function addBookToLibrary() {  
  let titleNew = document.getElementById("titleForm").value; 
  let authorNew = document.getElementById("authorForm").value; 
  let pagesNew = document.getElementById("pagesForm").value; 
  let readNew = document.getElementById("readForm").value;
  let book = new Book(titleNew, authorNew, pagesNew, readNew); 
    myLibrary.push(book);   
    displayLibrary();  
}  

function displayLibrary () {  

  let container = document.getElementById("container"); 
  container.innerHTML = "";

  for(i = 0; i < myLibrary.length; i++) {   

    let grid = document.createElement("div");  
    grid.id = "book" + i;  

    let h2 = document.createElement("h2");  
    h2.id = "author"; 

    let h3 = document.createElement("h3");  
    h3.id = "title"; 

    let h33 = document.createElement("h3");  
    h33.id = "pages"; 

    let h333 = document.createElement("h3");
    h333.id = "read";

    document.getElementById("container").appendChild(grid);  
    grid.appendChild(h2); 
    grid.appendChild(h3); 
    grid.appendChild(h33); 
    grid.appendChild(h333);

    h2.innerHTML = "Author: " + JSON.stringify(myLibrary[i].author); 
    h3.innerHTML = "Title: " + JSON.stringify(myLibrary[i].title); 
    h33.innerHTML = "Pages: " + JSON.stringify(myLibrary[i].pages); 
    h333.innerHTML = "Read: " + JSON.stringify(myLibrary[i].read); 
}; 

/*let button = document.getElementById("newBook"); 
button.addEventListener("click", () => { 
  let form = document.getElementById("bookForm")
  form.style.display = 'block';   
}) */

/*let submit = document.getElementById("submit");
  submit.addEventListener("click", () => {  
    addBookToLibrary();
  })*/

}
//addBookToLibrary(); 
//displayLibrary();