    var connection = new WebSocket('ws://' + location.hostname + ':8888/', ['mwp'])
    var msgAck=false; //Flag that comes true when received data
    
    connection.onmessage = function (event){
      check(event.data);
    }

    function check(msg){
      if(msg == "ok")msgAck=true;
    }
    
    function requestOk(){
      connection.send("something");
    }
    //Normal program flow
    requestOk();//Server will return "ok"
    while(!msgAck);//Wait server response