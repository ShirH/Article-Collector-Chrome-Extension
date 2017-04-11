import React from 'react';
import ReactDOM from 'react-dom';

chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggleArticleCollectorSideBar"){
        toggle();
    }
})

//var iframe = document.createElement('iframe');
//iframe.style.background = "green";
//iframe.style.height = "100%";
//iframe.style.width = "0px";
//iframe.style.position = "fixed";
//iframe.style.top = "0px";
//iframe.style.right = "0px";
//iframe.style.zIndex = "9000000000000000000";
//iframe.frameBorder = "none";
//iframe.src = chrome.extension.getURL("popup.html");
//iframe.name = "sideBarIframe";
//
//document.body.appendChild(iframe);


var Component = React.createClass({
    iframe: function () {
        return {
            __html: this.props.iframe
        }
    },

    render: function() {
        return <div>
            <div dangerouslySetInnerHTML={ this.iframe() } />
        </div>;
    }
});

var iframe = '<iframe src="popup.html" width="400px" height="100%"></iframe>';

ReactDOM.render(
    <Component iframe={iframe} />,
    document.getElementById('body')
);




function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}
//
//$('[data-toggle="collapse"]').click(function() {
//    debugger;
//    document.getElementById('#sideBarIframe').contentWindow.location.reload();
//});

//$(document).on('data-attribute-changed', function() {
//    alert('Data changed to: ' );
//});
