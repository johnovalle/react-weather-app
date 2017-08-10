import React from "react";

export default class Search extends React.Component {
    
    render() {
        return(
            <div className="form-inline">
                <div className="col-xs-12 col-md-6 col-md-offset-3 form-group">
                    <input className="form-control"
                        placeholder="Enter a city" 
                        value={this.props.currentSearch} 
                        onChange={this.props.updateSearch}
                    /> 
                    <button onClick={this.props.submitSearch}>Get the weather</button>
                </div>
            </div>
        );
    }
}

Search.propTypes = {  
  updateSearch: React.PropTypes.func.isRequired,
  submitSearch: React.PropTypes.func.isRequired,
  currentSearch: React.PropTypes.string.isRequired
};