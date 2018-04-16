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
         startIndex: 0,
         pageNumber: 1,
         totalItems: 0,
         itemsPerPage: 4
        }
    }

    fetch = () => {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${this.state.bookSearched}&printType=books&orderBy=newest&maxResults=4&startIndex=${this.state.startIndex}`)
        .then(resp=>{
            return resp.json();
        })

        .then(data => {
           console.log(data)
           if(data.totalItems != 0){
                let itemsCount = data.items.length; 
                let totalItems = data.totalItems;
                let myBookCover = [];
                let myBookAuthor = [];
                let myBookTitle= [];
                let volumeInfo = [];
                let myBookPreview = [];
        
                const { items } = data;
            
                items.forEach(item => {
                    console.log("to jest moj item" + item)
                    
                    const thumbnail = idx(item, _ => _.volumeInfo.imageLinks.thumbnail) || console.log("to jest ____" + _.volumeInfo.imageLinks.thumbnail) + 'img/NoBookCover.png';
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
                    error: "no",
                    totalItems: totalItems
                })
           } else {
               this.setState({
                   error: "yes"
               })
           }
        }
    )       
}
   
 
    //get input on the searched book
    handleSearchChange = (e) => {
        this.setState({
            bookSearched: e.target.value,
        })
        
    }

    //submit button trigers fetching the data from the API
    handleSubmission = (e) =>{
        e.preventDefault();
        this.fetch()
        this.setState({
            totalItems: 0, 
            pageNumber: 1,
        })
    }
    
    
    handlePrev = () =>{
        if(this.state.startIndex > 1 && this.state.pageNumber > 1){
            this.setState({
                startIndex: this.state.startIndex - this.state.itemsPerPage,
                pageNumber: this.state.pageNumber - 1
            })
        }
    }

    handleNext = () => {
        if(this.state.totalItems / this.state.itemsPerPage >  this.state.pageNumber){
            this.setState({
                startIndex: this.state.startIndex + this.state.itemsPerPage,
                pageNumber: this.state.pageNumber + 1, 
                bookTitle: []
            })
        }
    }


  componentDidUpdate(prevProps, prevState){
    if(prevState.startIndex != this.state.startIndex){
        this.fetch();
    }
  }



    render(){ 
        let error
        let volumeInfo = [];
        if(this.state.error != "no"){
            error = <span className="message">Unfortunately this book cannot be found :(
            </span>
        } else {
            this.state.bookTitle.forEach((e, i) => {
                volumeInfo.push(
                 <div className="book-content">
                     <div className="book-cover"><img src={this.state.bookCover[i]}/></div>
                     <a href={this.state.bookPreview[i]}>Preview</a>  
                     <div className="book-title">{this.state.bookTitle[i]}</div>    
                     <div className="book-author">{this.state.bookAuthor[i]}</div>    
                </div>
            )
         })

        }

        let buttonContainer
        if(this.state.responseLength != 0 && this.state.error == "no"){
           buttonContainer =                     
           <div className="container buttons-container">
                <button className="btn" onClick={this.handlePrev}>Prev</button>
                <span onChange={this.handleCounter} className="message">{this.state.pageNumber} out of {Math.ceil(this.state.totalItems / this.state.itemsPerPage)}</span>
            <button className="btn" onClick={this.handleNext}>Next</button>
            </div>
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
                {buttonContainer}
            </div>

        )
     }
}
ReactDOM.render(
    <GoogleBooks/>,
    document.getElementById('app')
);