var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Regular = React.createClass({
	
	// Initially get a couple of posts from the API
	loadPostsFromServer: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function( data ) {
				this.setState( { data: data } );
			}.bind( this ),
		});
	},

	// Deal with the user clicking on the next post link
	handleChangePost: function( e ) {
		var nextPostUrl = 'http://wp-api.dev/wp-json/wp/v2/posts/' + e.target.getAttribute( 'data-post-id' ) + '?_embed';
		$.ajax({
			url: nextPostUrl,
			dataType: 'json',
			cache: false,
			success: function( data ) {
				var currentPost = this.state.data.pop();
				var posts = [
					currentPost,
					data
				];
				this.setState( { data: posts } );
				window.scrollTo(0, 0);
			}.bind( this ),
		});
	},

	// React component lifecycle methods
	getInitialState: function() {
		return { data: [] };
	},

	componentDidMount: function() {
		this.loadPostsFromServer();
	},

	render: function() {
		var post = this.state.data[0],
			nextPost = this.state.data[1];
		
		if ( !post ) {
			return null;
		}

		var featuredImage = post._embedded['wp:featuredmedia'][0].media_details.sizes['post-thumbnail'].source_url;
		var nextFeaturedImage = nextPost._embedded['wp:featuredmedia'][0].media_details.sizes['post-thumbnail'].source_url;

		return (
			<div className="regular-container">
				<ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					<div key={ post.id }>
						<article>
							<div className="big-image" style={{ backgroundImage: 'url(' + featuredImage + ')' }}>
							</div>
							<div className="content">
								<h1>{ post.title.rendered }</h1>
								<div className="entry-content" dangerouslySetInnerHTML={ {__html: post.content.rendered} } />
							</div>
						</article>
						<article>
							<div className="big-image" data-post-id={nextPost.previous_post} onClick={this.handleChangePost} style={{ backgroundImage: 'url(' + nextFeaturedImage + ')' }}>
								<div className="text">
									<h2>Read Next</h2>
								</div>
							</div>
						</article>
					</div>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});

// Kick the whole thing off
ReactDOM.render(
	<Regular url="http://wp-api.dev/wp-json/wp/v2/posts?filter[posts_per_page]=2&_embed" />,
	document.getElementById('main')
);
