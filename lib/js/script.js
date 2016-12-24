( function( $ ) {
	$(document).ready( function() {
		showTitles( siteData.siteUrl + '/wp-json/wp/v2/posts?per_page=10', showPostContent );
	});

	function showTitles( postsUrl, showPostContent ) {
		var output = '';
		var blogContainer = $( '.blog .site-main' );
		$.ajax({
			url: postsUrl,
			data: {},
			type: 'GET',
			dataType: 'json',
			beforeSend: function(){
				$('.loading').fadeIn();
			},
			complete: function(){
			    $('.loading').fadeOut();
			},
		})
		.done( function( json ) {
			for( var i = 0; i < json.length; i++ ) {
				output += '<div class="post-item"><h2 class="entry-title"><a href="' + json[i].link + '" data-id="' + json[i].id + '">' + json[i].title.rendered + '</a></h2></div>'
			}
			output += '<div class="overlay"></div><div class="entry-content"><div class="post-close"></div><div class="post-content"></div></div>'
			blogContainer.html( output );
			showPostContent();
		});
	}

	function showPostContent() {
		var entryTitle = $( '.blog .entry-title a' );
		var entryContent = $( '.blog .entry-content' );
		var postContent = $( '.blog .post-content' );
		var overlay = $( '.blog .overlay' );
		var body = $( 'body' );
		entryTitle.click( function( e ) {
			e.preventDefault();
			var post_id = $( this ).attr( 'data-id' );
			$.ajax({
				url: siteData.siteUrl + '/wp-json/wp/v2/posts/' + post_id + '?_embed',
				data: {},
				type: 'GET',
				dataType: 'json',
				beforeSend: function(){
				$('.loading').fadeIn();
			},
			complete: function(){
			    $('.loading').fadeOut();
			},
			})
			.done( function( json ) {
				entryContent.addClass( 'scale-up');
				var output = '';
				if( json._embedded['wp:featuredmedia'] != undefined ) {
					output += 
					`<div
						class="single-post-thumbnail"
						style="background: url('` + json._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url + `')"
					>
					<img src="` + json._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url + `">
					</div>`;
				}
				output += '<h2 class="single-post-title">' + json.title.rendered + '</h2>';
				output+= '<h4 class="single-post-meta">Posted by: <img class="gravatar" src="' + json._embedded.author[0].avatar_urls['48'] + '"><a href="' + json._embedded.author[0].link + '">' + json._embedded.author[0].name + '</a></h4>'
				output += json.content.rendered;
				postContent.html( output );
				overlay.fadeIn( 300 );
				body.css( 'overflow', 'hidden' );
			});
		});
		closePost();
	}

	function closePost() {
		var closeButton = $( '.post-close' );
		var entryContent = $( '.blog .entry-content' );
		var overlay = $( '.blog .overlay' );
		var body = $( 'body' );
		closeButton.click( function() {
			entryContent.removeClass( 'scale-up' );
			overlay.fadeOut( 300 );
			body.css( 'overflow', 'auto' );
		});
	}

})( jQuery );
