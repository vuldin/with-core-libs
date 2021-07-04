let count = 0

export default function uid(winLoc) {
  function Id(id) {
    this.id = id
    this.href = new URL(`#${id}`, winLoc)
  }

  Id.prototype.toString = function () {
    return `url(${this.href})`
  }

  return new Id(`uid-${++count}`)
}
