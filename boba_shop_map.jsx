const BookForm = React.createClass({
		render() {
				let book = this.props.book;

				return (
						<form>
								<h3>Book Details</h3>
								<div className="form-group">
										<label>Title</label>
										<TextInput path="title" data={book}/>
								</div>
								<div className="form-group">
										<label>ISBN</label>
										<TextInput path="isbn" data={book}/>
								</div>
								<div className="form-group">
										<label>Price</label>
										<NumberInput path="price" data={book}/>
								</div>
								<h3>Authors</h3>
								{this.renderAuthors()}
								<button type="button" className="btn" onClick={this.addAuthor}>
										Add Author
								</button>
						</form>
				)
		},

		renderAuthors() {
				let book = this.props.book;
				let authors = book.authors;
				if (!authors || authors.length === 0) {
						return <div className="text-muted">No authors</div>;
				}
				return authors.map((author, i) => (
						<div className="form-group" key={`author${i}`}>
								<label>Name</label>
								<TextInput path={`authors[${i}].firstName`} data={book}/>
								<TextInput path={`authors[${i}].lastName`} data={book}/>
								<button type="button" className="btn" onClick={this.removeAuthor.bind(this, i)}>
										Remove
								</button>
						</div>
				));
		},

		addAuthor() {
				this.props.book.authors.push({firstName: '', lastName: ''});
				this.forceUpdate();
		},

		removeAuthor(i) {
				this.props.book.authors.splice(i);
				this.forceUpdate();
		}
});

let book = {
		title: 'A Song of Ice and Fire',
		isbn: '978-0553593716',
		price: 6.99,
		authors: [{firstName: 'George R.R.', lastName: 'Martin'}]
};

module.exports = {
		name: 'Forms',
		fn: () => <BookForm book={book}/>
};
