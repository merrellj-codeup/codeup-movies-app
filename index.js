import favorites from 'https://merrellj-codeup.github.io/codeup-movies-app/favorites.js'

console.log(favorites);

$(document).ready(function(){
	let zindex=10;
	$('[data-featured="center"]').nextAll().each(function(){
    $(this).css('z-index', zindex);
    zindex--;
  });
});
$('.featured-movie-3d-parent[data-movie]').each(async function(){
    try {
    let movieID = $(this).attr('data-movie');
    let movie = await getMovie(movieID);
    $(this).find('.movie-poster').attr('src', `https://image.tmdb.org/t/p/original${movie.poster_path}`)
    $(this).find('.movie-poster').attr('srcset', '');
    $(this).find('h3').text(movie.original_title);
    $(this).find('.featured-movie-description').text(movie.overview);
    let moreActorsCount = 0;
    let cast = movie.credits.cast.map((actor, index) => {
      if (index > 4){
        moreActorsCount++;
        if (index == (movie.credits.cast.length - 1) ) {
          let moreCountCircle = `
            <div class="cast-avatar-wrapper more">
              <div>${moreActorsCount}+</div>
            </div>`;
          return moreCountCircle;
        }
        return
      }
      else {
        let actorProfile = `
          <div class="cast-avatar-wrapper">
            <img src="https://image.tmdb.org/t/p/original${actor.profile_path}" alt="${actor.name}" class="cast-avatar" />
          </div>`;
        return actorProfile;
      }
    });
    $(this).find('.cast-wrapper').html(cast);
  }
  catch(err){
      console.log(err);
  }
  finally{
      $('.featured-movie-3d-parent').css('opacity', '100');
  }
});

$(document).on('click', '.featured-movie-3d-parent', function(){
	$(this).attr('data-featured', 'center');
	if ($(this).hasClass('left')){
  	let zindex = 10;
  	$(this).nextAll().each(function(){
    	$(this).attr('data-featured', '');
    	$(this).addClass('right');
      $(this).css('z-index', zindex);
      zindex--;
      $(this).children('.featured-movie-3d-child').addClass('right');
      $(this).removeClass('left');
      $(this).children('.featured-movie-3d-child').removeClass('left');
    });
  }
  else if ($(this).hasClass('right')){
    $(this).prevAll().each(function(){
    	$(this).attr('data-featured', '');
    	$(this).addClass('left')
      $(this).children('.featured-movie-3d-child').addClass('left');
      $(this).removeClass('right');
      $(this).children('.featured-movie-3d-child').removeClass('right');
    });
  }
  $(this).css('z-index', '11');
  $(this).removeClass('right');
  $(this).children('.featured-movie-3d-child').removeClass('right');
  $(this).removeClass('left');
  $(this).children('.featured-movie-3d-child').removeClass('left');
});
$("body").keydown(function(e) {
  if(e.keyCode == 37) { // left
    $('[data-featured="center"').prev().trigger('click');
  }
  else if(e.keyCode == 39) { // right
    $('[data-featured="center"').next().trigger('click');
  }
});

async function getMovie(movie){
	let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
	try{
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movie}?api_key=d3e85c6064ec3b6bcf9edb311f42c917`, requestOptions);
    let data = await response.text();
    data = JSON.parse(data);
    console.log(data)
    let credits = await getMovieCredits(movie);
    //console.log(credits);
    data.credits = credits;
    console.log(data)
    let videos = await getMovieVideos(movie);
    data.videos = videos;
    console.log(data);
    return data;
  }
  catch(err){
  	console.log(err);
  }
}

async function getMovieCredits(movie){
	let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
	try{
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movie}/credits?api_key=d3e85c6064ec3b6bcf9edb311f42c917`, requestOptions);
    let data = await response.text();
    data = JSON.parse(data);
    //console.log(data);
    return data;
  }
  catch(err){
  	console.log(err);
  }
}

async function getMovieVideos(movie){
	let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
	try{
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movie}/videos?api_key=d3e85c6064ec3b6bcf9edb311f42c917`, requestOptions);
    let data = await response.text();
    data = JSON.parse(data);
    //console.log(data);
    return data;
  }
  catch(err){
  	console.log(err);
  }
} 