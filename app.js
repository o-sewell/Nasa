
  const searchInput = document.querySelector('.search');
  const output = document.querySelector('.output')
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click',searchData)

  let media;

  async function searchData() {
    ufo.style.display = 'none';
    let search = searchInput.value;
    if(document.getElementById('image').checked) {
       media = 'image';
    } else if(document.getElementById('audio').checked) {
      media = 'audio';
    } else {
      console.log(media);
    }
    const finalData = await getData(search);
    render(finalData);
    searchInput.value = "";
  }

  function render(data) {
    let html;
    if(media == 'image') {
      html = data.map(result => {
        console.log(result);
        return `
          <div class="image">
            <img src="${result.links[0].href}" alt="${result.data[0].description}"/>
          </div>
       `
       }).join("");
     output.innerHTML = html;
    } else {
          const promises =  data.map(result => {
              return fetch(result.href)
              .then(blob => blob.json())
            });

          Promise.all(promises).then((results) => {
                 const audioFiles = [].concat.apply([], results);
                 const mp3 = audioFiles.filter(file => {
                  const regex = new RegExp(".mp3$");
                  return file.match(regex);
                 });

                 html = mp3.map(result => { 
                  return `
                    <audio controls>
                      <source src="${result}" type="audio/mpeg">
                    </audio>
                  `
                 }).join("");
                 output.innerHTML = html;
           });
  }

}

  function getData(search) {
    const endpoint = `https://images-api.nasa.gov/search?q=${search}&media_type=${media}`;

    return fetch(endpoint)
      .then(blob => blob.json())
      .then(data => data.collection.items);
  }


  const width = window.innerWidth;
  const height = window.innerHeight - 204 //height of container
  let x = 100;
  let y = 100;
  let xSpeed = 3;
  let ySpeed = 3.5;
  let globalId;

  const ufo = document.querySelector('.ufo');

  function repeatOften() {
    x = x + xSpeed;
    y = y + ySpeed;
    if( x > width || x < 0) {
      xSpeed = xSpeed * -1; //opposite direction 3 * -1 = -3.  -3 * -1 = 3
    }
    if( y > height || y < 0){
      ySpeed = ySpeed * -1;
    }
    ufo.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    globalID = requestAnimationFrame(repeatOften);
  }

  globalID = requestAnimationFrame(repeatOften);
