var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var course = React.createClass ( { 
	getInitialState: function() { 
		return { isCurrentUser: false, editing: false, courses: [], id: this.props.pageID }  ;
	 }  ,
	componentWillMount: function() { 
        this.courseRef = firebase.database().ref().child ('user-course/'+this.props.pageID);
        this.courseRef.on ("child_added", snap =>  { 
        	var course = snap.val();
			if (course) { 
				course.key = snap.ref.key;
				this.state.courses.push (course);
				this.setState ( { courses: this.state.courses }  );
			 }  
         }  );
        this.courseRefChanged = firebase.database().ref().child ('user-course/'+this.props.pageID);
        this.courseRefChanged.on ("child_changed", snap =>  { 
        	var course = snap.val();
			if (course) { 
				course.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.courses.length; i++) { 
					if (this.state.courses[i].key == course.key) { 
						index = i;
					 }  
				 }  
				this.state.courses.splice (index, 1, course);
				this.setState ( { courses: this.state.courses }  );
			 }  
         }  );
        this.courseRefRemoved = firebase.database().ref().child ('user-course/'+this.props.pageID);
        this.courseRefRemoved.on ("child_removed", snap =>  { 
        	var course = snap.val();
			if (course) { 
				course.key = snap.ref.key;
				var index;
				for (var i = 0; i < this.state.courses.length; i++) { 
					if (this.state.courses[i].key == course.key) { 
						index = i;
					 }  
				 }  
				this.state.courses.splice (index, 1);
				this.setState ( { courses: this.state.courses }  );
			 }  
         }  );
	 }  ,
	componentWillReceiveProps: function (nextProps) { 
		if (nextProps.pageID != this.state.id) { 
			this.courseRef.off();
			this.courseRefChanged.off();
			this.courseRefRemoved.off();
			this.setState ( { courses: [] }  );
			this.courseRef = firebase.database().ref().child('user-course/'+ nextProps.pageID);
	        this.courseRef.on("child_added", snap =>  { 
	        	var course = snap.val();
				if (course) { 
					course.key = snap.ref.key;
					this.state.courses.push (course);
					this.setState ( { courses: this.state.courses }  );
				 }  
	         }  );
	        this.courseRefChanged = firebase.database().ref().child ('user-course/' + nextProps.pageID);
	        this.courseRefChanged.on ("child_changed", snap =>  { 
	        	var course = snap.val();
				if (course) { 
					course.key = snap.ref.key;

					var index;
					for (var i = 0; i < this.state.courses.length; i++) { 
						if (this.state.courses[i].key == course.key) { 
							index = i;
						 }  
					 }  
					this.state.courses.splice (index, 1, course);
					this.setState ( { courses: this.state.courses }  );
				 }  
	         }  );

	        this.courseRefChanged = firebase.database().ref().child ('user-course/' + nextProps.pageID);
	        this.courseRefChanged.on ("child_removed", snap =>  { 
	        	var course = snap.val();
				if (course) { 
					course.key = snap.ref.key;
					var index;
					for (var i = 0; i < this.state.courses.length; i++) { 
						if (this.state.courses[i].key == course.key) { 
							index = i;
						 }  
					 }  
					
					this.state.courses.splice (index, 1);
					this.setState ( { courses: this.state.courses }  );
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
		var courseData =  { 
			degree: this.refs.degree.value,
			stream: this.refs.stream.value,
		 }  
		if(this.state.editing) { 
			var courseUpdate =  {  }  ;
			courseUpdate['/user-course/' + this.props.pageID + '/' + this.state.courses[this.state.indexToEdit].key] = courseData;
			firebase.database().ref().update(courseUpdate);
		 }  else { 
			var newcourseKey = firebase.database().ref().child('course').push().key;
			firebase.database().ref('/user-course/' + this.props.pageID + '/' + newcourseKey).set(courseData);
		 }  
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleRemoveExisting: function() { 
		var courseRef = firebase.database().ref('user-course/' + this.props.pageID + '/' + this.state.courses[this.state.indexToEdit].key);
		courseRef.remove();
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	handleClickCancel: function() { 
		this.setState ( { editing: false }  );
		this.setState ( { adding: false }  );
	 }  ,
	courseHeading: function() { 
		if(this.props.isCurrentUser) { 
			return <h4 className="profile-heading">Course <button className="btn btn-default" onClick= { this.handleClickAdd }  ><span className="glyphicon glyphicon-plus" title="Add course"></span></button></h4>
		 }  else { 
			return <h4 className="profile-heading">Course</h4>
		 }  
	 }  ,
	addingcourse: function() { 
		return (
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="degree" className="form-control" placeholder="Degree"/><br />
					<input type="text" ref="stream" className="form-control" placeholder="Stream"/><br />
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
	editingcourse: function() { 
		var indexedcourse = this.state.courses[this.state.indexToEdit];
		return (
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="degree" className="form-control" defaultValue= { indexedcourse.degree }   /><br />
					<input type="text" ref="stream" className="form-control" defaultValue= { indexedcourse.stream }  /><br />
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick= { this.handleClickSave }  >Save</button>
							<button className="btn btn-default" onClick= { this.handleClickCancel }  >Cancel</button>
							<button className="btn btn-link" onClick= { this.handleRemoveExisting }  >Remove this course</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	 }  ,
	defaultcourse: function() { 
		if(this.props.isCurrentUser) { 
			return(
				<div>
				 { this.state.courses.map((course,index) => (
			        	<div key= { index }  >
		       			<h4><strong> { course.degree }  </strong> <button className="btn btn-default" onClick= { this.handleClickEdit.bind(null, index) }  ><span className="glyphicon glyphicon-pencil" title="Edit course"></span></button></h4>
			       			<h5> { course.stream }  </h5>
			       		</div>
			   		)) }  
				</div>
			)
		 }  else { 
			return(
				<div>
				 { this.state.courses.map((course,index) => (
			        	<div key= { index }  >
			       			<h4><strong> { course.degree }  </strong></h4>
			       			<h5> { course.stream }  </h5>
			       		</div>
			   		)) }  
				</div>
			)
		 }  
	 }  ,
	render: function() { 
		var show;
		if(this.state.adding) { 
			show = this.addingcourse();
		 }  else if(this.state.editing) { 
			show = this.editingcourse();
		 }  else { 
			show = this.defaultcourse();
		 }  
		return (
			<div>
				 { this.courseHeading() }  
				 { show }  
				<hr></hr>
			</div>
		)
	 }  ,
	componentWillUnmount: function() { 
		this.courseRef.off();
		this.courseRefChanged.off();
		this.courseRefRemoved.off();
	 }  ,
 }  );
module.exports = course;
