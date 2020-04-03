module.exports = class Loop {
  constructor(elements, start = -1) {
    this.elements = elements
    this.currentIndex = start
  }

  get() {
    return this.elements[this.currentIndex]
  }

  next() {
    this.currentIndex = this.currentIndex >= this.elements.length - 1 ? 0 : this.currentIndex + 1
    return this.get()
  }
}