import React from 'react';
import ReactDOM from 'react-dom';
import idx from 'idx';


class Volume extends React.Component{
    constructor(props){
        super(props)
        this.state = {
         bookSearched: "",
         responseLength: 0,
         bookCover: [],
         bookAuthor: [],
         bookTitle: [],
         error: ""
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
                        let volumeInfo = []

                        const { items } = data;

                        items.forEach(item => {
                            //return an empty string if undefined 
                            const thumbnail = idx(item, _ => _.volumeInfo.imageLinks.thumbnail) || '';
                            const authors = idx(item, _ => _.volumeInfo.authors) || '';
                            const title = idx(item, _ => _.volumeInfo.title) || '';
                            myBookCover.push(thumbnail);
                            myBookAuthor.push(authors);
                            myBookTitle.push(title);
                        });

                        this.setState({
                            responseLength: itemsCount,
                            bookCover: myBookCover,
                            bookAuthor: myBookAuthor,
                            bookTitle: myBookTitle,
                            error: "no"
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
                    <div className="book-author">{this.state.bookAuthor[i]}</div>
                    <div className="book-title">{this.state.bookTitle[i]}</div>
                
                                    
                 </div>
               )
        })
        return (
            <div className="parent">
                <header className="main-header">
                    <div className="container">
                        <h1 className="heading">Book Volumes</h1>
                    </div>
                </header>
                <nav className="main-nav">
                    <div className="container">
                        <form onSubmit={this.handleSearch}>
                            <label htmlFor="username">Enter Book Name</label>
                            <input type="text" placeholder="Book Name"  onChange={this.handleSearchChange}/>
                            <button onClick={this.handleSubmission}>Send data!</button>
                        </form>
                    </div>
                </nav>
                <div className="main-section-results">
                    <div className="container">
                        {volumeInfo}
                        
                    </div>
                </div> 
            </div>

        )

    }
   
}

ReactDOM.render(
    <Volume/>,
    document.getElementById('app')
);

