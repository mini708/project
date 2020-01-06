var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var year = React.createClass ( { 
	getInitialState : function() { 
		return { isCurrentUser: false, editing: false, years: [], id: this.props.pageID }  ;
	 }  ,
	componentWillMount: function() { 
        this.yearRef = firebase.database().ref().child ('user-year/'+this.props.pageID);
        this.yearRef.on ("child_added", snap =>  { 
        	var year = snap.val();
			if (year) { 
				year.key = snap.ref.key;
				this.state.years.push (year);
				this.setState ( { years: this.state.years }  );
			 }  
         }  );
        this.yearRefChanged = firebase.database().ref().child ('user-year/'+this.props.pageID);
        this.yearRefChanged.on ("child_changed", snap =>  { 
        	var year = snap.val();
			if (year) { 
				year.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.years.length; i++) { 
					if (this.state.years[i].key == year.key) { 
						index = i;
					 }  
				 }  
				this.state.years.splice (index, 1, year);
				this.setState ( { years: this.state.years }  );
			 }  
         }  );
        this.yearRefRemoved = firebase.database().ref().child ('user-year/'+this.props.pageID);
        this.yearRefRemoved.on ("child_removed", snap =>  { 
        	var year = snap.val();
			if (year) { 
				year.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.years.length; i++) { 
					if (this.state.years[i].key == year.key) { 
						index = i;
					 }  
				 }  
				this.state.years.splice (index, 1);
				this.setState ( { years: this.state.years }  );
			 }  
         }  );
	 }  ,
	componentWillReceiveProps: function (nextProps) { 
		if (nextProps.pageID != this.state.id) { 
			this.yearRef.off();
			this.yearRefChanged.off();
			this.yearRefRemoved.off();
			this.setState ( { years: [] }  );
			this.yearRef = firebase.database().ref().child('user-year/'+ nextProps.pageID);
	        this.yearRef.on("child_added", snap =>  { 
	        	var year = snap.val();
				if (year) { 
					year.key = snap.ref.key;
					this.state.years.push (year);
					this.setState ( { years: this.state.years }  );
				 }  
	         }  );
	        this.yearRefChanged = firebase.database().ref().child ('user-year/' + nextProps.pageID);
	        this.yearRefChanged.on ("child_changed", snap =>  { 
	        	var year = snap.val();
				if (year) { 
					year.key = snap.ref.key;

					var index;
					for (var i = 0; i < this.state.years.length; i++) { 
						if (this.state.years[i].key == year.key) { 
							index = i;
						 }  
					 }  
					this.state.years.splice (index, 1, year);
					this.setState ( { years: this.state.years }  );
				 }  
	         }  );

	        this.yearRefChanged = firebase.database().ref().child ('user-year/' + nextProps.pageID);
	        this.yearRefChanged.on ("child_removed", snap =>  { 
	        	var year = snap.val();
				if (year) { 
					year.key = snap.ref.key;
					var index;
					for (var i = 0; i < this.state.years.length; i++) { 
						if (this.state.years[i].key == year.key) { 
							index = i;
						 }  
					 }  
					
					this.state.years.splice (index, 1);
					this.setState ( { years: this.state.years }  );
				 }  
	         }  );
    	    }  
	 }  ,
	handleClickAdd: function() { 
		this.setState ( { adding: true }  );
	 }  ,
	handleClickEdit: function(index) { 
		this.setState ( { editing: true }  );
		this.setState ( { indexToEdit: index }  );
	 }  ,
	handleClickSave: function() { 
		var yearData =  { 
			graduationyear: this.refs.graduationyear.value,
		 }  
		if(this.state.editing) { 
			var yearUpdate =  {  }  ;
			yearUpdate['/user-year/' + this.props.pageID + '/' + this.state.years[this.state.indexToEdit].key] = yearData;
			firebase.database().ref().update(yearUpdate);
		 }  else { 
			var newyearKey = firebase.database().ref().child('year').push().key;
			firebase.database().ref('/user-year/' + this.props.pageID + '/' + newyearKey).set(yearData);
		 }  
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleRemoveExisting: function() { 
		var yearRef = firebase.database().ref('user-year/' + this.props.pageID + '/' + this.state.years[this.state.indexToEdit].key);
		yearRef.remove();
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleClickCancel: function() { 
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	yearHeading: function() { 
		if(this.props.isCurrentUser) { 
			return <h4 className="profile-heading">Graduation Year <button className="btn btn-default" onClick= { this.handleClickAdd }  ><span className="glyphicon glyphicon-plus" title="Add year"></span></button></h4>
		 }  else { 
			return <h4 className="profile-heading">Graduation Year</h4>
		 }  
	 }  ,
	addingyear: function() { 
		return (
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="graduationyear" className="form-control" placeholder="Year"/><br />
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick= { this.handleClickSave }  >Save</button>
							<button className="btn btn-default" onClick= { this.handleClickCancel }  >Cancel</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	 }  ,
	editingyear: function() { 
		var indexedyear = this.state.years[this.state.indexToEdit];
		return (
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="graduationyear" className="form-control" defaultValue= { indexedyear.graduationyear }   /><br />
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick= { this.handleClickSave }  >Save</button>
							<button className="btn btn-default" onClick= { this.handleClickCancel }  >Cancel</button>
							<button className="btn btn-link" onClick= { this.handleRemoveExisting }  >Remove this year</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	 }  ,
	defaultyear: function() { 
		if(this.props.isCurrentUser) { 
			return(
				<div>
				 { this.state.years.map((year,index) => (
			        	<div key= { index }  >
		       			<h4><strong> { year.graduationyear }  </strong> <button className="btn btn-default" onClick= { this.handleClickEdit.bind(null, index) }  ><span className="glyphicon glyphicon-pencil" title="Edit year"></span></button></h4>
			       			
			       		</div>
			   		)) }  
				</div>
			)
		 }  else { 
			return(
				<div>
				 { this.state.years.map((year,index) => (
			        	<div key= { index }  >
			       			<h4><strong> { year.graduationyear }  </strong></h4>
			       			
			       		</div>
			   		)) }  
				</div>
			)
		 }  
	 }  ,
	render: function() { 
		var show;
		if(this.state.adding) { 
			show = this.addingyear();
		 }  else if(this.state.editing) { 
			show = this.editingyear();
		 }  else { 
			show = this.defaultyear();
		 }  
		return (
			<div>
				 { this.yearHeading() }  
				 { show }  
				<hr></hr>
			</div>
		)
	 }  ,
	componentWillUnmount: function() { 
		this.yearRef.off();
		this.yearRefChanged.off();
		this.yearRefRemoved.off();
	 }  ,
 }  );
module.exports = year;
