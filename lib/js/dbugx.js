var editor;

window.onload = createEditor;

function createEditor() {
	editor = CodeMirror.fromTextArea(document.getElementById("sourceText"), {
        lineNumbers: true,
        matchBrackets: true,
        theme: "xq-dark"
      });
}

function loadServers(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			var serverDoc = this.responseXML;
			var x = serverDoc.getElementsByTagName("server");
			var serverList = document.getElementById("server-list");
			while (serverList.lastChild) {
				serverList.removeChild(serverList.lastChild);
			}
			
			for (i = 0; i < x.length; i++) {
				var serverItem = document.createElement('li');
				serverItem.setAttribute("class", "w3-padding-16 w3-pale-blue");
				serverItem.setAttribute("db", x[i].getElementsByTagName("database")[0].childNodes[0].nodeValue);
				serverItem.setAttribute("id", x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue);
				
				var connectButton = document.createElement('span');
				connectButton.innerHTML = "+";
				connectButton.setAttribute("id", "connectButton");
				connectButton.setAttribute("onClick", "connectServer(this.parentElement)");
				connectButton.setAttribute("class", "w3-btn w3-pale-blue w3-padding");
				connectButton.setAttribute("style", "float:right");
				serverItem.appendChild(connectButton);

				serverItem.appendChild(createSpanNode(x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue, "w3-medium"));
				serverItem.appendChild(document.createElement('br'));
				serverItem.appendChild(createSpanNode("Port: " + x[i].getElementsByTagName("port")[0].childNodes[0].nodeValue, "w3-tiny"));
				serverItem.appendChild(document.createElement('br'));
				serverItem.appendChild(createSpanNode("Root: " + x[i].getElementsByTagName("root")[0].childNodes[0].nodeValue, "w3-tiny"));

				serverList.appendChild(serverItem);
			}
			document.getElementById("load-servers-btn").innerHTML = "Reload"
		}
	};
	xhttp.open("GET", "http://localhost:8500/ServerList", true);
	xhttp.send();
}

function createSpanNode(nodeValue, classValue){
	var spanNode = document.createElement('span');
	var spanAttribClass = document.createAttribute('class');
	spanAttribClass.value = classValue;
	spanNode.setAttributeNode(spanAttribClass);
	spanNode.innerHTML = nodeValue;
	return spanNode;
}

function connectServer(serverNode) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			if(this.responseXML.getElementsByTagName("success").length > 0 && this.responseXML.getElementsByTagName("success")[0].childNodes[0].nodeValue == "true"){
				serverNode.setAttribute("class", "w3-padding-16 w3-green");
				serverNode.getElementsByTagName("span")[0].innerHTML = "-";
				serverNode.getElementsByTagName("span")[0].setAttribute("onClick", "disconnectServer(this.parentElement)");
				serverNode.getElementsByTagName("span")[0].setAttribute("class", "w3-btn w3-green w3-padding");
			}
		}
	};
	xhttp.open("GET", "http://localhost:8500/Connect?serverID=" + serverNode.getAttribute("id"), true);
	xhttp.send();
}

function disconnectServer(serverNode) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			if(this.responseXML.getElementsByTagName("success").length > 0 && this.responseXML.getElementsByTagName("success")[0].childNodes[0].nodeValue == "true"){
				serverNode.setAttribute("class", "w3-padding-16 w3-pale-blue");
				serverNode.getElementsByTagName("span")[0].innerHTML = "+";
				serverNode.getElementsByTagName("span")[0].setAttribute("onClick", "connectServer(this.parentElement)");
				serverNode.getElementsByTagName("span")[0].setAttribute("class", "w3-btn w3-pale-blue w3-padding");
			}
		}
	};
	xhttp.open("GET", "http://localhost:8500/Disconnect?serverID=" + serverNode.getAttribute("id"), true);
	xhttp.send();
}

function showStopped(serverNode) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200) {
			var stoppedDoc = this.responseXML;
		}
	};
	xhttp.open("GET", "http://localhost:8500/Stopped?serverID=" + serverNode.getAttribute("id"), true);
	xhttp.send();
}