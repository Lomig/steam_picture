import CssConverter from "./css_converter"
import fileSaver from "file-saver"
import api from "../secret/htmlcsstoimage"

export default class ImageDownloader {
  /////////////////////////////////////////////
  // Constructor && Public Accessors         //
  /////////////////////////////////////////////
  
  #container
  #template
  #button
  #cssConverter
  #image
  
  constructor(container, template, button) {
    this.#container = container
    this.#template = template
    this.#button = button
    this.#cssConverter = new CssConverter()
  }
  
  
  /////////////////////////////////////////////
  // Public Methods                          //
  /////////////////////////////////////////////
  
  createImage(assets) {
    const { backgroundImageUrl, logoImageUrl, logoPosition, logoWidth, logoHeight } = assets
    
    const picture = document.importNode(this.#template.content, true)
    const pictureBackground = picture.getElementById("picture_background")
    const pictureLogoContainer = picture.getElementById("logo_container")
    const pictureLogo = picture.getElementById("picture_logo")
    
    pictureBackground.src = backgroundImageUrl
    pictureLogoContainer.classList.add(logoPosition)
    pictureLogo.src = logoImageUrl
    pictureLogo.style.maxWidth = `${logoWidth}%`
    pictureLogo.style.maxHeight = `${logoHeight}%`
    
    this.#container.appendChild(picture)
    this.#image = true
    
    return this
  }
  
  async processImage() {
    if (!this.#image) return

    this.#button.changeStateFor("processing")
    const imageUrl = await this.#sendDataToAPI()
    
    await this.#download(imageUrl)
    window.close()
    
    return this
  }
  
  
  /////////////////////////////////////////////
  // Private Methods                         //
  /////////////////////////////////////////////
  
  async #sendDataToAPI() {
    const response = await fetch(api.url,
      {
        method: 'POST',
        body: this.#body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.#credentials
        }
      }
    )
    
    if (!response.ok) throw new Error(`Error: ${response.status}`)
    
    const result = await response.json()
    return result.url
  }
    
  async #download(url) {
    fileSaver.saveAs(url, "steam_picture.png")
    
    await this.#sleep(2000)
  }
  
  async #sleep(duration) {
    await new Promise(f => setTimeout(f, duration))
  }
    
    
  /////////////////////////////////////////////
  // Private Getters                         //
  /////////////////////////////////////////////
  
  get #body() {
    return JSON.stringify({
      html: this.#container.innerHTML,
      css: this.#cssConverter.toString()
    })
  }
  
  get #credentials() {
    const userID = api.userID
    const apiKey = api.key
    const encodedID = btoa(`${userID}:${apiKey}`)
    
    return `Basic ${encodedID}`
  }
}
  