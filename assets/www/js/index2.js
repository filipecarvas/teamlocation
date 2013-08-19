/* var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
*/
var UserAddress;
var address;
var status;
var Latitude;
var Longitude;
var Username;

function bt_AvailableClick() 
{
	// Mudar busy para inactivo
	document.getElementById("span-busy").style.boxShadow = "";
	document.getElementById("span-busy").style.backgroundColor = "rgb(0,0,0)";
	// Mudar offline para inactivo
	document.getElementById("span-offline").style.boxShadow = "inset 0px 0px 0px 0px, 0px 0px 0px 0px";
	document.getElementById("span-offline").style.backgroundColor = "rgb(0,0,0)";
	// Colocar cores em available
	document.getElementById("span-available").style.boxShadow = "inset 0px 1px 0px 0px rgba(250,250,250,0.5), 0px 0px 3px 2px rgba(135,187,83,0.5)";
	document.getElementById("span-available").style.backgroundColor = "rgb(135,187,83)";
	status = "Disponivel";
	// Verificar se div do mapa existe
	
		getLocation(41.18988382,-8.59584504);
	
}

function bt_BusyClick() 
{
	// Mudar available para inactivo
	document.getElementById("span-available").style.boxShadow = "";
	document.getElementById("span-available").style.backgroundColor = "rgb(0,0,0)";
	// Mudar offline para inactivo
	document.getElementById("span-offline").style.boxShadow = "inset 0px 0px 0px 0px, 0px 0px 0px 0px";
	document.getElementById("span-offline").style.backgroundColor = "rgb(0,0,0)";
	// Colocar cores em busy
	document.getElementById("span-busy").style.boxShadow = "inset 0px 1px 0px 0px rgba(250,250,250,0.5), 0px 0px 3px 2px rgba(226,0,0,0.5)";
	document.getElementById("span-busy").style.backgroundColor = "rgb(226,0,0)";
	status = "Ocupado";
	if (!document.getElementById("map"))
	{
		getLocation();
	} else 
	{
		// Remover div mapa
		var div = document.getElementById("map");
		div.parentNode.removeChild(div);
		getLocation();
	}
}

function bt_OfflineClick() 
{
	// Mudar available para inactivo
	document.getElementById("span-available").style.boxShadow = "";
	document.getElementById("span-available").style.backgroundColor = "rgb(0,0,0)";
	// Mudar busy para inactivo
	document.getElementById("span-busy").style.boxShadow = "";
	document.getElementById("span-busy").style.backgroundColor = "rgb(0,0,0)";
	// Colocar cores em offline
	document.getElementById("span-offline").style.boxShadow = "inset 0px 1px 0px 0px rgba(250,250,250,0.5), 0px 0px 2px 2px rgba(104,104,104,0.5)";
	document.getElementById("span-offline").style.backgroundColor = "rgb(104,104,104)";
	// Log
	status = "Offline";
	Log(status);
	// Remover div mapa
	var div = document.getElementById("map");
	div.parentNode.removeChild(div);
	// Colocar texto
	var div = document.getElementById('location');
	div.innerHTML = '<p><b>Location: </b>unavailable</p>' + '<b>Last location: </b>' + address;
	// Inserir em BD
	
}

function Log(str) 
{
	alert("ENTROU LOG");
	var DispositivoID = '"' + 2 + '"';
	var Data = '"' + getTime() + '"';
	
	var User2 = sessionStorage.getItem('sessionEmail');
	//alert(User2);
	var Estado = str;
	var Coordenadas = getCoord();
		
	var Message = '"Utilizador:' + User2 + ' , Estado:' + Estado + ' , Coordenadas[' + Coordenadas + ']' + '"';
	var Descricao = '"Gestão de equipas"';
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	 $.ajax({
                type: 'POST'
                , url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/Log"
                , contentType: 'application/json; charset=utf-8'
                , dataType: 'json'
                , data: '{ "DispositivoID":' + DispositivoID + ',"Data":' + Data + ',"Message":' + Message + ',"Descricao":' + Descricao + ' }'
				, crossDomain: true
                , success: function (data, status) {
                    //alert(data.d);
                }
                , error: function (xmlHttpRequest, status, err) {
                    //alert(err.d);
                }
            });
}

function getLocation(a,b) 
{
	alert("ENTROU LOCATION");
	// Mostrar mapa
	var Latit;
	var Longit;
		
	displayPosition(a,b);
		
	function displayPosition(a,b) {
		alert("ENTROU DISPLAYPOSITION");
		var pos = new google.maps.LatLng(a, b);
		Latit = a;
		Longit = b;
		//alert(Latit);
		//alert(Longit);
		// Colocar Coordenadas em var global
		setCoord(Latit,Longit);
		// Inserir BD
		Log(status);
		//Criar div após saber localização
		$('#location').after('<div id="map"></div>');
		//$('#map').before('<br />');
		var options = {
			zoom: 17,
			center: pos,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map"), options);
		var marker = new google.maps.Marker({
			position: pos,
			map: map,
			title: "User location"
		});
		//var contentString = "<b>Timestamp:</b> " + parseTimestamp(position.timestamp) + "<br/><b>User location:</b> lat " + position.coords.latitude + ", long " + position.coords.longitude + ", accuracy " + position.coords.accuracy;
		//var infowindow = new google.maps.InfoWindow({
		//	content: contentString
		//});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});
		geoCode();
	}
	
	function displayError(error) {
			var errors = { 
				1: 'Permission denied',
				2: 'Position unavailable',
				3: 'Request timeout'
			};
			alert("Error: " + errors[error.code]);
	}
	
	function parseTimestamp(timestamp) {
			var d = new Date(timestamp);
			var day = d.getDate();
			var month = d.getMonth() + 1;
			var year = d.getFullYear();
			var hour = d.getHours();
			var mins = d.getMinutes();
			var secs = d.getSeconds();
			var msec = d.getMilliseconds();
			return day + "." + month + "." + year + " " + hour + ":" + mins + ":" + secs + "," + msec;
	}
		
	function geoCode() {
			var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(Latitude, Longitude);
			geocoder.geocode({'latLng': latlng}, function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
				address = results[0].formatted_address;
				var div = document.getElementById('location');
				div.innerHTML = '<p><b>Location: </b>' + address + '</p>';
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);				
			  } else {
				alert("Geocoder failed due to: " + status);
			  }
			});
	}
}

function geoCode2(Lat, Long)
{	
	var geocoder = new google.maps.Geocoder();
	var latlngt = new google.maps.LatLng(Lat, Long);
	geocoder.geocode({'latLng': latlngt}, function(results, status)
	{
		if (status == google.maps.GeocoderStatus.OK) {
			UserAddress = results[0].formatted_address;
			//alert("ADSBAJD: " + UserAddress);
			var div = document.getElementById('locationUser');
			div.innerHTML = '<p><b>Location: </b>' + UserAddress + '</p>';
		} else 
		{
			alert("Geocoder failed due to: " + status);
		}
	});
}

// Obter Data e Horas
function getTime()
{
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var date = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
		var milisec = time.getMilliseconds();
		
		return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + "." + milisec;   
}

// Obter Data
function getDate()
{
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
		
		if (month < 10)
		{
			month = "0" + month;
		}
		
		if (day < 10)
		{
			day = "0" + day;
		}
		return year + "-" + month + "-" + day;		
}

// Colocar Coordenadas em var global
function setCoord(Latit, Longit) 
{
	Latitude = Latit;
	Longitude = Longit;
}

// Obter Coordenadas
function getCoord()
{
	var str = "Latitude:" + Latitude + ",Longitude:" + Longitude;
	return str;
}

function Exit() 
{
	var retVal = confirm("Do you really want to exit?");
	if (retVal == true)
	{
	  navigator.app.exitApp();
	  return true;
	} else
	{
	  return false;
	}
}

function ChangePassword() 
{
	//alert("ENT");
	var Email = '"' + sessionStorage.getItem('sessionEmail') + '"';
	var Old_pw = '"' + document.getElementById("old_password").value  + '"';
	var Password1 = '"' + document.getElementById("new_password1").value  + '"';
	var Password2 = '"' + document.getElementById("new_password2").value  + '"';
	//alert(Email);
	//alert(Old_pw);
	//alert(Password1);
	//alert(Password2);
	
	// Verificar se a nova password pretendida é a mesma nos dois campos
	if (Password1 == Password2) 
	{
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
	
		$.ajax({
					type: 'POST'	
					, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/AlterarPassword"
					, contentType: 'application/json; charset=utf-8'
					, dataType: 'json'
					, data: '{ "Email":' + Email + ',"PasswordAntiga":' + Old_pw + ',"PasswordNova":' + Password1 + ' }'
					, crossDomain: true
					, success: function (data, status) {
						//alert(data.d);
						if (data.d) 
						{
							alert("Password changed!");					
						} else 
						{
							alert("Invalid password!");
						}
					}
					, error: function (xmlHttpRequest, status, err) 
					{
						//alert(err.d);
					}
		});	
	} else 
	{
		alert("Invalid new password!");
	}
}

function ChangeEmail() 
{
	var Email = '"' + sessionStorage.getItem('sessionEmail') + '"';
	var NewEmail = '"' + document.getElementById("new_email").value  + '"';
	var Password = '"' + document.getElementById("password").value  + '"';
	
	var OldEmailSemAspas = sessionStorage.getItem('sessionEmail');
	var NewEmailSemAspas = document.getElementById("new_email").value;
	//alert(OldEmailSemAspas);
	//alert(NewEmailSemAspas);
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	$.ajax({
			type: 'POST'	
			, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/AlterarEmail"
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: '{ "Email":' + Email + ',"NovoEmail":' + NewEmail + ',"Password":' + Password + ' }'
			, crossDomain: true
			, success: function (data, status) {
					//alert(data.d);
					if (data.d) 
					{
						alert("Email changed!");
						sessionStorage.setItem('sessionEmail', NewEmailSemAspas);
						AlterarEmailLog(OldEmailSemAspas, NewEmailSemAspas);
					} else 
					{
						alert("Invalid email or password!");
					}
				}
				, error: function (xmlHttpRequest, status, err) 
				{
					//alert(err.d);
				}
	});	
}

function GetNames()
{
	//alert("Entrou GET NAMES");
	var Email = '"' + sessionStorage.getItem('sessionEmail') + '"';
	var Data = '"' + getDate() + '"';
	//alert("Data: " + Data);
	//alert("Email: " + Email);
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	$.ajax({
			type: 'POST'	
			, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/GetNames"
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: '{ "Data":' + Data + ',"Email":' + Email + ' }'
			, crossDomain: true
			, success: function (data, status) {
					//alert("SUCESSO!");
					// Buscar string com os dados
					var str = JSON.stringify(data.d);
					
					// Retirar as aspas da string
					str = replaceAll(str, '"', "");
					
					// Retirar os []
					str = replaceAll(str, '[', "");
					str = replaceAll(str, ']', "");
					
					// Retirar espaços
					str = replaceAll(str, " ", "");
					
					// Colocar Array em Session
					sessionStorage.setItem('sessionUsers', str);
					
					// Obter string colocada em sessão ****** NOTA: FAZER ISTO E PASSOS IMEDIATAMENTE A SEGUIR QUANDO FOR PARA OBTER VAR SESSÃO
					var dados = (sessionStorage.getItem('sessionUsers'));
					
					// Split e colocar em array
					var arrayFinal = new Array();
					arrayFinal = dados.split(",");
					
					window.location = "locate.html";
					
					//alert(arrayFinal);
					//alert(arrayFinal[0]);
					//alert(arrayFinal[5]);
				}
				, error: function (xmlHttpRequest, status, err) 
				{
					alert(err.d);
				}
	});	
}

function replaceAll(string, token, newtoken) 
{
	while (string.indexOf(token) != -1) {
 		string = string.replace(token, newtoken);
	}
	return string;
}

function CarregarLocate() 
{	
	// Obter string colocada em sessão *
	var dadosSessao = (sessionStorage.getItem('sessionUsers'));
					
	// Split e colocar em array
	var arrayDados = new Array();
	arrayDados = dadosSessao.split(",");
	
	var count = 0;
	for(var i = 0; i < arrayDados.length; (i+=5))
	{
		count++;
	}
	
	if(count != 0)
	{
		for(var j = 0; count > 0; j+=5)
		{
			//$('#MatesBar').after('<input type="button" value="' + arrayDados[j] + '" onclick="SetLocationUserID(' + j + ')"/>');
			$('#MatesBar').after('<li><a onclick="SetLocationUserID(' + j + ')">' + GetUsernameByEmail(arrayDados[j]) + '</a></li>');
			$('ul').listview('refresh');
			count--;
		}
	} else
	{
		$('#ulMates').after('<div><h4>No results.</h4></div>');
		$('ul').listview('refresh');
	}
}

function SetLocationUserID(UserID)
{
	sessionStorage.setItem('sessionID', UserID);
	window.location = "infoUser.html";
}

function GetUserLocation()
{
	var ID = (sessionStorage.getItem('sessionID'));
	
	var dadosSessao = (sessionStorage.getItem('sessionUsers'));
					
	// Split e colocar em array
	var arrayDados = new Array();
	arrayDados = dadosSessao.split(",");
	
	for(var i = ID; i < arrayDados.length; (i+=1))
	{
		var _Email = arrayDados[parseInt(ID)];
		var _Estado = arrayDados[parseInt(ID) + 1]
		var _Hora = arrayDados[parseInt(ID) + 2];
		var _Latitude = arrayDados[parseInt(ID) + 3];
		var _Longitude = "-" + arrayDados[parseInt(ID) + 4];
		
		// Colocar Info
		getInfo(_Email, _Estado, _Hora);
		//alert(_Estado);
		//alert(_Hora);
		//alert(_Latitude);
		//alert(_Longitude);
		break;
	}
	
	var pos = new google.maps.LatLng(Number(_Latitude), Number(_Longitude));

	var mapOptions = {
		zoom: 17,
		center: pos,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
				
	map = new google.maps.Map(document.getElementById('mapUser'), mapOptions);						

	var marker = new google.maps.Marker({
		map: map,
		position: pos,
		title: 'User Location.'
	});

	map.setCenter(pos);
	
	//var infowindow = new google.maps.InfoWindow(options);
	//map.setCenter(options.position);
			
	//google.maps.event.addDomListener(window, 'load', GetUserLocation);
	
	//alert("AQUIIII");
	// Colocar address
	UserAddress = geoCode2(_Latitude, _Longitude);
	
	google.maps.event.addDomListener(window, 'load', GetUserLocation);
}

function AlterarEmailLog(OldEmail, NewEmail)
{
	Old = '"' + OldEmail + '"';
	New = '"' + NewEmail + '"';
	alert("OLD: " + Old);
	alert("NEW: " + New);
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	$.ajax({
			type: 'POST'	
			, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/AlterarEmailLog"
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: '{ "EmailAntigo":' + Old + ',"NovoEmail":' + New + ' }'
			, crossDomain: true
			, success: function (data, status) {
					if (data.d) 
					{
						//alert("SUCESSO!");
					}
				}
				, error: function (xmlHttpRequest, status, err) 
				{
					alert("Erro: " + err.d);
				}
	});	
}

function LoadUserFooter()
{
	var Email = sessionStorage.getItem('sessionEmail');
	var auxEmail = '"' + Email + '"';
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	$.ajax({
			type: 'POST'	
			, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/GetNameByEmail"
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: '{ "Email":' + auxEmail + ' }'
			, crossDomain: true
			, success: function (data, status) {
					if (data.d) 
					{
						var div = document.getElementById('UserFooter');
						div.innerHTML = data.d;						
					}
			}
			, error: function (xmlHttpRequest, status, err) 
			{
				alert("Erro: " + err.d);
			}
	});	
}

function GetUsernameByEmail(Email)
{
	var auxEmail = '"' + Email + '"';
	
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	
	var response = $.ajax({
			type: 'POST'
			, async: false
			, global: false
			, url: "http://m2m.planetavirtual.pt/WebService/MobileM2M.asmx/GetNameByEmail"
			, contentType: 'application/json; charset=utf-8'
			, dataType: 'json'
			, data: '{ "Email":' + auxEmail + ' }'
			, crossDomain: true
			, success: function (data, status) {
					if (data.d) 
					{
						return data.d;						
					}
			}
			, error: function (xmlHttpRequest, status, err) 
			{
				alert("Erro: " + err.d);
			}
	}).responseText;

	var data = eval('(' + response + ')');

	return data.d;
}

function checkLogin()
{
	if (sessionStorage.getItem('sessionEmail') == null || undefined)
	{
		window.location = "index.html";
	}
}

function getInfo(_Email, _Estado, _Hora)
{
	// Get name
	var name = GetUsernameByEmail(_Email);
	
	if (_Estado == "Online")
	{
		_Estado = "Available";
	}
	
	if (_Estado == "Ocupado")
	{
		_Estado = "Busy";
	}

	// System time
	var time = new Date();
	var systemTime = time.getHours() + ":" + time.getMinutes();
	
	var userTime = parseTime(systemTime) - parseTime(_Hora);
	
	var Hours = Math.floor(userTime/60);
	var Minutes = userTime%60;
	var FinalTime = Hours + " hours and " + Minutes + " minutes ";
	
	if (userTime < 60)
	{
		var div = document.getElementById('infoUser');
		div.innerHTML = '<p><b>Info: </b>' + name + ' was ' + _Estado + ' ' + userTime + ' minutes ago.</p>';
	} else
	{
		var div = document.getElementById('infoUser');
		div.innerHTML = '<p><b>Info: </b>' + name + ' was ' + _Estado + ' ' + FinalTime + 'ago.</p>';
	}
}

function parseTime(s) {
   var c = s.split(':');
   return parseInt(c[0]) * 60 + parseInt(c[1]);
}