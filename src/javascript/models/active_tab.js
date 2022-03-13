export default class ActiveTab {
    /////////////////////////////////////////////
    // Constructor && Public Accessors         //
    /////////////////////////////////////////////

    #isValidPage
    #activeTab

    get isValid() { return this.#isValidPage }

    /////////////////////////////////////////////
    // Public Methods                          //
    /////////////////////////////////////////////

    async connect() {
      this.#isValidPage = true
      this.#activeTab = await this.#retrieveActiveTab()
      const urlPattern = new URLPattern("/app/:id(\\d+)/info/?", "https://steamdb.info")

      if (urlPattern.test(this.#activeTab.url)) return this

      this.#isValidPage = false
      return this
    }

    async getAssets() {
      if (!this.#isValidPage) return null

      return await this.#retrieveAssetsOnActiveTab()
    }

    /////////////////////////////////////////////
    // Private Methods and Getters             //
    /////////////////////////////////////////////

    async #retrieveActiveTab() {
        return new Promise((resolve, reject) => {
            try {
                chrome.tabs.query(
                  { active: true, currentWindow: true },
                  (result) => {
                    if (chrome.runtime.lastError) return reject(chrome.runtime.lastError)
                    
                    resolve(result[0])
                  })
            } catch (error) {
              reject(error)
            }
        })
    }

    async #retrieveAssetsOnActiveTab() {
      return new Promise((resolve, reject) => {
        try {
          chrome.scripting.executeScript(
            { target: { tabId: this.#activeTab.id }, func: evaluateAssetXPaths },
            (result) => resolve(result[0].result))
        } catch (error) {
          reject(error)
        }
      })
    }
  }

  // Chrome Extension Scripting Callback

  evaluateAssetXPaths = () => {
    let xpath = "//a[text()='library_hero.jpg']"
    const backgroundImageUrl = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href
    
    xpath = "//a[text()='logo.png']"
    const logoImageUrl = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href

    xpath = "//td[text()='logo_position/pinned_position']/following-sibling::td"
    const logoPosition = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText

    xpath = "//td[text()='logo_position/width_pct']/following-sibling::td"
    const logoWidth = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText

    xpath = "//td[text()='logo_position/height_pct']/following-sibling::td"
    const logoHeight = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText

    return { backgroundImageUrl, logoImageUrl, logoPosition, logoWidth, logoHeight }
  }
