import React from "react";

export default class Search extends React.Component {
    
    render() {
        return(
            <div>
                <input 
                    placeholder="Enter a city to see the weather" 
                    value={this.props.currentSearch} 
                    onChange={this.props.updateSearch}
                /> 
                <button onClick={this.props.submitSearch}>Get the weather</button>
            </div>    
        );
    }
}