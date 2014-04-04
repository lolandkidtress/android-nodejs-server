<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<head>
	<title></title>
</head>
<script src="/socket.io/socket.io.js"></script>
<script type="text/javascript">
function encrypted(formObj){
  var socket = io.connect('http://localhost');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

}
</script>
<body>
<FORM name= 'form' id='form' action='http://127.0.0.1:8000/'
       enctype="multipart/form-data"
       method="post" >

   <INPUT type="button" value="Send" onclick="encrypted();"> 
 </FORM>
</body>
</html>


