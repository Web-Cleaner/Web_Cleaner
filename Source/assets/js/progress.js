var doughnut, boxes;
var startOfDay = 2*60*60*1000;

function initDoughnut() {
  doughnut = $("#doughnutChart").drawDoughnutChart([
	{ title: "Cummed",		  get value() { return cums.length; },  color: "#D46B72" },
	{ title: "Prostate Milked", get value() { return milks.length; },   color: "#FEFDD9" },
	{ title: "Ruined",        get value() { return ruins.length; },   color: "#ACD6DE" }
  ], {
  	summaryTitle: 'TOTAL'
  });
}

function updateDoughnut() {
	doughnut.update();
}

function initBoxes() {
	var $ticket = $('#ticket-box');
	var $feels = $('#feels-box');
	var $feelsQ = $('#feels-q');
	var $questions = $('#questions');
	var $ticketPageContainer = $('#ticket-box .ticket-pages');
	var $ticketPages = $('#ticket-box .ticket-page');
	var ticketPageIndex = 0;

	switchBox('feels');

	$('.switch, .switchHl').click(function() {
		switchBox($(this).data('box'));
	});
	$feelsQ.find('.smileyContainer > div').click(function() {
		stats.addEvent('feeled', Date.now(), $(this).attr('data-answer'));
		$feelsQ.hide();
		$questions.css("visibility","visible");
	});
	$('#ticket-box .arrowRight').click(function() {
		switchPage(ticketPageIndex + 1);
	});
	$('#ticket-box .arrowLeft').click(function() {
		switchPage(ticketPageIndex - 1);
	});
	
	function switchBox(box) {
		if (box === 'feels') {
			$ticket.hide();
			$feels.show();
		} else {
			$feels.hide();
			$ticket.show();
		}
		$('.switchHl').addClass('switch').removeClass('switchHl');
		$('.switch[data-box="' + box + '"]').addClass('switchHl').removeClass('switch');
	}

	function switchPage(page) {
		ticketPageIndex = (page + $ticketPages.length) % $ticketPages.length;
		$ticketPageContainer.animate({scrollLeft: $ticketPageContainer.scrollLeft() + $ticketPages.eq(ticketPageIndex).position().left});
	}
}

$(document).on('click', '[data-role]', function() {({
	'report-cpr': function() {
		showModal('cpr')
	},
	'report-edge': function() {
		showModal('edges');
	},
	'lock': function() {
		showModal('lock-up');
	},
	'add-edges': function() {
		var amount = +$('#modalBackground > .modal[data-form="edges"] input[data-role="amount"]').val();
		if (!amount || amount < 0 || amount % 1) {
			alert('Please enter a valid amount.');
		} else {
			for (var i = 0; i < amount; ++i) {
				stats.addEvent('edged');
			}
			hideModal();
		}
	},
	'answer': function() {
		var form = $(this).closest('.modal[data-form]').data('form');
		var $feelsQ = $('#feels-q');
		var $questions = $('#questions');
		if (form === 'cpr') {
			stats.addEvent($(this).data('answer'));
			hideModal();
			$questions.css("visibility","hidden");
			$feelsQ.show();
		}
	},
	'cancel-modal': function() {
		hideModal();
	}
}[$(this).data('role')] || function(){}).apply(this, arguments);});

$(document).on('keypress', '#modalBackground input', function(e) {
	if (e.which == 13) {
		$(e.target).parent().find('[data-type="submit"]').eq(0).click();
	}
});

function showModal(form) {
	var $form = $('#modalBackground > .modal[data-form="' + form + '"]');
	if (!$form.is(':visible')) {
		$('#modalBackground > .modal').not($form).hide();
		$form.show();
		if (form === 'edges') {
			$form.find('input[data-role="amount"]').val('');
			setTimeout(function() {
				$form.find('input[data-role="amount"]').focus();
			}, 1);
		}
	}
	$('#modalBackground').show();
}

function hideModal() {
	$('#modalBackground').hide();
}