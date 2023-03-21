//import './map-component'
import './styles/main.scss'


document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('easy-it-map')
    const addressText = document.querySelector('.address-text')

    map.addEventListener('address', (e) => {
        const {address} = e.detail
        //console.log(address)
        addressText.textContent = address.display_name
    })

    map.addEventListener('coordinates', (e) => {
        const {coordinates} = e.detail
        //console.log(coordinates)
        if(coordinates?.length){
            const address = coordinates[0]
            map.setAttribute('lon', address.lon)
            map.setAttribute('lat', address.lat)
        }
    })
})
