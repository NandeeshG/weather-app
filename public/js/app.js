const baseurl = 'http://localhost:3000'
let weatherEndpoint = new URL('weather',baseurl)
const loadingP = document.getElementById('loading-p')

function weatherFetch(city,cb){
    let param = new URLSearchParams({city})
    let url = weatherEndpoint + '?' + param
    //let url = 'http://puzzle.mead.io/puzzle'
    loadingP.innerText = 'Loading...'
    fetch(url)
    .then((res)=>{
        loadingP.innerText = ''
        if(res.error){
            return cb(res.error)
        }
        res.json()
        .then((rj)=>{
            if(rj.error) return cb(rj.error)
            cb(null,rj)
        })
        .catch((err)=>cb('There was an Error!',err))
    })
    .catch((err)=>{
        loadingP.innerText = ''
        return cb('There was an Error!',err)
    })
}

const weatherForm = document.querySelector('form')
const cityQuery = document.getElementById('city')
const resultsContainer = document.getElementById('search-results')

weatherForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    weatherFetch(cityQuery.value, (err,res) => {
        if(err){
            loadingP.innerText = 'Can\'t Fetch, '+(err.code||err.cod||err.error||err)
        }else{
            const newD = document.createElement('div')

            const newH = document.createElement('h3')
            newH.innerText = res.summary
            newD.appendChild(newH)

            const newS = document.createElement('h5')
            newS.innerText = `(Lat,Long):(${res.latitude},${res.longitude})`
            newD.appendChild(newS)

            newD.style.border = '1px dotted grey';

            resultsContainer.prepend(newD)
        }
    })
})