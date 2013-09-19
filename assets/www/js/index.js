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
	status = "Online";
	sessionStorage.setItem('sessionEstado', status);
	
	// Colocar botao Available a verde
	$('#bt_Available').buttonMarkup({theme: 'g'});
	// Colocar botao Busy a default
	$('#bt_Busy').buttonMarkup({theme: ''});
	// Colocar botao Offline a default
	$('#bt_Offline').buttonMarkup({theme: ''});
	
	// Verificar se div do mapa existe
	if (!document.getElementById("map"))
	{
		getLocation();
	} else 
	{
		// Remover div mapa
		var div = document.getElementById("map");
		div.parentNode.removeChild(div);
		div = document.getElementById("locationAddress");
		div.parentNode.removeChild(div);
		getLocation();
	}
	window.location = "home.html";
}

function bt_BusyClick() 
{
	// Colocar botao Busy a vermelho
	$('#bt_Busy').buttonMarkup({theme: 'r'});
	// Colocar botao Available a default
	$('#bt_Available').buttonMarkup({theme: ''});
	// Colocar botao Offline a default
	$('#bt_Offline').buttonMarkup({theme: ''});
	
	status = "Ocupado";
	sessionStorage.setItem('sessionEstado', status);
	
	// Verificar se div do mapa existe
	if (!document.getElementById("map"))
	{
		getLocation();
	} else 
	{
		// Remover div mapa
		var div = document.getElementById("map");
		div.parentNode.removeChild(div);
		div = document.getElementById("locationAddress");
		div.parentNode.removeChild(div);
		getLocation();
	}
	window.location = "home.html";
}

function bt_OfflineClick() 
{
	// Colocar botao Offline a Cinzento
	$('#bt_Offline').buttonMarkup({theme: 'dg'});
	// Colocar botao Avleailab a default
	$('#bt_Available').buttonMarkup({theme: ''});
	// Colocar botao Busy a default
	$('#bt_Busy').buttonMarkup({theme: ''});
	
	// Log
	status = "Offline";
	sessionStorage.setItem('sessionEstado', status);
	Log(status);
	// Remover div mapa
	var div = document.getElementById("map");
	div.parentNode.removeChild(div);
	// Colocar texto
	div = document.getElementById("locationAddress");
	div.parentNode.removeChild(div);
	var div = document.getElementById('locationAddress');
	div.innerHTML = '<p><b>Location: </b>unavailable</p>' + '<b>Last location: </b>' + sessionStorage.getItem('sessionAddress');
	
	window.location = "home.html";
}

function LoadButton(Estado)
{
	if (Estado == "Available")
	{
		// Colocar cor em botao Available
		$('#bt_Home').buttonMarkup({theme: 'g'});
	}
	
	if (Estado == "Busy")
	{
		// Colocar cor em botao Busy
		$('#bt_Home').buttonMarkup({theme: 'r'});
	}

	if (Estado == "Offline")
	{
		// Colocar cor em botao Offline
		$('#bt_Home').buttonMarkup({theme: 'dg'});
	}
}

function LoadButtonUser(Estado)
{
	if (Estado == "Available")
	{
		// Colocar cor em botao Available
		$('#bt_User').buttonMarkup({theme: 'g'});
	}
	
	if (Estado == "Busy")
	{
		// Colocar cor em botao Busy
		$('#bt_User').buttonMarkup({theme: 'r'});
	}

	if (Estado == "Offline")
	{
		// Colocar cor em botao Offline
		$('#bt_User').buttonMarkup({theme: 'dg'});
	}
}

function Log(str) 
{
	//alert("ENTROU LOG");
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

function getLocation() 
{
	//alert("ENTROU LOCATION");
	$('#loader').show();
	// Mostrar mapa
	var Latit;
	var Longit;
		
	if (navigator.geolocation) {
		//alert("ENTROU NAVIGATOR");
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(
			displayPosition, 
			displayError,
			{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
		);
	}
	else {
		alert("Geolocation is not supported by this browser");
	}
		
	function displayPosition(position) {
		//alert("ENTROU DISPLAYPOSITION");
		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		Latit = position.coords.latitude;
		Longit = position.coords.longitude;
		sessionStorage.setItem('sessionLat1', Latit);
		sessionStorage.setItem('sessionLon1', Longit);
		//alert(Latit);
		//alert(Longit);
		// Colocar Coordenadas em var global
		setCoord(Latit,Longit);
		// Inserir BD
		Log((sessionStorage.getItem('sessionEstado')));
		//Criar div após saber localização
		$('#divcontent').after('<div id="locationAddress"></div>');
		$('#locationAddress').after('<br /><div id="map"></div>');
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
		var contentString = "<b>Timestamp:</b> " + parseTimestamp(position.timestamp) + "<br/><b>User location:</b> lat " + position.coords.latitude + ", long " + position.coords.longitude + ", accuracy " + position.coords.accuracy;
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});
		geoCode();
		$('#loader').hide();
	}
	
	function displayError(error) {
			var errors = { 
				1: 'Permission denied',
				2: 'Position unavailable',
				3: 'Request timeout'
			};
			alert("Error: " + errors[error.code]);
			$('#loader').hide();
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
				$('#locationAddress').append(address);
				$('#loader').hide();
				sessionStorage.setItem('sessionAddress', address);
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
			  } else {
				alert("Geocoder failed due to: " + status);
				$('#loader').hide();
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
			//$('#button-estado').after('<div id="location"><p>' + UserAddress + '</p></div>');
			$('#timeinfo').before('<div id="location"><p>' + UserAddress + '</p></div>');
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
	$('#loader').show();
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
							$('#loader').hide();
						} else 
						{
							alert("Invalid password!");
							$('#loader').hide();
						}
					}
					, error: function (xmlHttpRequest, status, err) 
					{
						//alert(err.d);
						$('#loader').hide();
					}
		});	
	} else 
	{
		alert("Invalid new password!");
	}
}

function ChangeEmail() 
{
	$('#loader').show();

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
						$('#loader').hide();
					} else 
					{
						alert("Invalid email or password!");
						$('#loader').hide();
					}
				}
				, error: function (xmlHttpRequest, status, err) 
				{
					//alert(err.d);
					$('#loader').hide();
				}
	});	
}

function GetNames()
{
	$('#loader').show();

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
					
					CarregarHome();
					
					// Obter string colocada em sessão ****** NOTA: FAZER ISTO E PASSOS IMEDIATAMENTE A SEGUIR QUANDO FOR PARA OBTER VAR SESSÃO
					var dados = (sessionStorage.getItem('sessionUsers'));
					
					// Split e colocar em array
					var arrayFinal = new Array();
					arrayFinal = dados.split(",");
					
					//alert(arrayFinal);
					//alert(arrayFinal[0]);
					//alert(arrayFinal[5]);
				}
				, error: function (xmlHttpRequest, status, err) 
				{
					var div = document.getElementById('dinm-buttons');
					div.innerHTML = "No results.";	
					//alert(err.d);
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

function CarregarHome() 
{	
	//alert("Entrou home");
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
			for(var i = j; i < arrayDados.length; (i+=1))
			{
				var _Email = arrayDados[parseInt(j)];
				var _Hora = arrayDados[parseInt(j) + 2];
				var _Lat = arrayDados[parseInt(j) + 3];
				var _Long = "-" + arrayDados[parseInt(j) + 4];
			
				break;
			}
			
			// Obter coord e calc distancia
			var LatUser1 = sessionStorage.getItem('sessionLat1');
			var LonUser1 = sessionStorage.getItem('sessionLon1');
			var LatUser2 = _Lat
			var LonUser2 = _Long;
			
			var dist = getDistanceFromLatLonInKm(LatUser1, LonUser1, LatUser2, LonUser2);
			
			//$('#MatesBar').after('<input type="button" value="' + arrayDados[j] + '" onclick="SetLocationUserID(' + j + ')"/>');
			$('#dinm-buttons').append('<a id="div' + j + '" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick="SetLocationUserID(' + j + ')">' + GetUsernameByEmail(arrayDados[j]) + '</a>');
			
			// System time
			var time = new Date();
			var systemTime = time.getHours() + ":" + time.getMinutes();
			
			var userTime = parseTime(systemTime) - parseTime(_Hora);
			
			var Hours = Math.floor(userTime/60);
			var Minutes = userTime%60;
			var FinalTime = Hours + "h" + Minutes + "m";
			
			$('#loader').hide();
			
			// Para qdo o estado é offline
			if (sessionStorage.getItem('sessionEstado') == "Offline")
			{
				if (userTime < 60)
				{
					$('#div' + j).after('<div id="location"><p>' + userTime + 'm &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp distance unavailable</p></div>');
					sessionStorage.setItem('Tempo' + j, userTime);
					count--;
				} else
				{
					$('#div' + j).after('<div id="location"><p>' + FinalTime + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp distance unavailable</p></div>');
					sessionStorage.setItem('Tempo' + j, FinalTime);
					count--;
				}
				
				$('#loader').hide();
			} else
			{
				if (userTime < 60)
				{
					if (dist < 0.05)
					{
						$('#div' + j).after('<div id="location"><p>' + userTime + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ' + dist.toFixed(2) + 'km</p></div>');
						sessionStorage.setItem('Tempo' + j, userTime);
						count--;	
					} else
					{
						$('#div' + j).after('<div id="location"><p>' + userTime + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ' + dist.toFixed(2) + 'km</p></div>');
						sessionStorage.setItem('Tempo' + j, userTime);
						count--;
					}
				} else
				{
					if(dist < 0.05)
					{
						$('#div' + j).after('<div id="location"><p>' + FinalTime + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ' + dist.toFixed(2) + 'km</p></div>');
						sessionStorage.setItem('Tempo' + j, FinalTime);
						count--;	
					} else
					{
						$('#div' + j).after('<div id="location"><p>' + FinalTime + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ' + dist.toFixed(2) + 'km</p></div>');
						sessionStorage.setItem('Tempo' + j, FinalTime);
						count--;
					}
				}
				$('#loader').hide();
			}
		}
	} else
	{
		$('#loader').hide();
		$('#location').after('<div><h4>No mates on service.</h4></div>');
	}
	$('#loader').hide();
	$('#dinm-buttons').trigger('create');
}

function SetLocationUserID(UserID)
{
	sessionStorage.setItem('sessionID', UserID);
	
	// Obter string colocada em sessão *
	var dadosSessao = (sessionStorage.getItem('sessionUsers'));
	
	// Split e colocar em array
	var arrayDados = new Array();
	arrayDados = dadosSessao.split(",");
	
	var EmailUserClicked = arrayDados[parseInt(UserID)];
	
	sessionStorage.setItem('EmailUserClickado', EmailUserClicked);
	window.location = "userinfo.html";
}

function GetUserLocation(_ID)
{
	var ID = _ID;
	//alert(ID);
	
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
		//getInfo(_Email, _Estado, _Hora);
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
				//alert("Erro: " + err.d);
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

function LoadHome()
{
	$('#loader').show();
	// Criar div's
	$('#button-status').after('<div id="location" class="location"></div>');
	$('#location').before('<div id="button-status"></div>');
	$('#location').after('<div id="dinm-buttons"></div>');

	//alert("NTROU HOME");
	// Criar botao para o estado
	var Estado = sessionStorage.getItem('sessionEstado');
	
	if (Estado == "Online")
	{
		Estado = "Available";
	}
	if (Estado == "Ocupado")
	{
		Estado = "Busy";
	}
	
	//alert(Estado);
	$('#button-status').append('<a id="bt_Home" data-role="button" data-icon="arrow-r" data-iconpos="right" onclick="Redirect()">' + Estado + '</a>');
	$('#button-status').trigger('create');
	LoadButton(Estado);
	
	// Criar div para texto de localização
	var div = document.getElementById('location');
	if (Estado == "Available")
	{
		div.innerHTML = '<p><b>Location: </b>' + sessionStorage.getItem('sessionAddress') + '</p>';
	}
	
	if (Estado == "Busy")
	{
		div.innerHTML = '<p><b>Location: </b>' + sessionStorage.getItem('sessionAddress') + '</p>';
	}
	
	if (Estado == "Offline")
	{
		div.innerHTML = '<p><b>Location: </b>unavailable</p>';
	}
	
	// Criar botoes e respectivo texto
	GetNames();
}

function RefreshHome()
{
	var div;
	
	div = document.getElementById("button-status");
	div.parentNode.removeChild(div);
	
	div = document.getElementById("location");
	div.parentNode.removeChild(div);
	
	div = document.getElementById("dinm-buttons");
	div.parentNode.removeChild(div);
	
	LoadHome();
}

function Redirect()
{
	window.location = "updatestatus.html";
}

function RedirectHome()
{
	window.location = "home.html";
}

function LoadUpdate()
{
	var email = sessionStorage.getItem('sessionEmail')
	var username = GetUsernameByEmail(email);
	var div = document.getElementById('location');
	div.innerHTML = '<p><b>' + username + '</b></p>';
	
	var Estado = sessionStorage.getItem('sessionEstado');
	if (Estado == "Online")
	{
		// Colocar botao Available a verde
		$('#bt_Available').buttonMarkup({theme: 'g'});
		// Colocar botao Busy a default
		$('#bt_Busy').buttonMarkup({theme: ''});
		// Colocar botao Offline a default
		$('#bt_Offline').buttonMarkup({theme: ''});
		
		Estado = "Available";
		sessionStorage.setItem('sessionEstado', Estado);
	}
	
	if (Estado == "Ocupado")
	{
		// Colocar botao Busy a vermelho
		$('#bt_Busy').buttonMarkup({theme: 'r'});
		// Colocar botao Available a default
		$('#bt_Available').buttonMarkup({theme: ''});
		// Colocar botao Offline a default
		$('#bt_Offline').buttonMarkup({theme: ''});
		
		Estado = "Busy";
		sessionStorage.setItem('sessionEstado', Estado);
	}
	
	if (Estado == "Offline")
	{
		// Colocar botao Offline a Cinzento
		$('#bt_Offline').buttonMarkup({theme: 'dg'});
		// Colocar botao Avleailab a default
		$('#bt_Available').buttonMarkup({theme: ''});
		// Colocar botao Busy a default
		$('#bt_Busy').buttonMarkup({theme: ''});
	}
	
	// Verificar se div do mapa existe
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

function LoadUserInfo()
{
	var email = sessionStorage.getItem('EmailUserClickado');
	var username = GetUsernameByEmail(email);
	var div = document.getElementById('location');
	div.innerHTML = '<p><b>' + username + '</b></p>';
	
	var dadosSessao = (sessionStorage.getItem('sessionUsers'));
					
	// Split e colocar em array
	var arrayDados = new Array();
	arrayDados = dadosSessao.split(",");
	
	var ID;
	var _Estado;
	var _Lat;
	var _Long;
	for(var i = 0; i < arrayDados.length; (i+=1))
	{
		if(arrayDados[parseInt(i)] == email)
		{
			ID = i;
			_Estado = arrayDados[parseInt(i) + 1];
			_Lat = arrayDados[parseInt(i) + 3];
			_Long = "-" + arrayDados[parseInt(i) + 4];
			break;
		}
	}
	
	if (_Estado == "Online")
	{
		_Estado = "Available";
	}
	
	if (_Estado == "Ocupado")
	{
		_Estado = "Busy";
	}
	
	// Obter coord e calc distancia
	var LatUser1 = sessionStorage.getItem('sessionLat1');
	var LonUser1 = sessionStorage.getItem('sessionLon1');
	var LatUser2 = _Lat
	var LonUser2 = _Long;
	
	var dist = getDistanceFromLatLonInKm(LatUser1, LonUser1, LatUser2, LonUser2);
	
	$('#button-estado').append('<a id="bt_User" data-role="button" data-corners="false">' + _Estado + '</a>');
	$('#button-estado').trigger('create');
	//alert(Estado);
	LoadButtonUser(_Estado);
	
	var tempo = sessionStorage.getItem('Tempo' + ID);
	if (sessionStorage.getItem('sessionEstado') == "Offline")
	{
		$('#locationAddress').before('<div id="timeinfo"><p>' + tempo + 'm &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp distance unavailable</p></div>');
	} else
	{
		$('#locationAddress').before('<div id="timeinfo"><p>' + tempo + 'm &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ' + dist.toFixed(2) + 'km</p></div>');	
	}
	
	GetUserLocation(ID);
}

function Teste()
{
	alert("AKJBDA");
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) 
{
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) 
{
  return deg * (Math.PI/180)
}