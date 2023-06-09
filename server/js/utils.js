// validate options and then load them into an object
/**
	*	Will throw an error if a required option is missing
	*
	*	optionDetails format:
	*	[
	*		{
	*			name: string, // option name
	*			required: bool, // is this option required?
	*			defaultValue: value, // if required is false, this is the value the option will take if not present
	*			types: [string, ...], // valid type(s) of this parameter.  if empty/not present, any type is valid.  if populated, then the parameter not being any of these types will throw an error.  NOTE: values can be either a valid return value of typeof or a constructor name (obj.constructor.name)
	*			valid: [val1, val2, ...], // all possible valid values of this parameter.  if empty/not present, any value is valid.  if populated, then the parameter not being equal to any of these will throw an error.
	*			config: bool, // if true, then the value will be stored in obj.config[name] as opposed to obj itself.
	*		}, ...
	*	]
*/
function validateOptions(obj, options, optionDetails){
	if(!options) options = {};
	
	const keys = Object.keys(options);
	
	// loop through options and:
	// 1. ensure all required options are present
	// 2. add all options to this object
	for(const opt of optionDetails){
		if(!opt) continue;
		
		const {name, required, defaultValue, types, valid, config} = opt;
		
		if(required && !keys.includes(name)){
			throw new Error("Missing required parameter '" + name + "' in options object");
		}
		
		let val = options[name];
		
		if(val === undefined){
			if(!!defaultValue){
				val = defaultValue;
			} else {
				continue;
			}
		}
		
		if(!!types && types.length > 0 && !types.find(type => typeof val === type || val.constructor?.name === type) ){
			throw new Error("Invalid type for parameter '" + name + "' in options object (requires " + types + ")");
		}
		
		if(!!valid && valid.length > 0 && !valid.includes(val)){
			throw new Error("Invalid value for parameter '" + name + "' in options object (valid values are: " + valid + ")");
		}
		
		if(config){
			if(!obj.config) obj.config = {};
			
			obj.config[name] = val;
		} else {
			obj[name] = val;
		}
	}
}

// exports
module.exports = {
	validateOptions
};