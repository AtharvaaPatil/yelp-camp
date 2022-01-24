module.exports = func => {
    return(req, res, next) => {
        func(req, res, next).catch(next);
    }
}

// This function accepts a function and passes it to a function which runs the function and returns a function but if it catches an error it passes it to next()