// Login App mobile

var email;

function Login() 
{	
	//var login = new Object();
	//login.Email = "filipe@mail.com";
	//login.Password = "123";
	
	//var jsonText = JSON.stringify(login);
	//alert(jsonText);
	
	email = '"' + document.getElementById("email").value + '"';
	var password = '"' + document.getElementById("password").value + '"';
	//alert(email);
	//alert(password);
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	$.ajax({
                type: 'POST'	
                , url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/Login"
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                //, data: '{ "Email":"filipe@mail.com","Password":"123" }'
				, data: '{ "Email":' + email + ',"Password":' + password +' }'
				, crossDomain: true
                , success: function (data, status) {
					alert(data.d);
					if (data.d) 
					{
						alert("Login successful!");
						sessionStorage.setItem('sessionEmail', document.getElementById("email").value); 	
						window.location = "choose.html";
										
					} else 
					{
						alert("Invalid login!");
					}
                }
                , error: function (xmlHttpRequest, status, err) {
                    alert(err.d);
                }
            });	
}

function LogOut() 
{
	var user = sessionStorage.getItem('sessionEmail');
	sessionStorage.removeItem('sessionEmail');
	alert("Logging out " + user);
	window.location = "index.html";
}

function RemoverSpan() 
{
	var spans = document.getElementsByTagName("span");
	var divs = document.getElementsByTagName("div");

	for(var i=0; i<spans.length;i++)
	{
	  if(spans[i].className == "ui-btn-inner")
	  {
		 var container = spans[i].parentNode;
		 var text = spans[i].innerHTML;
		 container.innerHTML += text;
		 container.removeChild(spans[i]);
	  }
	  if(spans[i].className == "ui-btn-text")
	  {
		  var container = spans[i].parentNode;
		  container.removeChild(spans[i]);
	  }
	}
}