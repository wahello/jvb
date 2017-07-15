$(document).ready(function (){
	$(function (){
	$('[data-toggle="popover"]').popover({
		placement:'bottom'
	});
});

	 $( ".datepicker" ).datepicker({
         format: 'dd-mm-yyyy',
        todayHighlight: true,
        autoclose: true,
        orientation:"bottom",
         endDate: '+0d'
         })
	 
       $('input[type="radio"],input[type="checkbox"]').iCheck({
    checkboxClass: 'icheckbox_minimal-red',
    radioClass: 'iradio_minimal-blue'
    });
        $('select').select2();

        $('#prescription_select').on('change',function(){
            
           if($(this).val()=='1'){
            $('.prescription_hidden_fields').css('display','block');
           }
           else{
            $('.prescription_hidden_fields').css('display','none');
           }
           
        });

        $('#pain_select').on('change',function(){
            if($(this).val()=='1'){
                $('.pain_hidden_fields').css('display','block');
            }
             else{
                $('.pain_hidden_fields').css('display','none')
             }
        });

        $('#sick_select').on('change',function(){
            if($(this).val()=='1'){
                $('.sick_hidden_fields').css('display','block');
            }
             else{
                $('.sick_hidden_fields').css('display','none')
             }
        });
        //registration validations
        $('.bootstrap_validator').bootstrapValidator({
        fields: {
            first_name: {
                validators: {
                    notEmpty: {
                        message: 'Enter your first name'
                    },
                 regexp:{
                    regexp:/^[a-zA-Z]+$/,
                    message:'first name contains both lower and  upper case only'
                 }   
                }
            },
            last_name: {
                validators: {
                    notEmpty: {
                        message: 'Enter your last name'
                    },
                    regexp:{
                    regexp:/^[a-zA-Z]+$/,
                    message:'last name contains both lower and upper case only'
                 }   
                }
            },
            height: {
                validators: {
                  regexp: {
                        regexp: /^[1-9]\d*$/,
                        message:'enter numbers only'
                      },
                    notEmpty: {
                        message: 'Enter your height'
                    }
                }
            },
            weight: {
                validators: {
                  regexp: {
                        regexp: /^[1-9]\d*$/,
                        message:'enter numbers only'
                      },
                     notEmpty: {
                        message: 'Enter your weight'
                    }
                }
            },
            dob: {
                validators: {
                     notEmpty: {
                        message: 'Enter your birthday'
                    }
                }
            },
            username: {
                validators: {
                     notEmpty: {
                        message: 'Enter your username'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z\_]+$/,
                        message: 'username contains both lower case and upper case.'
                    }
                }
            },
             password: {
                validators: {
                  different: {
                        field: 'username',
                        message: 'The username and password cannot be the same as each other'
                    },
                     notEmpty: {
                        message: 'Enter your password'
                    }
                }
            },
             email: {
                validators: {
                    regexp: {
                        regexp: /^\S+@\S{1,}\.\S{1,}$/,
                        message: 'The input is not a valid email address.'
                    },
                    notEmpty: {
                        message: 'The email address is required'
                    }
                }
            },
            goals:{
              validators:{
                notEmpty:{
                  message:'select the options '
                }
              }
            },
            non_steps_goals:{
              validators:{
                notEmpty:{
                  message:'Enter the input '
                },
                regexp: {
                        regexp: /^[1-9]\d*$/,
                        message:'enter numbers only'
                      }
              }
            },
            sleep_goal:{
              validators:{
                notEmpty:{
                  message:'Enter the Sleep goal time '
                }
              }
            },
            movement_goal:{
              validators:{
                notEmpty:{
                  message:'Enter the input '
                }
              }
            },
            one:{
              validators:{
                notEmpty:{
                  message:'select options'
                }
              }
            },
            sick_comment:{
              validators:{
                notEmpty:{
                  message:'dont leave empty'
                }
              }
            }
        }
    }); 

        // confirm password validations

        $('.token_validator').bootstrapValidator({
            fields:{
                      confirmpassword:{
                        validators:{
                          identical:{
                            field:'password',
                            message:'Enter Confirm Password Same as Password'
                      },
                    notEmpty:{
                      message:'enter the confirm password'
                      }
                }
              },
              password:{
                validators:{
                  notEmpty:{
                    message:'enter the password'
                  }
                }
              }
            }
        });
});
