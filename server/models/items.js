var mongoose = require('mongoose');
var Schema = mongoose.Schema;

itemSchema = new Schema( {
	
	
	name: String,
    variety:String,
    price:Number
	
}),
Items = mongoose.model('Items', itemSchema);

module.exports = Items;