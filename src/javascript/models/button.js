export default class Button {
    /////////////////////////////////////////////
    // Data                                    //
    /////////////////////////////////////////////

    static buttonAttributes = {
        inactive: ["disabled"],
        missing: ["disabled"],
        active: [],
        processing: ["disabled"]
    }

    static buttonClasses = {
        inactive: "bg-gray-200 border border-gray-400 text-[#273b4b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
        missing: "bg-rose-300 border border-rose-500 text-[#273b4b] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
        active: "cursor-pointer bg-[#273b4b] hover:bg-[#417a9b] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
        processing: "flex bg-[#273b4b] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    }

    static buttonContent = {
        inactive: "No image found!",
        missing: "Required assets missing!",
        active: "Generate Image"
    }

    /////////////////////////////////////////////
    // Constructor && Public Accessors         //
    /////////////////////////////////////////////

    #container
    #state
    #element

    constructor(container, state = "inactive") {
        this.#container = container
        this.#state = state
    }

    get element() { return this.#element }


    /////////////////////////////////////////////
    // Public Methods                          //
    /////////////////////////////////////////////

    show() {
        this.#container.innerHTML = ""
        this.#container.append(this.#button)

        this.#element = this.#container.firstElementChild

        return this
    }

    changeStateFor(newState) {
        if (!Object.keys(Button.buttonClasses).includes(newState)) return

        this.#state = newState
        this.show()

        return this
    }


    /////////////////////////////////////////////
    // Private Methods and Getters             //
    /////////////////////////////////////////////

    get #button() {
        const button = document.createElement("button")

        const classes = Button.buttonClasses[this.#state].split(" ")
        button.classList.add(...classes)
        
        Button.buttonAttributes[this.#state]?.map(attribute => {
            button.setAttribute(attribute, "")
        })

        button.innerHTML = this.#content

        return button
    }

    get #content() {
        return Button.buttonContent[this.#state] || this.#contentFromTemplate
    }

    get #contentFromTemplate() {
        const template = document.getElementById(`${this.#state}_button_template`).content
        const div = document.createElement("div")
        div.append(template)

        return div.innerHTML
    }
}
