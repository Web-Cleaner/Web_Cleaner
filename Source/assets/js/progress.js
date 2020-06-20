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
	var $nav = $('#nav-bar');
	var $feels = $('#feels-box');
	var $ticket = $('#ticket-box');
	var $report = $('#report-box');
	var $feelsQ = $('#feels-q');
	var $questions = $('#questions');
	var $ticketPageContainer = $('#ticket-box .ticket-pages');
	var $ticketPages = $('#ticket-box .ticket-page');
	var ticketPageIndex = 0;

	switchBox('report');
	sortFeels();


	$('.switch, .switchHl, switchH2, #moods, #tickets').click(function() {
		switchBox($(this).data('box'));
	});
	$report.find('.reportFeelings-min > li').click(function () {
		stats.addEvent('feeled', Date.now(), $(this).attr('data-feelrep'));
	});
	$feels.find('ul > li').click(function () {
		stats.addEvent('feeled', Date.now(), $(this).attr('data-feelrep'));
	});
    $feelsQ.find('.smileyContainer').click(function() {
        stats.addEvent('feeled', Date.now(), $(this).children('div').first().attr('data-answer'));
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
		if (box === 'report') {
			$nav.hide();
			$feels.hide();
			$ticket.hide();
			$report.show();
		} else if (box === 'feels') {
			$report.hide();
			$ticket.hide();
			$nav.show();
			$feels.show();
		} else if (box === 'tickets'){
			$report.hide();
			$feels.hide();
			$nav.show();
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

function sortFeels(){
	var ul = document.getElementsByClassName('reportFeelings-min')[0];
	var new_ul = ul.cloneNode(false);
	// Add all lis to an array
	var lis = [];
	for(var i = ul.childNodes.length; i--;){
		if(ul.childNodes[i].nodeName === 'LI')
			lis.push(ul.childNodes[i]);
	}

	// Sort the lis in descending order
	lis.sort(function(a, b){
		return parseInt(b.getElementsByClassName('feel-count')[0].innerHTML) -
			parseInt(a.getElementsByClassName('feel-count')[0].innerHTML);
	});

	// Add them into the ul in order
	for(var i = 0; i < lis.length; i++)
		new_ul.appendChild(lis[i]);
	ul.parentNode.replaceChild(new_ul, ul);
	$('ul.reportFeelings-min li').hide();
	$('ul.reportFeelings-min li:lt(4)').show();
}

$(document).on('click', '[data-role]', function() {({
	'report-edge': function() {
		showModal('lock-up');
	},
	'lock': function() {
		showModal('lock');
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
		var form = $(this).closest('#buttons1[data-form]').data('form');
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