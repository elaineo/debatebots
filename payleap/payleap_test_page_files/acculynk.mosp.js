/*
Version 2.0 - PerX Version
*/
var bCloseOutTime = false;
var bUsesIFrame = false;
var bPerXEnabled = true;
var strIFrameURL = "";
var key;
var Ikey;
var strRANDNUMBERS = '';
var strRANDHEX = '';
var VerisignClicks = 0;
var PaySecureClicks = 0;
var Page = 1;
var ClearClicks = 0;
var timer;
var bScriptError = false;
var bPostMessage = false;

var isSubmitClicked = false;

window.onerror = stopError;

var imgPreload0 = new Image();
var imgPreload4 = new Image();
var imgPreload6 = new Image();
var imgPreload7 = new Image();
var imgPreload8 = new Image();
var imgPreload9 = new Image();

var iDigits = 0;
var img0 = new Image();
var img1 = new Image();
var img2 = new Image();
var img3 = new Image();
var img4 = new Image();
var img5 = new Image();
var img6 = new Image();
var img7 = new Image();
var img8 = new Image();
var img9 = new Image();

var iIntervalId_ActivationStatus = 0;
var nInterval_ActivationStatus = 0;


function LoadIframe() {

    Time_Stamp();
    reset_interval();
    document.getElementById('divProcessingCUP').style.visibility = 'visible';
    document.getElementById("divIssuerFrame").style.visibility = 'visible';

    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
    var s = document.getElementById('hEnrollmentURL');
    var ifrm = document.getElementById('iframeID');
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(s.value);
    ifrm.document.close();
    CloseOutTime('ACCU999');
    document.getElementById('hEnrollmentURL').value = null;
    document.getElementById("divCancel").style.visibility = 'hidden';
    document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
    document.getElementById('divPINandSubmit').style.visibility = 'hidden';
    document.getElementById("div5").style.visibility = 'hidden';
    document.getElementById("lbPersonalization").style.visibility = 'hidden';
    BodyLoaded();
    //setTimeout("checkActivationStatus()", 10000);
    nInterval_ActivationStatus = 0;
    iIntervalId_ActivationStatus = setInterval('checkActivationStatus();', 1000);
}

function checkActivationStatus() {
    try {
        nInterval_ActivationStatus++;

        if (nInterval_ActivationStatus > 125) {
            clearInterval(iIntervalId_ActivationStatus);
        }
        else {
            if (nInterval_ActivationStatus > 20) {
                var GUID = "";
                GUID = document.getElementById("hGUID").value;
                ShopperWebService.GetCUPCardActivationStatus(GUID, OnCompleteCheckStatus, OnError, OnTimeOut);
            }
        }
    }
    catch (err) {
        JS_Exception("checkActivationStatus: " + err.description);
    }
}

function OnCompleteCheckStatus(arg) {
    try
    {
        if (arg == 0) {
            //alert(arg);
            //alert("Card Activated ... Show PinPad");
            document.getElementById("divCancel").style.visibility = 'visible';
            document.getElementById('ImageButtonSubmitPIN').style.visibility = 'visible';
            document.getElementById('divPINandSubmit').style.visibility = 'visible';
            document.getElementById("div5").style.visibility = 'visible';
            document.getElementById("lbPersonalization").style.visibility = 'visible';

            document.getElementById("divIssuerFrame").style.visibility = 'hidden';
            document.getElementById('divProcessingCUP').style.visibility = 'hidden';

            clearInterval(iIntervalId_ActivationStatus);
            //Card activated now show the PINPAD & start interval again.
            reset_interval();
        }
        //        else {
        //            alert("Card Not Activated ... Show PinPad");
        //        }
    }
    catch (err) {
        JS_Exception("OnCompleteCheckStatus: " + err.description);
    }

}

function OnTimeOut(arg) {
    try {
        CloseOutTime('ACCU400');
    }
    catch (err) {
        JS_Exception("OnTimeOut: " + err.description);
    }
}

function OnError(arg) {
    JS_Exception("OnError() - Enrolment Page : " + arg._message);
}

function checkDigitLoad() {
    try {
        if (isSubmitClicked) {

            document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        }
        if (iDigits > 150) {
            JS_Exception("Digit load exceeded 15 seconds.");
        }
        else {
            if (img0.complete && img1.complete && img2.complete && img3.complete && img4.complete && img5.complete && img6.complete && img7.complete && img8.complete && img9.complete) {
                iDigits = 0;
                document.getElementById("divProcessing").style.visibility = 'hidden';
                End_Animation();
            }
            else {
                setTimeout("checkDigitLoad()", 100);
                iDigits++;
            }
        }
    }
    catch (err) {
        JS_Exception("preload_Digits: " + err.description);
    }
}
function BodyLoaded() {
    try {

        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);

        set_interval();
        Time_Stamp();

        callPostback("hiddenMainController");



    }
    catch (err) {
        JS_Exception("CallGO: " + err.description);
    }
}
/*added for issuer url to find the buttons*/
function CallIssuerUrl() {
    var divs = document.getElementsByTagName('div');

    var btnNext = divs[10].all[0].contentWindow.document.getElementById("btn_Next");
    if (btnNext.click != null && btnNext.id == 'btn_Next') {
        if (btnNext.addEventListener) {  // all browsers except IE before version 9
            btnNext.addEventListener("onclick", Cancel_Click1, false);
        }
        else {
            if (btnNext.attachEvent) {   // IE before version 9
                btnNext.attachEvent("onclick", Cancel_Click1);
            }
        }
    }
    //    var btnResponse = divs[10].all[0].contentWindow.document.getElementById("btn_Response");
    //        if (btnResponse.onclick!=null && btnResponse.id == 'btn_Response') {
    //        if (btnResponse.addEventListener) {  // all browsers except IE before version 9
    //            btnResponse.addEventListener("onclick", reloadPinPad, false);
    //        }
    //        else {
    //            if (btnResponse.attachEvent) {   // IE before version 9
    //               btnResponse.attachEvent("onclick", reloadPinPad);
    //            }
    //        }
    //}

}

// Cancle function for issuer cancle button

function IssuerCancel_Click() {

    try {
        //alert("Cancel_Click");
        document.getElementById("divCancel").style.visibility = 'hidden';
        document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
        document.getElementById('divPINandSubmit').style.visibility = 'hidden';
        document.getElementById("div5").style.visibility = 'hidden';
        document.getElementById("divIssuerFrame").style.visibility = 'none';
        parent.window.close();
        //if (bCancel_Enabled) {
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        //document.getElementById("divCancel").style.visibility = 'hidden';
        //document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
        //document.getElementById('divPINandSubmit').style.visibility = 'hidden';
        //reloadPinPad();
        //    Stats(0);

        //    return true;
        //}
        //else
        //return false;
    }
    catch (err) {
        JS_Exception("IssuerCancel_Click(): " + err.description);
    }
}

// Submit function for issuer submit button.
function IssuerSubmit_Click() {
    try {
        alert("Submit_Click");
        if (bCancel_Enabled) {
            alert("bCancel_Enabled");
            document.getElementById("divIssuerFrame").style.visibility = 'hidden';
            //callPostback("issuerSubmit");
            //var button = document.getElementByID("issuerSubmit");
            //button.click();
            //reloadPinPad();
            Stats(0);
            isSubmitClicked = true;
            return true;
        }
        else {
            alert("Else bCancel_Enabled");
            return false;
        }
    }
    catch (err) {
        JS_Exception("IssuerSubmit_Click: " + err.description);
    }
}


//Reload pinpad after issuer submit button clicked
function reloadPinPad() {
    // alert("reloadPinPad()");
    //window.location.href = "PINPad.aspx";
}
/*End Issuer Url*/


var iTheme = 0;
bgTheme = new Image();

var seconds = 15;
var startTimer = false;
var timerValid = true;

var lbl_Session_A = 'Your session will expire in ';
var lbl_Session_B = ' second(s).';
function countDown() {
    try {
        //alert('str  countDown');
        if (startTimer && timerValid) {
            if (seconds <= 0) {
                if (seconds == 0) {
                    document.getElementById('strTime').innerText = '';
                    document.getElementById('strTime').textContent = '';
                    document.getElementById('strTime').style.visibility = 'hidden';
                    auto_logout();
                }
            }
            else {
                document.getElementById('strTime').style.visibility = 'visible';

                document.getElementById('strTime').innerText = lbl_Session_A + seconds + lbl_Session_B;
                document.getElementById('strTime').textContent = lbl_Session_A + seconds + lbl_Session_B;

                seconds -= 1;
                setTimeout("countDown()", 1000)
            }
        }
        else {
            document.getElementById('strTime').style.visibility = 'hidden';
            document.getElementById('strTime').innerText = '';
            document.getElementById('strTime').textContent = '';
        }
    }
    catch (err) {
        JS_Exception("countDown: " + err.description);
    }
}

function Show_Animation() {
    try {

        document.getElementById("AnimationImage").innerHTML = "<img src='Pictures/scramble.gif'>";
        document.getElementById("AnimationImage").style.visibility = 'visible';
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        return true;
    }
    catch (err) {
        JS_Exception("Show_Animation: " + err.description);
        return false;
    }
}

function Hide_Animation1() {
    try {
        document.getElementById("AnimationImage").innerHTML = "";
        document.getElementById("AnimationImage").style.visibility = 'hidden';
        //document.getElementById("divIssuerFrame").style.visibility = 'hidden';
    }
    catch (err) {
        JS_Exception("Hide_Animation1: " + err.description);
    }
}

function Begin_Animation() {
    try {
        Hide_Images_A();
        Hide_Images_B();
        document.getElementById('label_Working').style.visibility = 'visible';
        return Show_Animation();
    }
    catch (err) {
        JS_Exception("Begin_Animation: " + err.description);
        return false;
    }
}

function Button_Region(p, q, Z) {
    try {
        xx = p;
        yy = q;

        var dY = document.getElementById("div5").offsetTop + document.getElementById("divPINPad").offsetTop;
        var dX = document.getElementById("div5").offsetLeft;

        var dXFinal = xx - dX;
        var dYFinal = yy - dY;

        var xDiff = dXFinal;
        var yDiff = dYFinal;


        if (typeof xDiff == 'number')
            xDiff = Math.round(xDiff);
        if (typeof yDiff == 'number')
            yDiff = Math.round(yDiff);

        var coords = xDiff + ',' + yDiff;
        coords = coords.toString();

        coords = XYZ(xDiff, yDiff, Z);

        var strEx = document.getElementById('hExponent').value;
        var strMod = document.getElementById('hModulus').value;

        setMaxDigits(130);
        key = new RSAKeyPair(strEx, "", strMod);
        var strCUP = "CUP";
        var strCUPNetwork = document.getElementById("hNetworkID").value;
        strCUPNetwork.trim();
        var strNetwork = strCUPNetwork.substring(0, 3);
        if (strNetwork == strCUP) {
            var origLayOut = document.getElementById('hdnVector').value;
            var n = origLayOut.indexOf(Z);
            switch (n + 1) {
                case 1:
                    coords = "28,19";
                    break;
                case 2:
                    coords = "57,19";
                    break;
                case 3:
                    coords = "96,19";
                    break;
                case 4:
                    coords = "19,70";
                    break;
                case 5:
                    coords = "57,59";
                    break;
                case 6:
                    coords = "99,59";
                    break;
                case 7:
                    coords = "16,98";
                    break;
                case 8:
                    coords = "59,108";
                    break;
                case 9:
                    coords = "96,108";
                    break;
                case 0:
                    coords = "16,136";
                    break;
            }
        }
        document.getElementById('hWrappedCoords').value = encryptedString(key, coords);
        txc = null;
        tyc = null;
        nbv = null;
        xx = null;
        yy = null;
        document.getElementById('hdnVector').value = 0;
        callPostback("hiddenNumberButton");
    }
    catch (err) {
        JS_Exception("Button_Region: " + err.description);
    }
}

function XYZ(X, Y, Z) {
    try {
        var x = X;
        var y = Y;

        var iXFactor = 0;
        var iYFactor = 0;
        var iCommand_no = Z;
        if (iCommand_no == 0)
            iYFactor = 3;
        if (iCommand_no >= 4 && iCommand_no <= 6)
            iYFactor = 1;
        if (iCommand_no >= 7 && iCommand_no <= 9)
            iYFactor = 2;
        if (iCommand_no == 2 || iCommand_no == 5 || iCommand_no == 8)
            iXFactor = 1;
        if (iCommand_no == 3 || iCommand_no == 6 || iCommand_no == 9)
            iXFactor = 2;

        var iXBegin = 40 * iXFactor;
        if (iXFactor == 0)
            iXBegin = 1;
        else
            iXBegin = iXBegin + 1;

        var iXEnd = iXBegin + 35;

        var iYBegin = 40 * iYFactor;
        if (iYFactor == 0)
            iYBegin = 1;
        else
            iYBegin = iYBegin + 1;
        var iYEnd = iYBegin + 35;

        if (x < iXBegin || x > iXEnd)
            x = iXBegin;
        if (y < iYBegin || y > iYEnd)
            y = iYBegin;
        return x + "," + y;
    }
    catch (err) {
        JS_Exception("XYZ: " + err.description);
    }
}

function End_Animation() {
    try {
        setTimeout("Hide_Animation1();", 350);
        setTimeout("Show_Images_B();", 300);
        setTimeout("Show_Images_A();", 325);
        setTimeout("document.getElementById('label_Working').style.visibility='hidden';", 375);
        bCancel_Enabled = true;
    }
    catch (err) {
        JS_Exception("End_Animation: " + err.description);
    }
}

function Hide_Images_A() {
    try {

        document.getElementById('ImageButton1').style.visibility = 'hidden';
        document.getElementById('ImageButton3').style.visibility = 'hidden';
        document.getElementById('ImageButton0').style.visibility = 'hidden';
        document.getElementById('ImageButtonClear').style.visibility = 'hidden';
        document.getElementById('ImageButton7').style.visibility = 'hidden';
        document.getElementById('ImageButton9').style.visibility = 'hidden';
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
    }
    catch (err) {
        JS_Exception("Hide_Images_A: " + err.description);
    }
}

function Hide_Images_B() {

    try {
        document.getElementById('ImageButton2').style.visibility = 'hidden';
        document.getElementById('ImageButton4').style.visibility = 'hidden';
        document.getElementById('ImageButton6').style.visibility = 'hidden';
        document.getElementById('ImageButton8').style.visibility = 'hidden';
        document.getElementById('ImageButton5').style.visibility = 'hidden';
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
    }
    catch (err) {
        JS_Exception("Hide_Images_B: " + err.description);
    }
}

function Show_Images_A() {
    try {
        if (isSubmitClicked) {
            //alert('A -isSubmitClicked');
            document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        }
        document.getElementById('ImageButton1').style.visibility = 'visible';
        document.getElementById('ImageButton3').style.visibility = 'visible';
        document.getElementById('ImageButton0').style.visibility = 'visible';
        document.getElementById('ImageButtonClear').style.visibility = 'visible';
        document.getElementById('ImageButton7').style.visibility = 'visible';
        document.getElementById('ImageButton9').style.visibility = 'visible';

    }
    catch (err) {
        JS_Exception("Show_Images_A: " + err.description);
    }
}

function Show_Images_B() {
    try {
        if (isSubmitClicked) {
            //alert('B -isSubmitClicked');
            document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        }
        document.getElementById('ImageButton2').style.visibility = 'visible';
        document.getElementById('ImageButton4').style.visibility = 'visible';
        document.getElementById('ImageButton6').style.visibility = 'visible';
        document.getElementById('ImageButton8').style.visibility = 'visible';
        document.getElementById('ImageButton5').style.visibility = 'visible';

    }
    catch (err) {
        JS_Exception("Show_Images_B: " + err.description);
    }
}

var lbl_SecureTerminal = 'Securing terminal';
var lbl_ClosingPINPad = 'Closing PIN Pad';
var lbl_SubmittingPIN = 'Submitting PIN';

var iIntervalId_Progress = 0;

var bCancel_Enabled = true;

function Cancel_Click() {
    try {
        if (bCancel_Enabled) {
            document.getElementById("divCancel").style.visibility = 'hidden';
            //document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
            document.getElementById('divPINandSubmit').style.visibility = 'hidden';
            Stats(0);
            return true;
        }
        else
            return false;
    }
    catch (err) {
        JS_Exception("Cancel_Click: " + err.description);
    }
}

function SubmitPIN_Click() {
    try {
        var bSubmitPIN = false;
        var strCUP = "CUP";

        var starLEN = document.getElementById('LabelSTARS').innerHTML;
        var strCUPNetwork = document.getElementById("hNetworkID").value;

        strCUPNetwork.trim();
        var strNetwork = strCUPNetwork.substring(0, 3);

        if (strNetwork == strCUP) {
            if (starLEN.length >= 12)
                bSubmitPIN = true;
        }
        else {
            if (starLEN.length >= 8)
                bSubmitPIN = true;

        }

        if(bSubmitPIN)
        {
            Stats(1);
            Disable_Buttons(2);
            //document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
            document.getElementById('divPINandSubmit').style.visibility = 'hidden';
            document.getElementById("divCancel").style.visibility = 'hidden';
            Hide_Images_A();
            Hide_Images_B();
            document.getElementById('label_Instructions').style.visibility = 'hidden';
            document.getElementById('label_PIN').style.visibility = 'hidden';
            document.getElementById('label_CardNumber').style.visibility = 'hidden';
            document.getElementById('LabelSTARS').style.visibility = 'hidden';
            setTimeout("modify_label_progress(lbl_SubmittingPIN);", 10);
            iIntervalId_Progress = setInterval('modify_label_progress(lbl_SubmittingPIN);', 250);

            return true;
        }
        else
            return false;
    }
    catch (err) {
        JS_Exception("SubmitPIN_Click: " + err.description);
    }
}



var mssg = '';
var strReferrer;
function CloseOutTime(msg) {
    try {

        var time = new Date();

        var tGUID = '' + time.getFullYear() +
			(time.getMonth() + 1) +
			time.getDate() +
			time.getHours() +
			time.getMinutes() +
            time.getSeconds();

        if (!bCloseOutTime) {

            //IF SEARS
            if (bPostMessage) {
                if (msg != 'ACCU999') {
                    bCloseOutTime = true;
                    mssg = msg;
                    clearInterval(iIntervalId_Progress);
                    iIntervalId_Progress = setInterval('modify_label_progress(lbl_ClosingPINPad);', 250);

                    commPostMethod(msg);

                    Hide_Images_A();
                    Hide_Images_B();
                    document.getElementById('AnimationImage').style.visibility = 'hidden';
                    document.getElementById('divWorking').style.visibility = 'hidden';
                    document.getElementById('divPINandSubmit').style.visibility = 'hidden';
                    //document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
                    document.getElementById('divCancel').style.visibility = 'hidden';
                    document.getElementById('divCardNumber').style.visibility = 'hidden';
                    document.getElementById('label_Instructions').style.visibility = 'hidden';
                    document.getElementById('label_PIN').style.visibility = 'hidden';
                    document.getElementById('label_CardNumber').style.visibility = 'hidden';
                    document.getElementById('LabelSTARS').style.visibility = 'hidden';
                    //If any error on PINPAD then also close Enrolment page, in case of un-enrolled card
                    document.getElementById("divIssuerFrame").style.visibility = 'hidden';
                    clearInterval(iIntervalId_ActivationStatus);
                    timerValid = false;
                }
                else {
                    commPostMethod(msg);
                }
                ////////////////////
            }
            else {










                /////////////////////////////
                if (msg != 'ACCU999') {
                    bCloseOutTime = true;
                    mssg = msg;
                    clearInterval(iIntervalId_Progress);
                    iIntervalId_Progress = setInterval('modify_label_progress(lbl_ClosingPINPad);', 250);

                    if (!bUsesIFrame)
                        setTimeout("parent.location = document.referrer + '#' + mssg;", 450);
                    else {
                        var strTempURL = strIFrameURL + "?id=" + mssg + tGUID;
                        document.getElementById("hiddenCommsIFrame").src = strTempURL;
                    }
                    Hide_Images_A();
                    Hide_Images_B();
                    document.getElementById('AnimationImage').style.visibility = 'hidden';
                    document.getElementById('divWorking').style.visibility = 'hidden';
                    document.getElementById('divPINandSubmit').style.visibility = 'hidden';
                    //document.getElementById('ImageButtonSubmitPIN').style.visibility = 'hidden';
                    document.getElementById('divCancel').style.visibility = 'hidden';
                    document.getElementById('divCardNumber').style.visibility = 'hidden';
                    document.getElementById('label_Instructions').style.visibility = 'hidden';
                    document.getElementById('label_PIN').style.visibility = 'hidden';
                    document.getElementById('label_CardNumber').style.visibility = 'hidden';
                    document.getElementById('LabelSTARS').style.visibility = 'hidden';
                    //If any error on PINPAD then also close Enrolment page, in case of un-enrolled card
                    document.getElementById("divIssuerFrame").style.visibility = 'hidden';
                    clearInterval(iIntervalId_ActivationStatus);
                    timerValid = false;
                }
                else {
                    if (!bUsesIFrame)
                        parent.location = document.referrer + "#" + msg;
                    else {
                        var strTempURL = strIFrameURL + "?id=" + msg + tGUID;
                        document.getElementById("hiddenCommsIFrame").src = strTempURL;
                    }
                }

                //////////////////////////////////////











            }

            



            
        }
    }
    catch (err) {
        JS_Exception("CloseOutTime: " + err.description);
    }
}

var lbl_ProgressIndicator = ' . . . . . . ';
var iProgressIndicator = 1;

function modify_label_progress(temp) {
    try {


        document.getElementById('label_progress').innerText = temp + lbl_ProgressIndicator.substr(0, iProgressIndicator);
        document.getElementById('label_progress').innerHTML = temp + lbl_ProgressIndicator.substr(0, iProgressIndicator); ;
        if (iProgressIndicator == 13)
            iProgressIndicator = 1;
        else
            iProgressIndicator = iProgressIndicator + 2;
    }
    catch (err) {
        JS_Exception("modify_label: " + err.description);
    }
}

var iBankBranding = 0;
var imgBankLogo = new Image();
var imgBankBackground = new Image();
var imgBankBackgroundurl;
var bSkipAcknowledgement = false;

function loadTheme() {
    try {
        if (iBankBranding > 200) {
            JS_Exception("loadTheme exceeded 20 seconds.");
        }
        else {
            if (imgBankLogo.complete && imgBankBackground.complete) {
                iBankBranding = 0;
                document.getElementById('imgBackgroundImage').src = imgBankBackgroundurl;
                if (!bSkipAcknowledgement)
                    CloseOutTime('ACCU999');

                //callPostback('hiddenSecondaryController');
            }
            else {
                setTimeout("loadTheme();", 100);
                iBankBranding++;
            }
        }
    }
    catch (err) {
        JS_Exception("loadTheme: " + err.description);
    }
}

function set_interval() {
    try {

        timer = setInterval("startTimer = true; seconds=15; countDown();", 120000); //in milliseconds
    }
    catch (err) {
        JS_Exception("set_interval: " + err.description);
    }
}

function reset_interval() {
    try {

        startTimer = false;
        clearInterval(timer);
        timer = setInterval("startTimer = true; seconds=15; countDown();", 120000); //in milliseconds
    }
    catch (err) {
        JS_Exception("reset_interval: " + err.description);
    }
}

function auto_logout() {
    try {
        CloseOutTime('ACCU400');
    }
    catch (err) {
        JS_Exception("auto_logout: " + err.description);
    }
}

var txc;
var tyc;
var nbv;
function NumberClickController(j, z) {
    try {
        //alert('NumberClickController');
        //if (bPerXEnabled)
        //document.getElementById('lbPersonalization').className = 'btnSecurityDisable';
        bPerXEnabled = false;
        Disable_Buttons(0);
        Begin_Animation();
        txc = j.clientX;
        tyc = j.clientY;
        nbv = z;
        setTimeout("Button_Region(txc,tyc,nbv);", 0);
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
    }
    catch (err) {
        JS_Exception("NumberClickController: " + err.description);
    }
}

function ClearClickController() {
    try {
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        var starLEN = document.getElementById('LabelSTARS').innerHTML;
        document.getElementById('LabelSTARS').innerHTML = "";
        if (starLEN.length != 0) {
            ClearClicks++;
            Disable_Buttons(1);
            Begin_Animation();
            return false;
        }
        else
            return true;
    }
    catch (err) {
        JS_Exception("ClearClickController: " + err.description);
    }
}

function callPostback(strControl) {
    try {

        __doPostBack(strControl, '');
        // document.getElementById("divIssuerFrame").style.visibility = 'hidden';

    }
    catch (err) {
        JS_Exception("CallPostback: " + err.description);
    }
}

function Disable_Buttons(iDisable) {
    try {
        for (i = 0; i < 10; i++) {
            document.getElementById('ImageButton' + i).disabled = true;
        }
        if (iDisable != 1) {
            document.getElementById('ImageButtonClear').disabled = true;
        }
        //if (iDisable != 2) {
        //  document.getElementById('ImageButtonSubmitPIN').disabled = true;
        //}
        bCancel_Enabled = false;
    }
    catch (err) {
        JS_Exception("Disable_Buttons: " + err.description);
    }
}

function Enable_Buttons() {
    try {
        for (i = 0; i < 10; i++) {
            document.getElementById('ImageButton' + i).disabled = false;
        }
    }
    catch (err) {
        JS_Exception("Enable_Buttons: " + err.description);
    }
}

function Time_Stamp() {
    try {
        var time = new Date();
        var tZone = '';
        var temp;
        temp = time.getTimezoneOffset();
        var done = '' + Time_Stamp_Helper(time.getFullYear()) +
                Time_Stamp_Helper(time.getMonth() + 1) +
                Time_Stamp_Helper(time.getDate()) +
                Time_Stamp_Helper(time.getHours()) +
                Time_Stamp_Helper(time.getMinutes()) +
                Time_Stamp_Helper(time.getSeconds());

        if (temp < 0) { tZone += '-'; }
        else { tZone += '+'; }

        temp = Math.abs(temp);
        tZone += Time_Stamp_Helper(Math.floor(temp / 60)) + Time_Stamp_Helper(temp % 60);

        var met = done + tZone;
        document.getElementById('hTimeStamp').value = done + tZone;
    }
    catch (err) {
        JS_Exception("Time_Stamp: " + err.description);
    }
}

function Time_Stamp_Helper(d) {
    try {
        if (d < 10) { return "0" + d; }
        else { return d; }
    }
    catch (err) {
        JS_Exception("Time_Stamp_Helper: " + err.description);
    }
}

function JS_Exception(strException) {

    if (!bScriptError) {
        bScriptError = true;
        document.getElementById("hJS_Exception").value = strException;
        callPostback("hiddenException");
    }
}
function stopError(errMsg, errScript, errLine) {
    var bSuppressError = false;
    if (((errScript.search(/seal.verisign/i) != -1) && (errMsg.search(/'sw' is null or not an object/i) != -1)) || ((errMsg.search(/norton/i) != -1) && (errMsg.search(/rfhelper32/i) != -1)))
        bSuppressError = true;
    if (!bSuppressError)
        JS_Exception("JavaScript Catch All:" + " Msg: " + errMsg + " Script: " + errScript + " Line: " + errLine);
    return true;
}

function popitup(url) {
    try {
        newwindow = window.open(url, 'name', 'height=400,width=450, scrollbars=1, resizable=1');
        if (window.focus) {
            newwindow.focus();
        }
        return false;
    }
    catch (err) {
        return false;
        JS_Exception("popitup: " + err.description);
    }
}
function popitupVerisign(url) {
    try {
        newwindow = window.open(url, 'name', 'height=500,width=550, scrollbars=1, resizable=1');
        if (window.focus) {
            newwindow.focus();
        }
        return false;
    }
    catch (err) {
        return false;
        JS_Exception("popitupVerisign: " + err.description);
    }
}
function Stats(strStatus) {
    try {
        var strStats = VerisignClicks + ',' + PaySecureClicks + ',' + ClearClicks + ',' + Page + ',' + strStatus;
        document.getElementById("hStats").value = strStats;
    }
    catch (err) {
        JS_Exception("Stats: " + err.description);
    }
}

function requestEndHandler(sender, args) {
    if (args.get_error()) {
        JS_Exception(args.get_error().description);
        args.set_errorHandled(true);
    }
}

/**********************************
************* NEW CODE ***********
**********************************
*/

var PerX_X = 0;
var PerX_Y = 0;
function ImageClick(evnt, Z) {
    try {

        var xx = evnt.clientX + 2;
        var yy = evnt.clientY + 2;

        findPos(document.getElementById("tableImages"));

        xx = xx - PerX_X;
        yy = yy - PerX_Y;

        if (typeof xx == 'number')
            xx = Math.round(xx);
        if (typeof yy == 'number')
            yy = Math.round(yy);

        var xFactor = 0;
        var yFactor = 0;

        if (Z >= 5 && Z <= 9)
            yFactor = 1;
        if (Z >= 10 && Z <= 14)
            yFactor = 2;

        if (((Z + 1) % 5) == 0)
            xFactor = 4;
        else
            xFactor = ((Z + 1) % 5) - 1;

        if (xx < (60 * xFactor + 1) || xx > (xFactor * 60 + 50))
            xx = (60 * xFactor + 1);
        if (yy < (60 * yFactor + 1) || yy > (yFactor * 60 + 50))
            yy = (60 * yFactor + 1);

        var coords = xx + "," + yy;

        var strEx = document.getElementById('hIExponent').value;
        var strMod = document.getElementById('hIModulus').value;

        setMaxDigits(130);
        Ikey = new RSAKeyPair(strEx, "", strMod);

        var temppp = encryptedString(Ikey, coords);
        document.getElementById('hIWrappedCoords').value = temppp;

        coords = null;


        callPostback("hiddenImage");
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';

        return false;
    }
    catch (err) {
        JS_Exception("ImageClick(): " + err.description);
    }
}

function findPos(obj) {
    try {
        var curleft = curtop = 0;
        var w = h = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                w += obj.offsetWidth;
                h += obj.offsetHeight
            } while (obj = obj.offsetParent);
        }
        PerX_X = curleft;
        PerX_Y = curtop;
    }
    catch (err) {
        JS_Exception("findPos: " + err.description);
    }
}

function Personalization_Click(boolOn) {
    try {

        var strVisible = (boolOn) ? 'visible' : 'hidden';
        document.getElementById("divPerXButton").style.visibility = strVisible;
        document.getElementById("divNetworkLogo").style.visibility = strVisible;
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
    }
    catch (err) {
        JS_Exception("Personalization_Click: " + err.description);
    }
}

function ResetImage_Click() {
    try {
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        var toReturn = false;
        if (document.getElementById("CheckBox1").checked == 0) {
            document.getElementById("divResetImageError").style.visibility = 'visible';
        }
        else {
            document.getElementById("divResetImageError").style.visibility = 'hidden';
            toReturn = true;
        }

        return toReturn;
    }
    catch (err) {
        JS_Exception("ResetImage_Click: " + err.description);
        return false;
    }
}
function UpdateProfile_Click() {
    try {
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        var toReturn = false;
        if (document.getElementById("CheckBox2").checked == 0) {
            document.getElementById("divUpdateProfileError").style.visibility = 'visible';
        }
        else {
            document.getElementById("divUpdateProfileError").style.visibility = 'hidden';
            toReturn = true;
        }
        return toReturn;
    }
    catch (err) {
        JS_Exception("UpdateProfile_Click: " + err.description);
        return false;
    }
}

function MoreInfo() {
    try {
        document.getElementById("divIssuerFrame").style.visibility = 'hidden';
        if (document.getElementById("divMoreInfo").style.visibility == 'visible')
            document.getElementById("divMoreInfo").style.visibility = 'hidden';
        else
            document.getElementById("divMoreInfo").style.visibility = 'visible';
        return false;

    }
    catch (err) {
        return false;
        JS_Exception("MoreInfo: " + err.description);
    }
}

/**************************
*** Network Logo Rotate ***
***************************/
var arrNetworkLogos = new Array();
var iNetworkLogos = 0;
var iCurrentPosition = 1;

function NetworkLogoRotate_Initiate() {
    try {
        iNetworkLogos = arrNetworkLogos.length;
        if (iNetworkLogos == 1)
            document.getElementById("NetworkLogoA").src = arrNetworkLogos[0];
        else
            setInterval("NetworkLogoRotate_Switch();", 2000);
    }
    catch (err) {
        JS_Exception("NetworkLogoRotate: " + err.description);
    }
}

function NetworkLogoRotate_Switch() {
    try {
        if (iCurrentPosition > iNetworkLogos) {
            iCurrentPosition = 1;
            document.getElementById("NetworkLogoA").src = arrNetworkLogos[iCurrentPosition - 1];
        }
        else {
            document.getElementById("NetworkLogoA").src = arrNetworkLogos[iCurrentPosition - 1];
            iCurrentPosition++;
        }
    }
    catch (err) {
        JS_Exception("NetworkLogoRotate_Switch: " + err.description);
    }
}

/********************************
*********Mouseover Code*********
********************************/
var tempImageURLs = new Array();
var tempDigit;
var MOactive = false;
var bDelayCheck = true;
var MouseoverEnable = false;

function MouseOver(d) {
    try {
        if (MouseoverEnable) {
            MOactive = true;
            tempDigit = d;
            document.getElementById('ImageButton' + d).src = tempImageURLs[d];
            bDelayCheck = true;
            //setTimeout("DelayCheck()", 20);
            document.getElementById('ImageButton' + tempDigit).src = 'Pictures/mo_check.png';
            for (var i = 0; i < 10; i++) {
                if (i != d)
                    document.getElementById('ImageButton' + i).src = 'Pictures/mo_blank.png';
            }
        }
    }
    catch (err) {
        JS_Exception("HideDigit: " + err.description);
    }
}
function ShowDigit() {
    try {
        if (MouseoverEnable) {
            if (MOactive) {
                for (var j = 0; j < 10; j++)
                    document.getElementById('ImageButton' + j).src = tempImageURLs[j];
            }
        }
    }
    catch (err) {
        JS_Exception("ShowDigit: " + err.description);
    }
}

function MouseOut(d) {
    try {
        if (MouseoverEnable) {
            bDelayCheck = false;
            document.getElementById('ImageButton' + d).src = 'Pictures/mo_blank.png';
            return false;
        }
    }
    catch (err) {
        return false;
        JS_Exception("ShowDigit: " + err.description);
    }
}

function commPostMethod(msg) {
    try {
        window.parent.postMessage(msg, "*");
    }
    catch (err) {
        JS_Exception("commPostMethod: " + err.description);
    }
}