//listen for form submit
function listenForSubmit() {
	$('#search-form').submit('#search-button', function(e) {
		e.preventDefault();
		console.log('button squelched');
		
		let artist = $('#artist').val();
		let title = $('#title').val();
		
		$('#artist').val('');
		$('#title').val('');

		console.log('got values', artist,",", title);
		getLyrics(artist, title);
		getArtist(artist);

		});
}

var apiConfigG = {
				  dataType: "JSON",
				  method: "GET",
				  error: () =>
					console.log(arguments)
			 	  };


//send lyric api data
function getLyrics(artist, title) {
	const settings = {
		url:"https://api.lyrics.ovh/v1/"+artist+"/"+title,
		success: data => 
						(console.log("success", data),
						displayLyrics(data))
		}
	var configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
//send tm event api data
function getArtist(artist) {
	const settings = {
		url: "https://app.ticketmaster.com/discovery/v2/attractions",
		data: {
			keyword: artist,
			apikey: "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
		},
		async: true,
		dataType: "JSON",
		method:"GET",
		success: function (data) {
			console.log("success", data);
			sendArtist(data);
		},
		error: function() {
			console.log(arguments);
		}
	};
	$.ajax(settings)
}
function getEvents(artist) {
	const settings = {
		url: "https://app.ticketmaster.com/discovery/v2/events",
		data: {
			attractionId: artist,
			apikey: "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
		},
		async: true,
		dataType: "JSON",
		method:"GET",
		success: function (data) {
			console.log("success", data);
		displayEvents(data);
		},
		error: function() {
			console.log(arguments);
		}
	};
	$.ajax(settings)
}
//render lyrics
function renderLyrics(item, artist) {
	return `
	<p class="lyric-info">${item}</p>`
}
function renderHeader(artist) {
	console.log('rendering header');
	return `
		<div class="lyrics">
		<h2 class="artist">${artist}</h2>
		</div>`
}
//render events
function renderEvents(item) {
	console.log('trying to render event');
	return `
	<div class="events">

	<a href="${item.url}" target="_blank"><img src="${item.images[0].url}" alt="${item.name}" name="${item.id}" class="images"></a>
	<p class="event-info">${item.name}<br></p>
	<p class="event-info">${item._embedded.venues[0].city.name},<br>${item._embedded.venues[0].country.name}</p>
	</div>`
}
function noEvents() {
	console.log('no events')
	return `
	<div class="events">
	<h2 class="no-info">There are no available events through Ticket Master</h2>
	</div>`
}
//display lyrics and events
function sendArtist(data) {
	console.log('got artist now grabbing events');
	const artist = data._embedded.attractions[0].id;
	getEvents(artist);
}
function displayEvents(data) {
	console.log('displaying data');
	if(data.page.totalElements === 0) {
		const noEvent = noEvents();
		$('#event-area').html(noEvent);
	} else {
		const event = data._embedded.events.map(item=> renderEvents(item))
		$('#event-area').html(event)
	};
	
}
function displayLyrics(data, artist) {
	console.log('displaying lyrics for', artist);
	let splitLyric 	 = data.lyrics.split(/\n/).map(item => renderLyrics(item));
	console.log(splitLyric);


	
	$('#lyric-area').html(renderHeader(artist));
	const lyric = data.lyrics;
	$('#lyric-area').html(splitLyric);
	console.log(lyric);

}
function loadCallbacks() {
	listenForSubmit();
}
$(loadCallbacks)