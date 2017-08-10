import React from "react";

export default class City extends React.Component {
    buildCurrentCity(){
        let currentCity = this.props.currentCity;
        if(currentCity){
            return(
                <div className="col-xs-12 col-md-6 col-md-offset-3 cityDisplay">
                    <div className="cityName">{currentCity.name}</div>
                    <img className="weatherIcon" src={currentCity.conditionIconUrl}/>
                    <div className="currentTemp">Current Tempurature:<br/> <span className="degrees">{currentCity.temp}&deg;F</span></div>
                    <div className="weatherCondition">Weather Condition: {currentCity.condition}</div>
                    <div className="weatherDescription">Description: {currentCity.conditionDesc}</div>
                    
                </div>
            );
        }else{
            return (<h3>no data available for: {this.props.lastSearch}</h3>);
        }
    }
    render() {
        return this.buildCurrentCity();
    }
}