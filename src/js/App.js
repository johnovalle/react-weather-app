import React from 'react';
import Request from 'superagent';

const API_KEY = 'ec43fc60938ed12b00c4a3cbfba0a746';

export default class App extends React.Component {
    constructor(){
        super();
        this.state = {
            currentCity: null,
            previousSearches: {
                //list of cities which gets saved into localStorage on search
            },
            defaultCity: "Tokyo"
        };
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
            this.setState({currentCity: previousSearches[lastCityKey] });
        }
        //or should show the weather at the users current gps if possible
        //failing that a call should be made to get the results for a default city
        else{
            this.getWeather(this.state.defaultCity);
        }
        
    }
    getWeather(citySearched){
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&units=imperial&APPID=${API_KEY}`;
	    Request.get(url).then((response) => {
	        console.log(response);
	        let weatherRes = response.body;
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
	    });
    }
    
    iconToUrl(icon){
        return `https://openweathermap.org/img/w/${icon}.png`;
    }
    
    buildCurrentCity(){
        let currentCity = this.state.currentCity;
        if(this.state.currentCity){
            return(
                <div>
                    <div>{this.state.currentCity.name}</div>
                    <div>{this.state.currentCity.temp}</div>
                    <div>{this.state.currentCity.condition}</div>
                    <div>{this.state.currentCity.conditionDesc}</div>
                    <img src={this.state.currentCity.conditionIconUrl}/>
                </div>
            );
        }else{
            return (<h3>no data available</h3>);
        }
    }
    render(){
        //components need
        //for now just the search (input and sumbit)
        //and display for current city
        return(
            <div>
                <h1>Weather App</h1>
                {this.buildCurrentCity()}
            </div>
        );
    }
}