//helper variables
let apiConfigG = {
	dataType: "JSON",
	method: "GET",
	error: (err) => console.log('error', err)
}
let eventAPIKey = "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
//event listener for submitting the form
const listenForSubmit = () => {
	$('#search-form').submit('#search-button', function(e) {
		e.preventDefault();
		//get values for the artist and title from form		
		let artist = $('#artist').val();
		let title = $('#title').val();
		//reset the form for UX/UI
		$('#artist').val('');
		$('#title').val('');
		//call for artist and lyrics
		getLyrics(artist, title);
		getArtist(artist);
		//swing in animation for lyrics and tickets
		$('#lyric-bg').show(800, "swing");
		$('#event-bg').show(800, "swing");
	});	
}
const getLyrics = (artist, title) => {
	const settings = {
		url:`https://api.lyrics.ovh/v1/${artist}/${title}`,
		success: data => renderLyrics(data, artist, title)
	};
	// combine the standard api object with the new settings 
	let configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
//call api for artist id. You need to provide an artist name, usually exact match.
const getArtistID = (artist) => {
	const settings = {
		url: "https://app.ticketmaster.com/discovery/v2/attractions",
		data: {
			keyword: artist,
			apikey: eventAPIKey
		},
		async: true,
		success: data => getEvents(data._embedded.attractions[0].id;)
	};
	// combine the standard api object with the new settings 
	let configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
const getEvents = (artistId) => {
	const settings = {
		url: "https://app.ticketmaster.com/discovery/v2/events",
		data: {
				attractionId: artistId,
				apikey: eventAPIKey
			   },
		async: true,
		success: data => renderEvents(data)
	};
	// combine the standard api object with the new settings 
	var configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
//render the artist events
const renderEvents = data => {
	if(data.page.totalElements === 0) {
		const noEvent = noEvents();
		$('#event-area').append(noEvent);
	} else {
		const event = data._embedded.events.map(item=>  `
			<div class="events">
				<p class="date">${item.dates.start.localDate}</p>
				<a href="${item.url}" target="_blank"><img src="${item.images[0].url}" alt="${item.name}" name="${item.id}" class="images"></a>
				<p class="event-info"><b>${item.name}</b><br></p>
				<p class="event-info">${item._embedded.venues[0].city.name},<br>${item._embedded.venues[0].country.name}</p>
			</div>
		`)
		$('#event-area').append(event)
	};	
}
//parse the lyrics
const renderLyrics = (data, artist, title) => {
	//lyrics come in a single string of text, so we split by linebreak and then enclose a p element wrapped around the line
	let splitLyric 	 = data.lyrics.split(/\n/).map(item => `<p class="lyric-info">${item}</p>`);
	//create header for artist
	let header = `
		<div class="lyrics">
			<h2 class="artist-name">Lyrics for ${artist}!</h2>
			<h3 class="title-name">${title}
			<div id="lyric-area" />
		</div>
	`;
	
	$('#lyric-bg').html(header)
	$('#lyric-area').html(splitLyric);
}

$(listenForSubmit)
