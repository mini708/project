var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;


var opportunity = React.createClass ( { 
	getInitialState: function() { 
		return { isCurrentUser: false, editing: false, opportunities: [], id: this.props.pageID }  ;
	 }  ,
	componentWillMount: function() { 
        this.opportunityRef = firebase.database().ref().child ('user-opportunity/'+this.props.pageID);
        this.opportunityRef.on ("child_added", snap =>  { 
        	var opportunity = snap.val();
			if (opportunity) { 
				opportunity.key = snap.ref.key;
				this.state.opportunities.push (opportunity);
				this.setState ( { opportunities: this.state.opportunities }  );
			 }  
         }  );
        this.opportunityRefChanged = firebase.database().ref().child ('user-opportunity/'+this.props.pageID);
        this.opportunityRefChanged.on ("child_changed", snap =>  { 
        	var opportunity = snap.val();
			if (opportunity) { 
				opportunity.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.opportunities.length; i++) { 
					if (this.state.opportunities[i].key == opportunity.key) { 
						index = i;
					 }  
				 }  
				this.state.opportunities.splice (index, 1, opportunity);
				this.setState ( { opportunities: this.state.opportunities }  );
			 }  
         }  );
        this.opportunityRefRemoved = firebase.database().ref().child ('user-opportunity/'+this.props.pageID);
        this.opportunityRefRemoved.on ("child_removed", snap =>  { 
        	var opportunity = snap.val();
			if (opportunity) { 
				opportunity.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.opportunities.length; i++) { 
					if (this.state.opportunities[i].key == opportunity.key) { 
						index = i;
					 }  
				 }  
				this.state.opportunities.splice (index, 1);
				this.setState ( { opportunities: this.state.opportunities }  );
			 }  
         }  );
	 }  ,
	componentWillReceiveProps: function (nextProps) { 
		if (nextProps.pageID != this.state.id) { 
			this.opportunityRef.off();
			this.opportunityRefChanged.off();
			this.opportunityRefRemoved.off();
			this.setState ( { opportunities: [] }  );
			this.opportunityRef = firebase.database().ref().child('user-opportunity/'+ nextProps.pageID);
	        this.opportunityRef.on("child_added", snap =>  { 
	        	var opportunity = snap.val();
				if (opportunity) { 
					opportunity.key = snap.ref.key;
					this.state.opportunities.push (opportunity);
					this.setState ( { opportunities: this.state.opportunities }  );
				 }  
	         }  );
	        this.opportunityRefChanged = firebase.database().ref().child ('user-opportunity/' + nextProps.pageID);
	        this.opportunityRefChanged.on ("child_changed", snap =>  { 
	        	var opportunity = snap.val();
				if (opportunity) { 
					opportunity.key = snap.ref.key;

					var index;
					for (var i = 0; i < this.state.opportunities.length; i++) { 
						if (this.state.opportunities[i].key == opportunity.key) { 
							index = i;
						 }  
					 }  
					this.state.opportunities.splice (index, 1, opportunity);
					this.setState ( { opportunities: this.state.opportunities }  );
				 }  
	         }  );

	        this.opportunityRefChanged = firebase.database().ref().child ('user-opportunity/' + nextProps.pageID);
	        this.opportunityRefChanged.on ("child_removed", snap =>  { 
	        	var opportunity = snap.val();
				if (opportunity) { 
					opportunity.key = snap.ref.key;
					var index;
					for (var i = 0; i < this.state.opportunities.length; i++) { 
						if (this.state.opportunities[i].key == opportunity.key) { 
							index = i;
						 }  
					 }  
					
					this.state.opportunities.splice (index, 1);
					this.setState ( { opportunities: this.state.opportunities }  );
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
		var opportunityData =  { 
			location: this.refs.location.value,
			outcome: this.refs.outcome.value,
			process: this.refs.process.value
		 }  
		if(this.state.editing) { 
			var opportunityUpdate =  {  }  ;
			opportunityUpdate['/user-opportunity/' + this.props.pageID + '/' + this.state.opportunities[this.state.indexToEdit].key] = opportunityData;
			firebase.database().ref().update(opportunityUpdate);
		 }  else { 
			var newopportunityKey = firebase.database().ref().child('opportunity').push().key;
			firebase.database().ref('/user-opportunity/' + this.props.pageID + '/' + newopportunityKey).set(opportunityData);
		 }  
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleRemoveExisting: function() { 
		var opportunityRef = firebase.database().ref('user-opportunity/' + this.props.pageID + '/' + this.state.opportunities[this.state.indexToEdit].key);
		opportunityRef.remove();
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleClickCancel: function() { 
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	opportunityHeading: function() { 
		if(this.props.isCurrentUser) { 
			return <h4 className="profile-heading">Opportunity Listing<button className="btn btn-default" onClick= { this.handleClickAdd }  ><span className="glyphicon glyphicon-plus" title="Add opportunity"></span></button></h4>
		 }  else { 
			return <h4 className="profile-heading">Opportunity Listing</h4>
		 }  
	 }  ,
	addingopportunity: function() { 
		var show;
		return (
			
			<div className="col-md-12">

				<div className="col-md-8">
					
					<input type="text" ref="location" className="form-control" placeholder="Location"/><br />
					<input type="text" ref="outcome" className="form-control" placeholder="Program Outcome"/><br />
					<textarea className="form-control" rows="6" style= {  { width: '100%' }   }   ref="process" placeholder="Step Wise Process" /><br/>
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
	editingopportunity: function() { 
		var indexedopportunity = this.state.opportunities[this.state.indexToEdit];
		return (
			<div className="col-md-12">
				
				<div className="col-md-8">
					<input type="text" ref="location" className="form-control" defaultValue= { indexedopportunity.location }   /><br />
					<input type="text" ref="outcome" className="form-control" defaultValue= { indexedopportunity.outcome }  /><br />
					<textarea className="form-control" rows="6" style= {  { width: '100%' }   }   ref="process" defaultValue= { indexedopportunity.process }  /><br/>
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick= { this.handleClickSave }  >Save</button>
							<button className="btn btn-default" onClick= { this.handleClickCancel }  >Cancel</button>
							<button className="btn btn-link" onClick= { this.handleRemoveExisting }  >Remove this opportunity</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	 }  ,
	defaultopportunity: function() { 
		if(this.props.isCurrentUser) { 
			return(
				<div>
				 { this.state.opportunities.map((opportunity,index) => (
			        	<div key= { index }  >
		       			<h4><strong> { opportunity.location }  </strong> <button className="btn btn-default" onClick= { this.handleClickEdit.bind(null, index) }  ><span className="glyphicon glyphicon-pencil" title="Edit opportunity"></span></button></h4>
			       			<h5> { opportunity.outcome }  </h5>
			       			
			       			<h6><pre style= {  { margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap" }   }  > { opportunity.process }  </pre></h6>
			       		</div>
			   		)) }  
				</div>
			)
		 }  else { 
			return(
				<div>
				 { this.state.opportunities.map((opportunity,index) => (
			        	<div key= { index }  >
			       			<h4><strong> { opportunity.location }  </strong></h4>
			       			<h5> { opportunity.outcome }  </h5>
			       			
			       			<h6><pre style= {  { margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap" }   }  > { opportunity.process }  </pre></h6>
			       		</div>
			   		)) }  
				</div>
			)
		 }  
	 }  ,
	render: function() { 
		var show;
		
		if(this.state.adding) { 
			
			show = this.addingopportunity();
			
			
		 }  else if(this.state.editing) { 
			show = this.editingopportunity();
		 }  else { 
			show = this.defaultopportunity();
		 }  
		return (
			<div>
				 { this.opportunityHeading() }  
				 { show }  
				<hr></hr>
			</div>
		)
	 }  ,
	componentWillUnmount: function() { 
		this.opportunityRef.off();
		this.opportunityRefChanged.off();
		this.opportunityRefRemoved.off();
	 }  ,
 }  );
module.exports = opportunity;
