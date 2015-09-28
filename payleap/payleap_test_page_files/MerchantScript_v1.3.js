var Acculynk = {
	watchIntervalId: null,
	FunctionResponse: null,
	iLoad: 0,
	loadingValid: true,	
	strIFrameURL: "",	
	
	//checks to see if the browser is supported
	browserCheck: function(){
		try{
			var toReturn = true;
			var strBrowserData = navigator.userAgent.toLowerCase();
			if (strBrowserData!=null){
				var strSafari = 'safari/';
				//Safari WebKit versions
				var arraySafari = ['48','73','85','85.8.5','100','125', '312','312.3','312.5','312.6'];
				var index = strBrowserData.indexOf(strSafari);
				if (index != -1){
					var strWebKitVersion = strBrowserData.substring(index + strSafari.length);
					for(var i=0; i<arraySafari.length;i++){
						if (arraySafari[i]==strWebKitVersion)
							toReturn = false;
					}
				}
				if (/msie (\d+\.\d+);/.test(strBrowserData)){
				    var ieversion=new Number(RegExp.$1); // capture x.x portion and store as a number
				    if (ieversion<6)
					toReturn = false;
				}
				
				var arrDisabledDevices = new Array("opera","iphone","android","blackberry","windows phone os 7", "windows ce","symbian","palm");
				for (var i=0;i<arrDisabledDevices.length;i++){
					if (strBrowserData.indexOf(arrDisabledDevices[i])!=-1){
						toReturn = false;		
						break;	
					}
				}
			}
			return toReturn;
		}
		catch(err){
			return false;
		}
	},

	loadStyleSheet: function() {
	    var strBrowserData = navigator.userAgent;
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
		    var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
		    if (ieversion<7)
		        document.write('<'+'link href="https://cert.mws.acculynk.net/MWS/scripts/StyleSheet_IE6.css" rel="stylesheet" type="text/css" />')
		    else
		        document.write('<'+'link href="https://cert.mws.acculynk.net/MWS/scripts/StyleSheet.css" rel="stylesheet" type="text/css" />')
		}
		else{
            		var index = strBrowserData.indexOf('Opera');
			if (index != -1)
                		document.write('<'+'link href="https://cert.mws.acculynk.net/MWS/scripts/StyleSheet_Opera.css" rel="stylesheet" type="text/css" />')
			else
	            		document.write('<'+'link href="https://cert.mws.acculynk.net/MWS/scripts/StyleSheet.css" rel="stylesheet" type="text/css" />')
	    }
	},

	// Push information to the pinpad iframe to prep it for display.
	PINPadLoad: function() {
		try{
			this.initiateWatch();
			this._screenShow( true );
			this._loadingShow( true );
			this.loadingAnimation(0);
			
			//Force scrollbar to realign based on loading screen
			location.hash='#';			
			
			if ( document.iForm )
                		document.iForm.submit();
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
    
    //create an animation via javascript
    loadingAnimation: function(iInLoad){
	try{
		if (this.iLoad==6){
			document.getElementById('accu_dot5').style.backgroundColor="#DDDDDD";
			this.iLoad=0;
			iInLoad=0;
		}
		if(iInLoad==0){
			document.getElementById('accu_dot'+iInLoad).style.backgroundColor="#000099";
			}
		else{
			var itemp = iInLoad-1;
			document.getElementById('accu_dot'+itemp).style.backgroundColor="#DDDDDD";
			document.getElementById('accu_dot' + iInLoad).style.backgroundColor="#000099";
		}
		this.iLoad++;
		if(this.loadingValid)
		    setTimeout("Acculynk.loadingAnimation(Acculynk.iLoad);",200);
	}
	catch(err){
		Acculynk._callFunctionResponse('ACCU800');
		}	    
	},
	

	// Create the form on the page
	createForm: function( g, c, m, e ) {
	
		try{
		
		//default URL
		var PINPad_URL = "https://cert.paysecure.acculynk.net/PINPad/PINPad.aspx"

		//alternate URLs
		var PINPad_NASH = "https://cert.paysecure.acculynk.net/PINPad/PINPad.aspx"
				
		if(g.substring(14,15)=='2')
			PINPad_URL = PINPad_NASH		
		
		keypadInner = "<iframe id='MYiframe' name='Nameiframe' height=390 width=500 frameborder=0 scrolling=no allowtransparency=true></iframe>"
		formInner = "<form target='Nameiframe' action='" + PINPad_URL + "' name='iForm' method='post'>" +
	            "<input id='GUID' type='hidden' name='GUID' value='" + g + "' />" +
	            "<input id='CCLastFour' type='hidden' name='CCLastFour' value='" + c + "' />" +
	            "<input id='Mod' type='hidden' name='Mod' value='" + m + "' />" +
	            "<input id='Exp' type='hidden' name='Exp' value='" + e + "' />" +
	            "<input id='strIFrameURL' type='hidden' name='strIFrameURL' value='" + this.strIFrameURL + "' />" +
	            "</form>"
	            

		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
			var ieversion=new Number(RegExp.$1);
			if (ieversion<7){
				keypadInner = "<iframe id='MYiframe' name='Nameiframe' src='https://cert.mws.acculynk.net/MWS/scripts/blank.html' height=390 width=500 frameborder=0 scrolling=no allowtransparency=true></iframe>";
		    		loadingIframe= '<iframe id="modalIframe" style="display: visible;" src="https://cert.mws.acculynk.net/MWS/scripts/blank.html" frameborder=0 scrolling=no></iframe>';
				this._anyInner( 'accu_screen', loadingIframe );
			}
		}
		
        	loadingInner = '<table style="height:320px; width:500px; background-color: white; border: 1px solid #000000;"><tr style="height:100px;"></tr><tr style="height:40px;"><td align=center colspan=8 style="font-size: 30px;"><b>Loading</b></td></tr><tr style="height:25px;"><td style="width:175px;"></td><td id="accu_dot0" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td id="accu_dot1" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td id="accu_dot2" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td id="accu_dot3" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td id="accu_dot4" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td id="accu_dot5" style="border: 1px solid #000000; width:25px; background-color: #DDDDDD;"></td><td style="width:175px;"></td></tr><tr style="height:130px;"><td colspan=8></td></tr></table>';
		this._anyInner( 'accu_keypad', keypadInner )
		this._anyInner( 'accu_form', formInner )
		this._anyInner( 'accu_loading', loadingInner )
		}
		
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Function to actually perform when watching for changes from iframe element(?)
	performWatch: function() {
		try{
		var strHash = location.hash;
                if(strHash.length>8)
                        strHash = strHash.substr(strHash.length-8);
		switch (strHash) {
			case '#ACCU000': //PIN was accepted
				Acculynk._callFunctionResponse('ACCU000');
				Acculynk.cancelWatch();
				break;
			case '#ACCU200': //user pressed 'cancel' button so process as credit
				Acculynk._callFunctionResponse('ACCU200');
				Acculynk.cancelWatch();
				break;
			case '#ACCU400': //close modal because user was inactive
				Acculynk._callFunctionResponse('ACCU400');
				Acculynk.cancelWatch();
				break
			case '#ACCU600': //bad data was posted to the url
				Acculynk._callFunctionResponse('ACCU600');
				Acculynk.cancelWatch();
				break
			case '#ACCU800': //general catch all error
				Acculynk._callFunctionResponse('ACCU800');
				Acculynk.cancelWatch();
				break
			case '#ACCU999': //url was reached successfully so display the modal popup
				Acculynk._modalShow();
                Acculynk._callFunctionResponse('ACCU999');
				location.hash = "#";
				break;
			default: 
				break;            
		}
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},

	// Start performing the watch
	initiateWatch: function() {
		try{
		this.cancelWatch()  // Make sure we only have 1 going at a time
		this.watchIntervalId = window.setInterval( this.performWatch, 200 );
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Cancel the last watch
	cancelWatch: function() {
		try{
			if ( this.watchIntervalId !== null ) {
				window.clearInterval( this.watchIntervalId )
				this.watchIntervalId = null
			}
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},

	
	// Function for merchant to set to process responses
	setFunctionResponse: function( calledFunction ) {
		try{
			if ( calledFunction ) {
				this.FunctionResponse = calledFunction
			}
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},

	// Hide the screen/keypad modal screen functionality
	_modalHide: function() {
		try{
		this.loadingValid = false;
		this._loadingShow( false );		
		this._screenShow( false )
		this._keypadShow( false )
		location.hash = "#"
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Show the screen/keypad modal screen functionality
	_modalShow: function() {
		try{
			this._keypadShow( true )
			this.loadingValid = false;
			this._loadingShow( false )
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	_screenShow: function( reallyShow ) {
		try{
			this._anyShow( 'accu_screen', reallyShow )
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	_keypadShow: function( reallyShow ) {
		try{
			this._anyShow( 'accu_keypad', reallyShow )
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	_loadingShow: function( reallyShow ) {
		this._anyShow( 'accu_loading', reallyShow )
	},	
	
	// Generic function to show or hide an element as long as it has an appropriately prefixed element id
	_anyShow: function( targetElementId, reallyShow ) {
		try{
			if ( this._validElementIdToAlter( targetElementId ) ) {
				var displayValue = "none"
				if ( reallyShow ) {
					displayValue = "block"
				}

				targetElement = document.getElementById( targetElementId )
				if ( targetElement ) {
					targetElement.style.display = displayValue
				}
			}
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Generic function to set the inner html data of an element as long as it has an appropriately prefixed element id
	_anyInner: function( targetElementId, data ) {
		try{
			if ( this._validElementIdToAlter( targetElementId ) ) {
				targetElement = document.getElementById( targetElementId )
				if ( targetElement ) {
					targetElement.innerHTML = data
				}
			}
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Make sure the element requested falls within some criteria to actually allow this code to change it.
	_validElementIdToAlter: function( targetElementId ) {
		try{
		return ( targetElementId.substr( 0, 5 ) === 'accu_' )
		}
		catch(err){Acculynk._callFunctionResponse('ACCU800');}
	},
	
	// Actually call the function after a general error occurs
	_callFunctionResponse: function(strResponse) {
        //this.FunctionResponse;
        try{
            accu_FunctionResponse(strResponse);
        }
        catch(err){
            //none
        }
	}
}

Acculynk.loadStyleSheet();