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

var address;
var status;
var Latitude;
var Longitude;

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
	if (document.getElementById("map"))
	{
		// Remover div mapa
		var div = document.getElementById("map");
		div.parentNode.removeChild(div);
		getLocation();
	}
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
	if (document.getElementById("map"))
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
	status = "Offline";
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

function getLocation() 
{
	alert("ENTROU LOCATION");
	// Mostrar mapa
	var Latit;
	var Longit;
		
	if (navigator.geolocation) {
		alert("ENTROU NAVIGATOR");
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
		alert("ENTROU DISPLAYPOSITION");
		var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		Latit = position.coords.latitude;
		Longit = position.coords.longitude;
		alert(Latit);
		alert(Longit);
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
		var contentString = "<b>Timestamp:</b> " + parseTimestamp(position.timestamp) + "<br/><b>User location:</b> lat " + position.coords.latitude + ", long " + position.coords.longitude + ", accuracy " + position.coords.accuracy;
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
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
				address = results[1].formatted_address;
				var div = document.getElementById('location');
				div.innerHTML = '<p><b>Location: </b>' + address + '</p>';
				infowindow.setContent(results[1].formatted_address);
				infowindow.open(map, marker);				
			  } else {
				alert("Geocoder failed due to: " + status);
			  }
			});	
		}
}

// Obter Data
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
