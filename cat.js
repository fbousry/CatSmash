var method = Cat.prototype;

function Cat(id, picture) {
    this._id = id;
	this._picture = picture;
}

method.getId = function() {
    return this._id;
};

method.getPicture = function() {
    return this._picture;
};

module.exports = Cat;