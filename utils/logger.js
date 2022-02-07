const info = (...params) => {
    console.log(...params)
}

const error = (...params) => {
    console.log("========ERROR========")
    console.log(...params)
    console.log("---------------------")
}

module.exports = {info,error}