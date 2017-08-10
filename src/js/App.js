import React from 'react';
import Request from 'superagent';

import City from './City';
import Search from './Search';

const API_KEY = 'ec43fc60938ed12b00c4a3cbfba0a746';
const TIME_KEY = 'AIzaSyACqnEUfeWGi5rgZ9qg3RObNRtNJnNCHeo';

export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            currentCity: null,
            lastSearch: "none",
            currentSearch: "",
            previousSearches: {
                //list of cities which gets saved into localStorage on search
            },
            defaultCity: "Tokyo"
        };
        this.updateSearch = this.updateSearch.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
    }
    componentWillMount(){
        //get state from localStorage if available
        let previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || {};
        
        this.setState({previousSearches});
        let lastCityKey = previousSearches.lastCityKey;
        //state should either show the weather for the last search
        if(lastCityKey){
            //check when the weather was last recieved if time is greater than X
            //get it again
            if(this.isCacheFresh(previousSearches[lastCityKey])){
                //console.log("local data is fresh");
                this.setState({currentCity: previousSearches[lastCityKey] });
            }else{
                //console.log("local data is stale");
                this.getWeather(lastCityKey);
            }
        }
        //failing that a call should be made to get the results for a default city
        else{
            this.getWeather(this.state.defaultCity);
        }
        
    }
    //take advantage of local storage by not hitting server 
    //if it's been less than 1 hour since last search for city
    isCacheFresh(cachedSearch){
        if(cachedSearch && cachedSearch.timeRecieved){
            return this.checkTime(cachedSearch.timeRecieved);
        }else{
            return false;
        }
    }
    checkTime(time){
        const ONE_HOUR = 60 * 60 * 1000;
        const FIVE_MINS = 5 * 60 * 1000;
        let delta = Date.now() - time;
        return delta < FIVE_MINS;
    }
    
    getWeather(cityQuery){
        this.setState({lastSearch: cityQuery});
        let cachedSearch = this.state.previousSearches[cityQuery];
        //if there is no previous search for a city or the search is stale
        if(this.isCacheFresh(cachedSearch)){ //less than one hour since last search
            //console.log("already have", this.state.previousSearches, cityQuery);
            let previousSearches = Object.assign({}, this.state.previousSearches);
            previousSearches.lastCityKey = cityQuery;
            this.setState({currentCity: this.state.previousSearches[cityQuery], previousSearches });
            localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
        }
        else{
            //console.log("new search");
            var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&units=imperial&APPID=${API_KEY}`;
    	    Request.get(url).then((success, failure) => {
    	        console.log(success);
    	        if(success && success.body){
    	            let weatherRes = success.body;
        	        let currentCity = {
        	            name: weatherRes.name,
        	            timeRecieved: Date.now(),
        	            temp: weatherRes.main.temp,
        	            tempHigh: weatherRes.main.temp_max,
        	            tempLow: weatherRes.main.temp_min,
        	            condition: weatherRes.weather[0].main,
        	            conditionIconUrl: this.iconToUrl(weatherRes.weather[0].icon),
        	            conditionDesc: weatherRes.weather[0].description
        	        };
        	        let previousSearches = Object.assign({}, this.state.previousSearches);
                    previousSearches.lastCityKey = weatherRes.name;
                    previousSearches[weatherRes.name] = currentCity;
        	        this.setState({currentCity, previousSearches});
        	        localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
    	        }else{
    	            console.error('failed to get data for: ', cityQuery);
    	        }
    	        
    	    });
        }
        
    }
    
    iconToUrl(icon){
        return `https://openweathermap.org/img/w/${icon}.png`;
    }
    updateSearch(event){
        let val = event.target.value;
        this.setState({currentSearch: val});
    }
    submitSearch(event){
        this.getWeather(this.state.currentSearch);
        this.setState({currentSearch: ""});
    }
    
    render(){
        //components need
        //for now just the search (input and sumbit)
        return(
            <div className="row wrapper">
                <h1 className="col-xs-12 col-md-6 col-md-offset-3">Weather App</h1>
                <City currentCity={this.state.currentCity} 
                        lastSearch={this.state.lastSearch} />
                
                <Search updateSearch={this.updateSearch} 
                        submitSearch={this.submitSearch} 
                        currentSearch={this.state.currentSearch}/>
            </div>
        );
    }
}