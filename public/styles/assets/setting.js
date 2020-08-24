/*Placeholder forms*/


jQuery(function() {
   jQuery.support.placeholder = false;
   test = document.createElement('input');
   if('placeholder' in test) jQuery.support.placeholder = true;
});

 $(function() {
	if(!$.support.placeholder) { 
		var active = document.activeElement;
		$(':text').focus(function () {
			if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
				$(this).val('').removeClass('hasPlaceholder');
			}
		}).blur(function () {
			if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
				$(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
			}
		});
		$(':text').blur();
		$(active).focus();
		$('form').submit(function () {
			$(this).find('.hasPlaceholder').each(function() { $(this).val(''); });
		});
	}
});

jQuery(function() {
   jQuery.support.placeholder = false;
   test = document.createElement('input');
   if('placeholder' in test) jQuery.support.placeholder = true;
});

 $(function() {
	if(!$.support.placeholder) { 
		var active = document.activeElement;
		$(':password').focus(function () {
			if ($(this).attr('placeholder') != '' && $(this).val() == $(this).attr('placeholder')) {
				$(this).val('').removeClass('hasPlaceholder');
			}
		}).blur(function () {
			if ($(this).attr('placeholder') != '' && ($(this).val() == '' || $(this).val() == $(this).attr('placeholder'))) {
				$(this).val($(this).attr('placeholder')).addClass('hasPlaceholder');
			}
		});
		$(':password').blur();
		$(active).focus();
		$('form').submit(function () {
			$(this).find('.hasPlaceholder').each(function() { $(this).val(''); });
		});
	}
});


/*Calculator*/


$(function(){

	calc();

	$('#calc_plan').on('change', calc);
	$('#inv_amount').bind('change keyup', calc).on('keypress', isNumberKey);

});

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;
	return true;
}

function calc() {

	var plan = $('#calc_plan').val();
	var amount = $('#inv_amount').val();
	var percent;

	switch (plan) {
		case '1':
			switch (true) {
				case (amount>19):
					percent = 120;
					break;
				case (amount=100):
					percent = 120;
				default:
				    break;
					percent = 120;
			}
			break;
		case '2':
			switch (true) {
				case (amount>110):
					percent = 240;
					break;
				case (amount=500):
					percent = 240;
				default:
				    break;
					percent = 240;
			}
			break;
		case '3':
			switch (true) {
				case (amount>550):
					percent = 300;
					break;
				case (amount=5000):
					percent = 300;
				default:
				    break;
					percent = 300;
			}
			break;
		case '4':
			switch (true) {
				case (amount>5100):
					percent = 480;
					break;
				case (amount=10000):
					percent = 480;
				default:
				    break;
					percent = 480;
			}
			break;
	}

	$('#assign_per').val(percent+'%');
	var total = amount*percent/100;
	var new_amount = $('#inv_amount').val();
	var value1 = total.toFixed(2);
	var value2 = $('#inv_amount').val();
	var value3 = parseFloat(new_amount) + parseFloat(value1); 
	
	
	$('#total_return').val('$'+value3.toFixed(2));
	
	$('#net_profit').val('$'+total.toFixed(2));

	
	
	
	
	
	
	
	
	
	

}
