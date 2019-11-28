Array.prototype.myReduce = function (callback) {
	const len = this.length;
	// 记录当前迭代的下标
	let k = 0;
	// 定义累加器
	let accumulator = undefined;
	// k下标对应的值是否存在
	let kPreset = false;
	// 初始值
	let initialValue = arguments.length > 0 ? arguments[1] : undefined;

	if (typeof callback !== 'function') {
		throw new TypeError(`${callback} is not a function`);
	}

	// 数组为空，并且没有初始值
	if (len === 0 && arguments.length < 2) {
		throw new Error(`Reduce of empty array with no initial value`);
	}

	// 如果初始值存在
	if (arguments.length > 0) {
		accumulator = initialValue;
	} else {
		accumulator = this[k];
		k++;
	}

	// 循环
	while (k < len) {
		// 判断是否为empty
		kPreset = this.hasOwnProperty(k);
		if (kPreset) {
			const kValue = this[k];
			accumulator = callback.apply(undefined, [accumulator, kValue, k, this]);
		}
		k++;
	}

	return accumulator;
}