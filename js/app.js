var apiConfigG = {
				  dataType: "JSON",
				  method: "GET",
				  error: () =>
					console.log(arguments)
			 	  };

//listen for form submit, taking values and running function to send api calls
function listenForSubmit() {
	$('#search-form').submit('#search-button', function(e) {
		
		e.preventDefault();
				
		let artist = $('#artist').val();
		let title = $('#title').val();
		
		$('#artist').val('');
		$('#title').val('');

		getLyrics(artist, title);
		getArtist(artist);
		
		$('#lyric-bg').show(800, "swing");
		$('#event-bg').show(800, "swing");
		});
}



//send lyric api data
function getLyrics(artist, title) {
	const settings = {
						url:`https://api.lyrics.ovh/v1/${artist}/${title}`,
						success: data => displayLyrics(data, artist, title)
					  };

	var configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
//call to api with artist search, redirecting back the artist id
function getArtist(artist) {
	const settings = {
						url: "https://app.ticketmaster.com/discovery/v2/attractions",
						data: {
								keyword: artist,
								apikey: "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
					  		  },
						async: true,
						success: data => redirectToApi(data)
					  };

	var configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
//artist id collected and response made
function redirectToApi(data) {
	const artistId = data._embedded.attractions[0].id;
	getEvents(artistId);
}
//api call with artist id to ticketmaster
function getEvents(artistId) {
	const settings = {
						url: "https://app.ticketmaster.com/discovery/v2/events",
						data: {
								attractionId: artistId,
								apikey: "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
							   },
						async: true,
						success: data => displayEvents(data)
					 };

	var configApi = Object.assign({}, apiConfigG, settings);
	
	$.ajax(configApi);
}
//display events for artist
function displayEvents(data) {
	if(data.page.totalElements === 0) {
		const noEvent = noEvents();
		$('#event-area').append(noEvent);
	} else {
		const event = data._embedded.events.map(item=>  `<div class="events">
														<p class="date">${item.dates.start.localDate}</p>
														<a href="${item.url}" target="_blank"><img src="${item.images[0].url}" alt="${item.name}" name="${item.id}" class="images"></a>
														<p class="event-info"><b>${item.name}</b><br></p>
														<p class="event-info">${item._embedded.venues[0].city.name},<br>${item._embedded.venues[0].country.name}</p>
														</div>`)
		$('#event-area').append(event)
	};	
}
//parse the lyrics from api
function displayLyrics(data, artist, title) {
	let splitLyric 	 = data.lyrics.split(/\n/).map(item => `<p class="lyric-info">${item}</p>`);
	//create header for artist
	var header = `<div class="lyrics">
				<h2 class="artist-name">Lyrics for ${artist}!</h2>
				<h3 class="title-name">${title}
				<div id="lyric-area">
				</div>
				</div>`;
	
	$('#lyric-bg').html(header)
	$('#lyric-area').html(splitLyric);
}

$(listenForSubmit)
