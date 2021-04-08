import axios from "axios"

const baseURL = "https://deckofcardsapi.com/api/deck"


const deckOfCardsApi = axios.create({
    baseURL
})



export default deckOfCardsApi