export default class CssConverter {
  /////////////////////////////////////////////
  // Public Methods                          //
  /////////////////////////////////////////////
  
  toString() {
    return Array.prototype
    .reduce
    .call(document.styleSheets, this.#rulesFromStylesheet.bind(this), [])
    .join("\n")
  }
  
  
  /////////////////////////////////////////////
  // Private Methods and Getters             //
  /////////////////////////////////////////////
  
  #rulesFromStylesheet(collection, stylesheet) {
    Array.prototype.reduce.call(stylesheet.cssRules, this.#addIndividualRulesInCollection.bind(this), collection)
    return collection
  }
  
  #addIndividualRulesInCollection(collection, rule) {
    collection.push(rule.cssText)
    return collection
  }
}
