import React, { Component } from 'react'
import Loader from './Loader';
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 9,
        category: 'technology'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    constructor(props){
        super(props);
        this.state = {
            articles : [],
            loading: true,
            page: 1,
            totalResults:0
        }
        document.title = `${this.props.category.replace(/\b\w/g, function(l){ return l.toUpperCase() })} | myNews`
    }

    async updateNews(pageNo){
        this.props.setProgress(20);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${pageNo}`;
        this.setState({loading:true});
        let data = await fetch(url);
        this.props.setProgress(50);
        let parsedData = await data.json();
        this.setState({
            articles: parsedData.articles, 
            totalResults: parsedData.totalResults, 
            loading: false
        })
        this.props.setProgress(100);
    }

    async componentDidMount(){
        this.updateNews(1)
    }

    handlePrevClick = async () =>{
        this.updateNews(this.state.page - 1)
        this.setState({page: this.state.page - 1})
    }
    handleNextClick = async () =>{
        this.updateNews(this.state.page + 1);
        this.setState({page: this.state.page + 1})
    }
    fetchMoreData = async () => {
        this.setState({page: this.state.page + 1})
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&pageSize=${this.props.pageSize}&page=${this.state.page}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles), 
            totalResults: parsedData.totalResults,
        })
    };
    render() {
        return (
            <>
                <h1 className="text-center text-capitalize my-5 mx-5" >myNews - Top {this.props.category} Headlines</h1>
                {this.state.loading && <Loader/>}
                <InfiniteScroll
                dataLength={this.state.articles.length}
                next={this.fetchMoreData}
                hasMore={this.state.articles.length !== this.state.totalResults}
                loader={<Loader/>}
                >
                <div className="container">
                <div className="row">
                    {this.state.articles.map((element)=>{
                        return <div className="col-md-4" key={element.url}>
                        <NewsItem title={element.title===null?'':element.title.slice(0,45)} description={element.description===null?'':element.description.slice(0,88)} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                    </div>
                    })}
                </div>
                </div>
                </InfiniteScroll>
                {/* <div className="d-flex justify-content-between">
                    <button disabled={this.state.page<=1} className="btn btn-sm btn-primary" onClick={this.handlePrevClick} >&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize) } className="btn btn-sm btn-primary" onClick={this.handleNextClick}>Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

export default News
