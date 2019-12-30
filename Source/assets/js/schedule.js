(function() {
	var states = ['unset', 'one', 'two', 'three', 'all'];
	var meterStates = ['disabled', 'set'];
	var meterClasses = ['.meter-first', '.meter-middle', '.meter-last', '.meter-block'];
	var $nodes = $(states.map(function(state) {
		return '#daygrid li.' + state;
	}).join(', '));
	var $moreNodes = $('.more-times');
	var $meterNodes = $(meterClasses.join(','));
	var schedule = $nodes.get().map(function(){ return 4; });
	var meter = [].concat(...$moreNodes.eq(0).find(meterClasses.join(',')).get().map(function(){ 
		return $nodes.get().map(function(){ return 1; });
	}))
	var current = -1;

	display();

	$nodes.click(function() {
		var index = $nodes.index(this);
		this.classList.remove(states[schedule[index]]);
		schedule[index] = (schedule[index] + 1) % states.length;
		this.classList.add(states[schedule[index]]);
		document.getElementsByName('schedule')[0].value = JSON.stringify(schedule);
		activate(this, false);
	});

	$nodes.contextmenu(function() {
		activate(this, true);
		return false;
	});

	$meterNodes.click(function() {
		var index = $meterNodes.index(this) % 6 + current * 6;
		this.classList.remove(meterStates[meter[index]]);
		meter[index] = (meter[index] + 1) % meterStates.length;
		this.classList.add(meterStates[meter[index]]);
		document.getElementsByName('meter')[0].value = JSON.stringify(meter);
		for (let j = current * 6; j < (current + 1) * 6; ++j) {
			if (meter[j] < 1) {
				$nodes[current].classList.add('more');
				return;
			}
		}
		$nodes[current].classList.remove('more');
	});

	function activate(node, toggle) {
		var index = $nodes.index(node);
		if (current === index) {
			if (toggle || schedule[index] === 0) {
				$(node).removeClass('active');
				$(node).parent().parent().find('.more-times').hide();
				current = -1;
			}
		} else {
			$nodes.eq(current).removeClass('active');
			$nodes.eq(current).parent().parent().find('.more-times').hide();
			if (schedule[index] !== 0) {
				$(node).addClass('active');
				$(node).parent().parent().find('.more-times').show();
				current = index;
				displayMeter();
			} else {
				current = -1;
			}
		}
	}

	function display() {
		$nodes.each(function(i, node) {
			node.classList.remove(...states);
			node.classList.add(states[schedule[i]]);
			for (let j = i * 6; j < (i + 1) * 6; ++j) {
				if (meter[j] < 1) {
					node.classList.add('more');
					return;
				}
			}
			node.classList.remove('more');
		});
		displayMeter();
	}

	function displayMeter() {
		if (current >= 0) {
			$nodes.eq(current).parent().parent().find(meterClasses.map(c => '.more-times ' + c).join(',')).each(function(i, node) {
				var index = i + current * 6;
				node.classList.remove(...meterStates);
				node.classList.add(meterStates[meter[index]]);
			});
		}
	}

	window.updateSchedule = function() {
		try {
			var newSchedule = JSON.parse(document.getElementsByName('schedule')[0].value);
			if (newSchedule instanceof Array && newSchedule.length === schedule.length && newSchedule.every(function(s) {
				return typeof s === 'number' && s >= 0 && s < states.length;
			})) {
				schedule = newSchedule;
			}
			var newMeter = JSON.parse(document.getElementsByName('meter')[0].value);
			if (newMeter instanceof Array && newMeter.length === meter.length && newMeter.every(function(s) {
				return typeof s === 'number' && s >= 0 && s < meterStates.length;
			})) {
				meter = newMeter;
			}
		} catch (e) {}
		display();
	};
}());