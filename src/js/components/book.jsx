import React from 'react'; 

class Book extends React.Component{
    //this component is rendering one book 
    render(){
      return(
        <div className="book-content">
            <div className="book-cover"><img src={this.props.book.volumeInfo.imageLinks && this.props.book.volumeInfo.imageLinks.thumbnail || 'img/NoBookCover.png'}/></div>
            <a href={this.props.book.volumeInfo.previewLink || ''}>Preview</a>  
            <div className="book-title">{this.props.book.volumeInfo.title || 'No Author Information Available'}</div>    
            <div className="book-author">{this.props.book.volumeInfo.authors || 'No Title Information Available'}</div>    
        </div>
      )
    }
}

export {Book}