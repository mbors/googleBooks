import React from 'react';
import ReactDOM from 'react-dom';
import idx from 'idx';

class GoogleBooks extends React.Component{
    constructor(props){
        super(props)
        this.state = {
         bookSearched: "",
         responseLength: 0,
         bookCover: [],
         bookAuthor: [],
         bookTitle: [],
         bookPreview: [],
         error: "no",
        }
    }
    //get input on the searched book
    handleSearchChange = (e) => {
        this.setState({
            bookSearched: e.target.value
        })
    }

    //submit button trigers fetching the data from the API
    handleSubmission = (e) =>{
        e.preventDefault();
        fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${this.state.bookSearched}&printType=books&orderBy=newest&maxResults=40`)
                .then(resp=>{
                    return resp.json();
                })
                .then(data => {
                   if(data.totalItems != 0){
                        let itemsCount = data.items.length; 
                        let myBookCover = [];
                        let myBookAuthor = [];
                        let myBookTitle= [];
                        let volumeInfo = [];
                        let myBookPreview = [];
                        const { items } = data;
                    
                        items.forEach(item => {
                            const thumbnail = idx(item, _ => _.volumeInfo.imageLinks.thumbnail) || 'img/NoBookCover.png';
                            const authors = idx(item, _ => _.volumeInfo.authors) || 'No Author Information Available';
                            const title = idx(item, _ => _.volumeInfo.title) || 'No Title Information Available';
                            const preview = idx(item, _ => _.volumeInfo.previewLink) || '';
                            myBookCover.push(thumbnail);
                            myBookAuthor.push(authors);
                            myBookTitle.push(title);
                            myBookPreview.push(preview);
                        });

                        this.setState({
                            responseLength: itemsCount,
                            bookCover: myBookCover,
                            bookAuthor: myBookAuthor,
                            bookTitle: myBookTitle,
                            bookPreview: myBookPreview, 
                            error: "no"
                        })
                   } else {
                       this.setState({
                           error: "yes"
                       })
                   }
                }
            )
    }


    render(){ 
        let volumeInfo = [];
        this.state.bookTitle.forEach((e, i) => {
               volumeInfo.push(
                <div className="book-content">
                    <div className="book-cover"><img src={this.state.bookCover[i]}/></div>
                    <a href={this.state.bookPreview[i]}>Preview</a>  
                    <div className="book-author">{this.state.bookAuthor[i]}</div>
                    <div className="book-title">{this.state.bookTitle[i]}</div>    
                 </div>
               )
        })
    
        let error
        if(this.state.error != "no"){
            error = <span className="error-message">Unfortunately this book cannot be found :(</span>
        } 
       
    
        return (
            <div className="parent">
                <header className="main-header">
                    <div className="container">
                        <h1 className="heading">Google Books</h1>
                    </div>
                </header>
                <nav className="main-nav">
                    <div className="container">
                        <form>
                            <input type="text" placeholder="What are you looking for?"  onChange={this.handleSearchChange}/>
                            <button className="btn" onClick={this.handleSubmission}>Search</button>
                        </form>
                    </div>
                </nav>
                <div className="main-section-results">
                    <div className="container">
                        {volumeInfo}
                        {error}
                    </div>
                </div> 
            </div>

        )

    }
   
}

ReactDOM.render(
    <GoogleBooks/>,
    document.getElementById('app')
);

