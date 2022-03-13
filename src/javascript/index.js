import Button from "./models/button"
import ImageDownloader from "./models/image_downloader"
import ActiveTab from "./models/active_tab"


const openSteamDB = (event, activeTab) => {
  event.preventDefault()

  const steamID = document.getElementById("steam_id").value
  const url = `https://steamdb.info/app/${steamID}/info/`
  
  chrome.tabs.update(activeTab.id, { url: url })
}

const initialize = async () => {
  const buttonContainer = document.getElementById("button_container")
  const button = new Button(buttonContainer)

  const activeTab = await (new ActiveTab).connect()

  const form = document.querySelector("form")
  form.addEventListener("submit", (event) => { openSteamDB(event, activeTab) })

  if (!activeTab.isValid) return button.changeStateFor("inactive")
  
  const assets = await activeTab.getAssets()
  if (!assets) return button.changeStateFor("missing")

  button.changeStateFor("active")
  const pictureContainer = document.getElementById("picture_container")
  const pictureTemplate = document.getElementById("picture_template")
  const downloader = new ImageDownloader(pictureContainer, pictureTemplate, button)

  button.element.addEventListener("click", () => {
    downloader.createImage(assets)
              .processImage()
  })
}

initialize()
