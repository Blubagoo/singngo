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
						displayLyrics(data, artist, title))
					  };

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
						success: data => (console.log("success", data),
										  redirectToApi(data))
					  };

	var configApi = Object.assign({}, apiConfigG, settings);
	$.ajax(configApi);
}
function getEvents(artist) {
	const settings = {
						url: "https://app.ticketmaster.com/discovery/v2/events",
						data: {
								attractionId: artist,
								apikey: "foT0mqx1A21ZxgjogM48Svp5vNF7gbgy"
							   },
						async: true,
						success: data => (console.log("success", data),
						    displayEvents(data))
					 };

	var configApi = Object.assign({}, apiConfigG, settings);
	
	$.ajax(configApi);
}

//display lyrics and events
function redirectToApi(data) {
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
		const event = data._embedded.events.map(item=>  `<div class="events">
														<a href="${item.url}" target="_blank"><img src="${item.images[0].url}" alt="${item.name}" name="${item.id}" class="images"></a>
														<p class="event-info">${item.name}<br></p>
														<p class="event-info">${item._embedded.venues[0].city.name},<br>${item._embedded.venues[0].country.name}</p>
														</div>`)
		$('#event-area').html(event)
	};	
}

function displayLyrics(data, artist, title) {
	console.log('displaying lyrics for', artist);
	let splitLyric 	 = data.lyrics.split(/\n/).map(item => `<p class="lyric-info">${item}</p>`);
	console.log(splitLyric);

	var header = `<div class="lyrics">
				<h2 class="artist">${artist} - ${title} </h2>
				</div>`;
	
	$('#lyric-area').html(header)
	$('#lyric-area').append(splitLyric);
}

$(listenForSubmit)
