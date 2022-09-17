$("#formvalidate").validate({
    rules: {
                name: {
                  required: true,
                },
                stdgroup: {
                  required: true,
                },
                mobile: { 
                  required: true,
                  digits : true,
                  minlength : 10,
                  maxlength : 10 
                }
            },
    messages: {
                  name : {
                    required : 'Please enter full name'
                  },
                  stdgroup : {
                    required : 'Please select stream'
                  },
                  mobile: {
                      required : 'Mobile number is required',
                      number:"Provide mobile number",
                      digits : 'Enter numbers only',
                      minlength : 'Enter a 10 digits phone number',
                      maxlength : 'Enter a 10 digits phone number'
                  }
              },
              
    tooltip_options: {
                        thefield: { 
                          placement: 'bottom'
                        }
                      }
});	

$("#loginvalidate").validate({
  rules: {
              loginmobile:{
                required: true,
                digits : true,
                minlength : 10,
                maxlength : 10 
              },
              loginpwd: {
                required: true,
              }
          },
  messages: {
                loginmobile: {
                  required : 'Mobile number is required',
                  number:"Provide mobile number",
                  digits : 'Enter numbers only',
                  minlength : 'Enter a 10 digits phone number',
                  maxlength : 'Enter a 10 digits phone number'
              },
              loginpwd : {
                required : 'Please Enter Password'
              },
            },
            
  tooltip_options: {
                      thefield: { 
                        placement: 'bottom'
                      }
                    }
});	

