let submit = document.getElementById('submit');
let form = document.getElementById('bookForm');
const container = document.getElementById('container');
submit.addEventListener('click', () => {
	addBookToLibrary();
	form.reset();
});

readButton.addEventListener('click', () => {
	if (read) {
		readButton.innerText = 'NOT READ';
	} else {
		readButton.innerText = 'READ';
	}
});

let myLibrary = [];

class Book {
	constructor(title, author, pages, read = false) {
		this.title = title;
		this.author = author;
		this.pages = Number(pages);
		this.read = read;
	}
}

function addBookToLibrary() {
	let titleNew = document.getElementById('titleForm').value;
	let authorNew = document.getElementById('authorForm').value;
	let pagesNew = document.getElementById('pagesForm').value;
	let readNew = document.getElementById('readButton').innerText;

	let book = new Book(titleNew, authorNew, pagesNew, readNew);

	if (auth.currentUser) {
		console.log(auth.currentUser);
		addBookDb(book);
	} else {
		myLibrary.push(book);
	}
	displayLibrary();
}

function readStatus(number, condition) {
	console.log(number, condition);
	console.log(myLibrary[number].read);
	myLibrary[number]['read'] = condition === true ? false : true;
}

const populateStorage = () => {
	localStorage.setItem('library', JSON.stringify(myLibrary));
};

const getStorage = () => {
	myLibrary = JSON.parse(localStorage.getItem('library'));
};

function displayLibrary() {
	container.innerHTML = '';
	if (auth.currentUser === null) {
		console.log('null');
		populateStorage();
	}

	for (i = 0; i < myLibrary.length; i++) {
		let index = myLibrary[i];

		let grid = document.createElement('div');
		grid.id = i;
		grid.setAttribute('value', i);
		grid.setAttribute('class', 'books');

		let author = document.createElement('h2');
		author.id = 'author';

		let title = document.createElement('h3');
		title.id = 'title';

		let pages = document.createElement('h3');
		pages.id = 'pages';

		let read = document.createElement('button');
		read.id = 'read';

		let remove = document.createElement('button');
		remove.id = 'remove';

		document.getElementById('container').appendChild(grid);
		grid.appendChild(author);
		grid.appendChild(title);
		grid.appendChild(pages);
		grid.appendChild(read);
		grid.appendChild(remove);

		author.innerHTML = 'Author: ' + myLibrary[i].author;
		title.innerHTML = 'Title: ' + myLibrary[i].title;
		pages.innerHTML = 'Pages: ' + myLibrary[i].pages;
		read.innerText = myLibrary[i].read;
		remove.innerHTML = '<i class="fa fa-trash fa-2x"></i>';

		remove.addEventListener('click', () => {
			index = grid.id;
			const firestoreTitle = myLibrary[index].title;
			myLibrary.splice(index, 1);
			if (auth.currentUser !== null) {
				console.log('user');
				deleteBookDb(firestoreTitle);
			}
			displayLibrary();
			console.log('click');
		});

		read.addEventListener('click', () => {
			const index = grid.id;
			const isRead = myLibrary[0].read;

			if (isRead) {
				read.innerText = 'NOT READ';
				readStatus(index, true);
				populateStorage();
			} else {
				read.innerText = 'READ';
				readStatus(index, false);
				populateStorage();
			}
		});
	}
}

// Auth
const auth = firebase.auth();
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

auth.onAuthStateChanged((user) => {
	container.innerHTML = '';
	if (user) {
		db.collection('books').onSnapshot((snapshot) => {
			console.log(snapshot.docs);
			myLibrary = docsToBooks(snapshot.docs);
			displayLibrary();
		});
	} else {
		console.log('anonymous');
		storage();
		displayLibrary();
	}
});

const signIn = () => {
	console.log('----signin----');
	container.innerHTML = '';
	const provider = new firebase.auth.GoogleAuthProvider();
	firebase
		.auth()
		.setPersistence(firebase.auth.Auth.Persistence.NONE)
		.then(() => {
			return provider;
		})
		.catch((error) => {
			// Handle Errors here.
			console.log(error);
		});
	auth.signInWithPopup(provider);
	signInBtn.style.display = 'none';
	signOutBtn.style.display = 'block';
};

const signOut = () => {
	console.log('-------singout-------');
	console.log('logout');
	container.innerHTML = '';
	myLibrary = [];
	auth.signOut();
	signInBtn.style.display = 'block';
	signOutBtn.style.display = 'none';
	storage();
	displayLibrary();
};

signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', signOut);

// Local storage
const storage = () => {
	container.innerHTML = '';
	if (!auth.currentUser === null) {
		console.log('user logged');
		return;
	} else {
		console.log('here');

		if (!localStorage.getItem('library')) {
			console.log('populated');
			populateStorage();
		} else {
			console.log('storage retrieved');
			getStorage();
			displayLibrary();
		}
	}
};

storage();

// Firestore

const db = firebase.firestore();

const addBookDb = (book) => {
	db.collection('books').add(bookToObj(book));
};

const bookToObj = (book) => {
	return {
		userId: auth.currentUser.uid,
		title: book.title,
		author: book.author,
		pages: Number(book.pages),
		read: book.read
	};
};

const docsToBooks = (docs) => {
	return docs.map((doc) => {
		console.log(doc.data());
		return new Book(doc.data().title, doc.data().author, doc.data().pages, doc.data().read);
	});
};

const getDocId = async (title) => {
	const data = await db.collection('books').where('title', '==', title).get();
	const id = data.docs.map((doc) => doc.id).join('');
	return id;
};

const deleteBookDb = async (title) => {
	console.log(await getDocId(title));
	db.collection('books').doc(await getDocId(title)).delete();
};

const updateReadDb = async (title) => {
	db.collection('books').doc(await getDocId(title)).update({ read: 'NOT READ' });
};
