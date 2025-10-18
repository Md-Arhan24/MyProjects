module.exports = (fn) => {
    return (req, res, next) => {
        console.log("wrap async called");
        fn(req, res, next).catch((e) => next(e));
    };
}