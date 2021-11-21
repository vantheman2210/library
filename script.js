let submit = document.getElementById("submit");  
let form = document.getElementById("bookForm");
  submit.addEventListener("click", () => {    
    addBookToLibrary();  
    form.reset();
  }) 

  readButton.addEventListener("click", () => { 
    if(readButton.innerText === "READ") { 
      readButton.innerText = "NOT READ";
    } else { 
      readButton.innerText = "READ";
    }
  })

let myLibrary = []; 

function Book(title, author, pages, read) {
  this.title = title; 
  this.author = author; 
  this.pages = Number(pages); 
  this.read = read; 
}  

function addBookToLibrary() {   
  
  let titleNew = document.getElementById("titleForm").value; 
  let authorNew = document.getElementById("authorForm").value; 
  let pagesNew = document.getElementById("pagesForm").value;  
  let readNew = document.getElementById("readButton").innerText; 
  
  let book = new Book(titleNew, authorNew, pagesNew, readNew);  
    myLibrary.push(book); 
    displayLibrary();
}  

function readStatus(number, string) {  
  myLibrary[number]['read'] = string; 
}

const populateStorage = () => {
  localStorage.setItem('library', JSON.stringify(myLibrary));
}

const getStorage = () => {
  myLibrary = JSON.parse(localStorage.getItem('library'));
}

function displayLibrary () {    

  populateStorage(); 

  let container = document.getElementById("container"); 
  container.innerHTML = "";

  for(i = 0; i < myLibrary.length; i++) {    

    let index = myLibrary[i];   
    
   
    let grid = document.createElement("div");  
    grid.id =  i;   
    grid.setAttribute("value", i); 
    grid.setAttribute("class", "books");
    
    let author = document.createElement("h2");  
    author.id = "author"; 

    let title = document.createElement("h3");  
    title.id = "title"; 

    let pages = document.createElement("h3");  
    pages.id = "pages"; 

    let read = document.createElement("button");
    read.id = "read";  

    let remove = document.createElement("button"); 
    remove.id = "remove";  

    document.getElementById("container").appendChild(grid);  
    grid.appendChild(author); 
    grid.appendChild(title); 
    grid.appendChild(pages); 
    grid.appendChild(read); 
    grid.appendChild(remove); 
    
    author.innerHTML = "Author: " + (myLibrary[i].author); 
    title.innerHTML = "Title: " + (myLibrary[i].title); 
    pages.innerHTML = "Pages: " + (myLibrary[i].pages); 
    read.innerText = myLibrary[i].read;    
    remove.innerHTML = '<i class="fa fa-trash fa-2x"></i>';   
    
    remove.addEventListener("click", () => {   
      index = grid.id;
      myLibrary.splice(index, 1);       
      displayLibrary();
    })   

    read.addEventListener("click", () => {   
      index = grid.id;

      if (read.innerText == "READ") {   
          read.innerText = "NOT READ"; 
          readStatus(index, "NOT READ");  
          populateStorage();

      } else if(read.innerText == "NOT READ"){  
          read.innerText = "READ"; 
          readStatus(index, "READ");   
          populateStorage();
          
        }})    
    };  
} 

document.addEventListener("DOMContentLoaded", () => { 
  if(!localStorage.getItem('library')) {
    populateStorage();
  } else {
    getStorage(); 
    displayLibrary()
  }
})