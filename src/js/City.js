import React from "react";

export default class City extends React.Component {
    buildCurrentCity(){
        let currentCity = this.props.currentCity;
        if(currentCity){
            return(
                <div>
                    <div>{currentCity.name}</div>
                    <div>{currentCity.temp}</div>
                    <div>{currentCity.condition}</div>
                    <div>{currentCity.conditionDesc}</div>
                    <img src={currentCity.conditionIconUrl}/>
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