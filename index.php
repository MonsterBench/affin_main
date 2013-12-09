<!DOCTYPE html>
<html>
<head>
<title>Affinity Counts</title>
<style type="text/css">
	html, body {
	margin: 0;
	padding: 0;
	background:url('images/bg.jpg');
	font-family: Arial, Helvetica, sans-serif;
	}
	
	.wrapper {
		margin:0 auto;
	}
	
	
	.header {
	margin-top:30px;
	position:relative;
	box-shadow:0px 0px 30px #aaa;
	}
	
	.h-nav {
	position:fixed;
	top:0px;
	width:100%;
	z-index:800;
	box-shadow:0px 0px 25px #fff;
	}
	
	.h-nav h1 {
	margin-bottom:0;
	}
	
	.bar {
	position:relative;
	border-top:2px solid black;
	width:100%;
	height:60px;
	color:white;
	margin:0 auto;
	/* IE10 Consumer Preview */ 
background-image: -ms-linear-gradient(top, #555555 0%, #222222 40%, #111111 100%);

/* Mozilla Firefox */ 
background-image: -moz-linear-gradient(top, #555555 0%, #222222 40%, #111111 100%);

/* Opera */ 
background-image: -o-linear-gradient(top, #555555 0%, #222222 40%, #111111 100%);

/* Webkit (Safari/Chrome 10) */ 
background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #555555), color-stop(0.4, #222222), color-stop(1, #111111));

/* Webkit (Chrome 11+) */ 
background-image: -webkit-linear-gradient(top, #555555 0%, #222222 40%, #111111 100%);

/* W3C Markup, IE10 Release Preview */ 
background-image: linear-gradient(to bottom, #555555 0%, #222222 40%, #111111 100%);
	}
	
	.bar-wrap {
	position:relative;
	width:950px;
	margin:0 auto;
	}
	
	.logo {
	position:relative;
	float:left;
	text-shadow:1px 1px 0px black;
	color:white;
	margin-top:12px;
	letter-spacing:0px;
	}
	
	.logo h1 {
	margin:0;
	}
	
	.logo h1 span {
	background: url('images/gradient-dark-stripe-hz.png') repeat-x;
  	position: absolute;
  	display: block;
  	width: 100%;
  	height: 31px;
  	margin-top:7px;
  	opacity:.9;
  	margin-left:-1px;
	}
	
	.quote {
	position:absolute;
	top:;
	right:175px;
	/* IE10 Consumer Preview */ 
background-image: -ms-radial-gradient(center top, ellipse farthest-side, #A9E34B 0%, #83B13A 75%, #77A135 100%);

/* Mozilla Firefox */ 
background-image: -moz-radial-gradient(center top, ellipse farthest-side, #A9E34B 0%, #83B13A 75%, #77A135 100%);

/* Opera */ 
background-image: -o-radial-gradient(center top, ellipse farthest-side, #A9E34B 0%, #83B13A 75%, #77A135 100%);

/* Webkit (Safari/Chrome 10) */ 
background-image: -webkit-gradient(radial, center top, 0, center top, 477, color-stop(0, #A9E34B), color-stop(0.75, #83B13A), color-stop(1, #77A135));

/* Webkit (Chrome 11+) */ 
background-image: -webkit-radial-gradient(center top, ellipse farthest-side, #A9E34B 0%, #83B13A 75%, #77A135 100%);

/* W3C Markup, IE10 Release Preview */ 
background-image: radial-gradient(ellipse farthest-side at center top, #A9E34B 0%, #83B13A 75%, #77A135 100%);
	display: inline-block;
	padding:10px 5px 0 5px;
	margin-top:10px;
	color: #fff;
	text-decoration: none;
	font-weight: bold;
	line-height: 1;
	-moz-border-radius: 20px;
	-webkit-border-radius: 20px;
	-moz-box-shadow: 0 1px 3px #999;
	-webkit-box-shadow: 0 0px 15px #aaa;
	text-shadow: 0 1px 1px #222;
	border-bottom: 1px solid #222;
	cursor: pointer;
	width:125px;
	height:30px;
	font-size:16px;
	text-align:center;
	-webkit-transition: all 0.4s ease-in-out;
	-moz-transition: all 0.4s ease-in-out;
	-o-transition: all 0.4s ease-in-out;
 	transition: all 0.4s ease-in-out;
	}
	
	.quote:hover {
	box-shadow:0px 0px 30px #ccc;
	}
	
	.contact {
	position:relative;
	float:right;
	width:150px;
	color:#ddd;
	margin-top:15px;
	font-size:13px;
	font-weight:bold;
	text-align:right;
	}
	
	.content {
	position:relative;
	margin:0 auto;
	max-width: 950px;
	}
	
	.p-wrap {
	overflow:hidden;
	/* IE10 Consumer Preview */ 
background-image: -ms-linear-gradient(left, #999999 0%, #BBBBBB 10%, #CCCCCC 20%, #CCCCCC 80%, #BBBBBB 90%, #999999 100%);

/* Mozilla Firefox */ 
background-image: -moz-linear-gradient(left, #999999 0%, #BBBBBB 10%, #CCCCCC 20%, #CCCCCC 80%, #BBBBBB 90%, #999999 100%);

/* Opera */ 
background-image: -o-linear-gradient(left, #999999 0%, #BBBBBB 10%, #CCCCCC 20%, #CCCCCC 80%, #BBBBBB 90%, #999999 100%);

/* Webkit (Safari/Chrome 10) */ 
background-image: -webkit-gradient(linear, left top, right top, color-stop(0, #999999), color-stop(0.1, #BBBBBB), color-stop(0.2, #CCCCCC), color-stop(0.8, #CCCCCC), color-stop(0.9, #BBBBBB), color-stop(1, #999999));

/* Webkit (Chrome 11+) */ 
background-image: -webkit-linear-gradient(left, #999999 0%, #BBBBBB 10%, #CCCCCC 20%, #CCCCCC 80%, #BBBBBB 90%, #999999 100%);

/* W3C Markup, IE10 Release Preview */ 
background-image: linear-gradient(to right, #999999 0%, #BBBBBB 10%, #CCCCCC 20%, #CCCCCC 80%, #BBBBBB 90%, #999999 100%);
	}
/*___________Services____________*/
	.services {
	position:relative;
	overflow:hidden;
	min-width:950px;
	padding-left:2px;
	}
	
	.skills {
	position:relative;
	float:left;
	width:235px;
	text-align:center;
	cursor: pointer;
	height:240px;
	padding:20px 0px 20px 0px;
	-webkit-transition: all 0.4s ease-in;
	-moz-transition: all 0.4s ease-in-out;
	-o-transition: all 0.4s ease-in-out;
 	transition: all 0.4s ease-in-out;
	}
	
	.skills:hover {
	box-shadow:0px 2px 4px #999,0px 10px 30px rgba(255,255,255,0.9) inset,-5px 0px 10px rgba(225,225,225,0.5),5px 0px 10px rgba(225,225,225,0.5);
	}
	
	.skills p {
	-webkit-transition: all 0.4s ease-in;
	-moz-transition: all 0.4s ease-in-out;
	-o-transition: all 0.4s ease-in-out;
 	transition: all 0.4s ease-in-out;
 	color:#555;
 	text-align:left;
	margin:10px 10px 10px 10px;
	padding-left:15px;
	line-height:22px;
	text-shadow: 0px 1px 2px #aaa;
	}
	
	.pushed {
	box-shadow:0px 2px 4px #aaa,0px 10px 30px rgba(255,255,255,0.9) inset,0px 20px 10px rgba(225,225,225,0.3);
	}
	
/*_________________Portfolio__________________*/	
	.portfolio {
	margin:0 auto;
	}
	
	.item-wrap {
	border-radius:20px;
	overflow: hidden;
	}

	.item {
	float:left;
	position:relative;
	margin:10px;
	cursor: pointer;
	border-radius:20px;
	width:295px;
	height:200px;
	border-bottom:1px solid #777;
	-webkit-transition: all 0.4s ease-in-out;
	-moz-transition: all 0.4s ease-in-out;
	-o-transition: all 0.4s ease-in-out;
 	transition: all 0.4s ease-in-out;
 	box-shadow:0px 2px 10px #999;
 	overflow: hidden;
	}
	
	.item::before
	{
    display:block;
    content:'';
    position:absolute;
    width:100%;
    height:100%;
	box-shadow:0px 10px 10px rgba(255,255,255,0.3) inset,0px -10px 10px rgba(51,51,51,0.2) inset;
	z-index:500;
	border-radius:20px;
	}
	
	.item img {
	width:700px;
	-webkit-transition: all 1s ease-in-out;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
	}
	
	.item:hover img {
	width:600px;
	}
	
	
	.item:hover {
	box-shadow:0px 10px 10px rgba(255,255,255,0.3) inset,0px -10px 10px rgba(51,51,51,0.2) inset,0px 2px 10px #999, 0px 0px 25px 15px rgba(255,255,255,0.2);	
	}
	
	.item:hover .cover {
 	color:white;
 	text-shadow: 1px 1px 1px #000;
 	height:130px;
 	background: -moz-linear-gradient(top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%); /* FF3.6+ */
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0.5)), color-stop(100%,rgba(0,0,0,0))); /* Chrome,Safari4+ */
	background: -webkit-linear-gradient(top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%); /* Chrome10+,Safari5.1+ */
	background: -o-linear-gradient(top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%); /* Opera 11.10+ */
	background: -ms-linear-gradient(top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%); /* IE10+ */
	background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%); /* W3C */
	filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
	box-shadow:0px 10px 10px rgba(255,255,255,0.1) inset;
	}
	
	
	.cover {
	position:absolute;
	padding-top:10px;
	padding-left:10px;
	width:285px;
	height:50px;
	-webkit-transition: all 0.4s ease-in-out;
	-moz-transition: all 0.4s ease-in-out;
	-o-transition: all 0.4s ease-in-out;
 	transition: all 0.4s ease-in-out;
 	font-size:20px;
 	color:transparent;
	border-radius:20px;
	}
	
	.cover-text {
	position:absolute;
	top:110px;
	width:295px;
	height:100px;
	z-index:3;
	color:white;
	margin-left:10px;
	display:none;
	text-shadow: 0px 1px 0px #000;
	}
	
	.footer {
		background-color:#777;
		height:50px;
		width:100%;
		margin-bottom:40px;

	}
	
	.footer p {
	color:white;
	padding:5px;
	}
	
	#design {
	display:none;
	}
	
	#web {
	display:none;
	}
	
	#mobile {
	display:none;
	}
	
	#seo {
	display:none;
	}
	
	.fade-in {
	-webkit-transition: all 1.3s ease-in-out;
	-moz-transition: all 1.3s ease-in-out;
	-o-transition: all 1.3s ease-in-out;
 	transition: all 1.3s ease-in-out;
	}

/*________________Popup_________________________*/	
	.popup1 {
	position:fixed;
	top:50%;
	margin-top:-260px;
	left:50%;
	margin-left:-300px;
	height:520px;
	width:600px;
	background-color:white;
	z-index:999;
	-moz-border-radius: 40px;
	display:none;
	}
	
	.popup2 {
	position:fixed;
	top:50%;
	margin-top:-260px;
	left:50%;
	margin-left:-500px;
	height:520px;
	width:1000px;
	background-color:white;
	z-index:999;
	-moz-border-radius: 40px;
	display:none;
	}
	
	.pop-wrap {
	margin:20px;
	}
	
	.pop-border1 {
	position:fixed;
	top:50%;
	margin-top:-280px;
	background-color:#000;
	border:1px solid black;
	left:50%;
	margin-left:-320px;
	height:560px;
	width:640px;
	opacity:0.5;
	-moz-border-radius: 15px;
	border-radius: 15px;
	display:none;
	z-index:998
	}
	
	.pop-border2 {
	position:fixed;
	top:50%;
	margin-top:-280px;
	background-color:#000;
	border:1px solid black;
	left:50%;
	margin-left:-520px;
	height:560px;
	width:1040px;
	opacity:0.5;
	-moz-border-radius: 15px;
	border-radius: 15px;
	display:none;
	z-index:998
	}
	
	.popup-bg {
	position:fixed;
	top:0;
	left:0;
	height:100%;
	width:100%;
	background-color:black;
	z-index:998;
	opacity:.7;
	display:none;
	}
	
	.nav-fill {
	display:none;
	height:90px;
	width:100%;
	}
	
	
	#seo {
	display:block;
	}
	
	#web {
	display:block;
	}
	
	#facebook {
	position:absolute;
	right:80px;
	top:-5px;
	height:40px;
	width:40px;
	background:url('images/Glyph/Facebook.png');
	float:right;
	cursor: pointer;
	}
	
	#facebook:hover {
	margin-top:-7px;
	margin-right:-7px;
	background:url('images/Color/Facebook.png');
	height:52px;
	width:52px;
	}
	
	#linkedin {
	position:absolute;
	right:40px;
	top:-5px;
	height:40px;
	width:40px;
	background:url('images/Glyph/LinkedIn.png');
	float:right;
	cursor: pointer;
	}
	
	#linkedin:hover {
	margin-top:-7px;
	margin-right:-7px;
	background:url('images/Color/LinkedIn.png');
	height:52px;
	width:52px;
	}
	
	#twitter {
	position:absolute;
	right:0px;
	top:-5px;
	height:40px;
	width:40px;
	background:url('images/Glyph/Twitter.png');
	float:right;
	cursor: pointer;
	}
	
	#twitter:hover {
	margin-top:-7px;
	margin-right:-7px;
	background:url('images/Color/Twitter.png');
	height:52px;
	width:52px;
	}
	
	.divider h1 {
	margin-top:0px;
	position:relative;
	background-color:#aaa;
	font-size:25px;
	padding:5px;margin-bottom:0px;
	/* IE10 Consumer Preview */ 
background-image: -ms-linear-gradient(top, #AAAAAA 0%, #999999 100%);

/* Mozilla Firefox */ 
background-image: -moz-linear-gradient(top, #AAAAAA 0%, #999999 100%);

/* Opera */ 
background-image: -o-linear-gradient(top, #AAAAAA 0%, #999999 100%);

/* Webkit (Safari/Chrome 10) */ 
background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #AAAAAA), color-stop(1, #999999));

/* Webkit (Chrome 11+) */ 
background-image: -webkit-linear-gradient(top, #AAAAAA 0%, #999999 100%);

/* W3C Markup, IE10 Release Preview */ 
background-image: linear-gradient(to bottom, #AAAAAA 0%, #999999 100%);
	box-shadow:0px 0px 5px #aaa,0px 1px 0px #777,0px 10px 10px rgba(255,255,255,0.3) inset,0px -10px 10px rgba(51,51,51,0.1) inset;
	text-shadow: 0px -1px 0px #333,0px 1px 1px #ccc,1px 1px 0px rgba(255,255,255,0.1);
	color:#545454;
	border-top:1px solid #999;
	border-bottom:1px solid #777;
	z-index:10;
	}
	
	h2 span {
	background: url('images/gradient-glossy.png') repeat-x;
  	position: absolute;
  	display: block;
  	width: 100%;
  	height: 21px;
  	margin-top:4px;
  	opacity:.6;
	}
	
	h2 {
	margin-bottom:0px;
	text-shadow: 0px 2px 3px #aaa,0px 1px 0px #000;
	color:#333;
	font-size:24px;
	}
	
	.menu {
	position:absolute;
	left:280px;
	top:10px;
	font-size:16px;
	cursor: pointer;
	}
	
	.menu li {
	text-decoration:none;
	float:right;
	display:block;
	padding:0 10px 0 10px;
	text-shadow:0px 3px 30px #fff, 0px 1px 0px #000;
	list-style:none;
	-webkit-transition: all 0.2s ease-in-out;
	-moz-transition: all 0.2s ease-in-out;
	-o-transition: all 0.2s ease-in-out;
 	transition: all 0.2s ease-in-out;
	}
	
	.menu li:hover {
	text-shadow:0px 1px 1px #777,0px 1px 10px #fff;
	}
	
	.contact a {
	text-decoration:none;
	color:#eee;
	}
	
	#w-one {
	font-weight:999;
	font-style:italic;
	margin-right:3px;
	float:left;
	}
	
	#w-two {
	float:left;
	font-weight:300;
	letter-spacing:1px;
	}
	
	.w-one {
	text-shadow:0px -1px 0px #4AC6FF;
	color:#3285ab;
	}
	
	.w-two {
	color:#eee;
	text-shadow:0px -1px 0px #fff;
	}


/*_______________Team Section________________*/	
	.polaroid {
	float:left;
  	position: relative;
  	border: 10px solid #fff;
  	border-bottom: 45px solid #fff;
  	box-shadow: 0px 0px 5px 0px #bbb,0px 1px 5px 0px #bbb;
  	width:200px;
  	height:200px;
  	-webkit-transition: all 0.5s ease-in-out;
	-moz-transition: all 0.5s ease-in-out;
	-o-transition: all 0.5s ease-in-out;
 	transition: all 0.5s ease-in-out;
 	overflow: hidden;
	}
 
 	.polaroid:hover {
 	box-shadow: 0px 0px 5px 0px #aaa,0px 1px 5px 0px #aaa;
 	}
 
	.polaroid img {
  	height: 200px;
 	 width: 200px;
 
  	-webkit-transition: all 1s ease;
    	 -moz-transition: all 1s ease;
       -o-transition: all 1s ease;
      -ms-transition: all 1s ease;
          transition: all 1s ease;
	}
 
	.team:hover .polaroid img {
	margin:-5px 0 0 -5px;
 	 width: 205px;
  	height: 205px;
	}
	
	.team {
	position:relative;
	padding:20px;
	margin:0 auto;
	overflow:hidden;
	min-width:950px;
	}
 
 	.team-text {
 	position:relative;
 	padding:0px;
 	float:left;
 	margin:10px 0 0 20px;
 	font-size:18px;
 	width:670px;
 	padding-bottom:10px;
 	}
 	
 	.team-text img {
 	vertical-align:middle;
 	}
 	
 	.team-text h1 {
 	margin:0;
 	padding:0;
 	}
 	
 	.team-text h2 {
 	margin:0;
 	padding:0;
 	}
 	
 	.team-text p {
 	margin:0 0 15px 0;
 	padding:5px 0 0 0;
 	color:#333;
 	-webkit-transition: all 1s ease;
	-moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
 	}
 
	.p-quote {
	border-top:1px dashed #999;
	margin-top:10px;
	padding:5px;
	float:left;
	width:650px;
	font-size:18px;
	color:transparent;
	letter-spacing:1px;	
	-webkit-transition: all 1s ease;
	-moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    -ms-transition: all 1s ease;
    transition: all 1s ease;
	} 
	
	.team:hover .p-quote {
	color:#3285ab;
	text-shadow:0px 0px 1px #25617D,0px -1px 0px #4BC6FF;
	margin-left:5px;
	}
 
	.picture img {
	margin-right:40px;
	border: 5px solid #fff;
	box-shadow: 0px 0px 5px 0px #999,0px 2px 3px 0px #777 ;
	}
	
	hr.style-one {
    border: 0;
    height: 1px;
    background: #333;
    background-image: -webkit-linear-gradient(left, #ddd, #999, #ddd); 
    background-image:    -moz-linear-gradient(left, #ddd, #999, #ddd); 
    background-image:     -ms-linear-gradient(left, #ddd, #999, #ddd); 
    background-image:      -o-linear-gradient(left, #ddd, #999, #ddd); 
	}

	.about-us li {
	float:left;
	width:210px;
	padding:5px;
	font-size:18px;
	}
	
	ul.about-us {
	margin-top:-10px;
	padding-top:0px;
	margin-bottom:175px;
	list-style:none;
	text-shadow:0px -1px 1px #fff, 0px 1px 1px #999;
	}
	
	.our-mission h3 {
	margin:0px;
	padding:0;
	text-shadow:0px -1px 1px #fff, 0px 1px 5px #999;
	}
	
	p.our-mission {
	font-size:18px;
	color:#333;
	text-shadow: 0px 1px 2px #ddd;
	margin-bottom:30px;
	}
	
/*____________Contact Form___________________*/	
	.contact-us {
	display:none;
	}
	
	input, textarea {   
    padding: 9px;  
    border: solid 1px #E5E5E5;  
    outline: 0;  
    font: normal 13px/100% Verdana, Tahoma, sans-serif;  
    width: 200px;  
    background: #FFFFFF;  
    }  
  
textarea {   
    width: 400px;  
    max-width: 400px;  
    height: 100px;  
    line-height: 150%;  
    }  
  
input:hover, textarea:hover,  
input:focus, textarea:focus {   
    border-color: #C9C9C9;   
    }  
  
.form label {   
    margin-left: 10px;   
    color: #999999;   
    }  
  
.submit input {  
    width: auto;  
    padding: 9px 15px;  
    background: #617798;  
    border: 0;  
    font-size: 14px;  
    color: #FFFFFF;  
    }
	
	.process-wrap {
	position:relative;
	overflow:hidden;
	min-width:950px;
	padding-left:5px;
	margin:20px 0 20px 0;
	}
	
	.process { 	
	position:relative;
	margin:10px;
	background-color:red;
	border-radius:200px;
	box-shadow: inset 0px 0px 0px 20px rgba(255,255,255,.6);
	position:relative;
	float:left;
	width:215px;
	height:450px;
	text-align:center;
	padding:20px 0px 20px 0px;
	-webkit-transition: all 1s ease-in;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
 	color:white;
	}
	
	.process:hover {
	box-shadow: inset 0px 0px 0px 1px rgba(255,255,255,.6);
	}
	
	.process img {
	position:absolute;
	top:20px;
	left:50%;
	margin-left:-46px;
	}
	
	.process:hover p {
	color:white;
	z-index:60;
	}
	
	
	.process p {
	top:200px;
	position:absolute;
	color:transparent;
	-webkit-transition: all 1s ease-in;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
 	padding:20px;
 	z-index:60;
	}
	
	.process h2 {
	top:275px;
	position:absolute;
	color:white;
	font-size:30px;
	text-shadow:none;
	-webkit-transition: all 1s ease-in;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
	}
	
	.process:hover h3 {
	color:white;
	}
	
	.process h3 {
	top:150px;
	position:absolute;
	color:transparent;
	font-size:26px;
	text-shadow:none;
	-webkit-transition: all 1s ease-in;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
 	z-index:60;
	}
	
	.process:hover .p-cover {
	top:0px;
	left:0px;
	height:100%;
	width:100%;
	}
	
	.p-cover {
	top:50%;
	left:50%;
	height:0px;
	width:0px;
	position:absolute;
	-webkit-transition: all 1s ease-in;
	-moz-transition: all 1s ease-in-out;
	-o-transition: all 1s ease-in-out;
 	transition: all 1s ease-in-out;
 	border-radius:200px;
 	z-index:20;
	}
	
	.red {background-color: #ca4c4d;}
	.blue {background-color: #3285ab;}
	.yellow {background-color: #dba209;}
	.green {background-color: #83b13a;}
	
	.c-red {background-color: rgba(145, 55, 56, .8);}
	.c-blue {background-color: rgba(42, 111, 143, .8);}
	.c-yellow {background-color: rgba(184, 136, 8, .8);}
	.c-green {background-color: rgba(109, 148, 48, .8);}
	
	.p-image {
	overflow:auto;
	height:520px;
	display:none;
	}
	
	.p-image img {
	width:1208px;
	
	}
	
</style>

<script src="http://code.jquery.com/jquery-1.9.1.js" type="text/javascript"></script>
<script src="jquery.masonry.js"></script>
	<script type="text/javascript">

//Scrollable Header Function
$("document").ready(function () {
    "use strict";
    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $('.nav-fill').show();
            $('#header').removeClass('header').addClass('h-nav');
        } else {
            $('.nav-fill').hide();
            $('#header').removeClass('h-nav').addClass('header');
        }
    });
});

	
//Masonry Plug in	
$(window).ready(function () {
    "use strict";
    var $container = $('.portfolio');
    $container.imagesLoaded(function () {
        $container.masonry({

            itemSelector : '.itemd,.itemm,.itemw,.items',
            isFitWidth: true,
            isAnimated: true
        });
    });  
 });

	</script>

</head>

<body>
<div class="wrapper">

	<div class="nav-fill"></div>

	<div class="header" id="header">
	
		
	
		<div class="bar">
			<div class="bar-wrap">
			
			<div class="quote" id="quote">
			Free Quote
			</div></a>
		
<!-- _______________LOGO__________________ -->		
		<a href=""><div class="logo" style="text-decoration:none;color:white;">	
			<h1>
				<span></span>
				<div id="w-one" class="w-one">
					Affinity
				</div>
				<div id="w-two" class="w-two">
					Counts
				</div>
			</h1>
		</div></a>


<!--________________Menu_________________-->			
		<div class="menu">
			<ul>
				<li>Team</li>
				<li style="border-left:1px solid white;border-right:1px solid white;">Process</li>
				<li>Portfolio</li>
			</ul>
		</div>

		
		
		<div class="contact">
			<a href="mailto:support@affinitycounts.com">support@affinitycounts.com</a><br>
			1-801-564-1361
		</div>
		
		
			</div>	
		</div>
		
	</div>
	
	<div class="content">		
				<div class="services">	
					<div class="skills" id="des">
					<img src="images/design.png" width="80" alt="">
					<h2><span style="width:100px;margin-left:70px;"></span>Design</h2>
					<p>
					Improve your brand or look. Beautiful handcrafted design work with the user experience in mind.
					</p>
					</div>
					
					<div class="skills" id="mob">
					<img src="images/mobile.png" width="80" alt="">
					<h2><span style="width:140px;margin-left:50px;"></span>Mobile App</h2>
					<p>
					Got a new idea or need a business app? Let's work together to build something great.
					</p>
					</div>
					
					<div class="skills" id="web">
					<img src="images/web.png" width="80" alt="">
					<h2><span style="width:220px;margin-left:10px;"></span>Web Development</h2>
					<p>
					Feature-rich web apps built to increase productivity and accelerate growth.
					</p>
					</div>
					
					<div class="skills" id="seo">
					<img src="images/seo.png" width="80" alt="">
					<h2><span style="width:210px;margin-left:10px;"></span>SEO & Marketing</h2>
					<p>
					Move up in ranking on google. Let us drive target customers to your website.
					</p>
					</div>
				</div>
	</div>
	
				<div class="divider">
				<h1>
					<div class="content">	
						Portfolio:
					</div>	
				</h1>
				</div>	


<!--_______________Portfolio_________________-->				
	<div class="p-wrap" >
	<div class="content">			
			<div class="portfolio" style="padding-top:10px;">
					<div class="item itemw itemd" id="p-1">
					  <div class="item-wrap">	
						<div class="cover">
							Coming Soon:<br>
							UVU Alumni Savings<br>
							Web Development & Design
						</div>
						<img src="images/affinity.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemw itemd" id="p-2">
					  <div class="item-wrap">
						<div class="cover">
							Globa Fitness Club<br>
							Web Development & Design
						</div>
						<img src="images/web2.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemm itemd" id="p-3">
					  <div class="item-wrap">
						<div class="cover">
							How to Pray<br>
							Mobile Development & Design
						</div>
						<img src="images/mobile1.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemm itemd" id="p-4">
					  <div class="item-wrap">
						<div class="cover">
							Sophie Adventures<br>
							Mobile Development & Design
						</div>
						<img src="images/sophie.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemw itemd" id="p-5">
					  <div class="item-wrap">
						<div class="cover">
							DEBATEFeeder<br>
							Web Development & Design
						</div>
						<img src="images/web3.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemd" id="p-6">
					  <div class="item-wrap">
						<div class="cover">
							CaywoodWinward<br>
							Design
						</div>
						<img src="images/Caywood.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemw itemd" id="p-7">
					  <div class="item-wrap">
						<div class="cover">
							Bear Town Restaurant<br>
							Web Development & Design
						</div>
						<img src="images/web1.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemd" id="p-8">
					  <div class="item-wrap">
						<div class="cover">
							BYU Whiteboard<br>
							Design
						</div>
						<img src="images/whiteboard.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemw itemd" id="p-9">
					  <div class="item-wrap">
						<div class="cover">
							Big 6 Apps<br>
							Web Development & Design
						</div>
						<img src="images/web4.jpg" alt="">
					  </div>
					</div>
					
					<div class="item itemd" id="p-10">
					  <div class="item-wrap">
						<div class="cover">
							Appigo<br>
							Design
						</div>
						<img src="images/appigo.jpg" alt="">
					  </div>
					</div>	
					
					<div class="item itemd" id="p-11">
					  <div class="item-wrap">
						<div class="cover">
							Noah's Ark Children's EBook<br>
							Design
						</div>
						<img src="images/noah.jpg" alt="">
					  </div>
					</div>	
					
					<div class="item itemw" id="p-12">
					  <div class="item-wrap">
						<div class="cover">
							Sunrise Exterior Coatings<br>
							Web Development
						</div>
						<img src="images/sunrise.jpg" alt="">
					  </div>
					</div>	
					
					<div class="item itemd" id="p-13">
					  <div class="item-wrap">
						<div class="cover">
							BYU Graphic Design<br>
							Design
						</div>
						<img src="images/d1.jpg" alt="">
					  </div>
					</div>				
			</div>	
	</div>
	</div>



<!--______________Pop up__________________-->	
<div class="popup-bg" <?php if (empty($_POST) === false) { echo "style='display:block;'";}?>></div>
<div class="pop-border2"></div>
<div class="popup2">
	  
		<div class="p-image" id="p1">
			<img src="images/affinity.jpg" alt="">
		</div>
		<div class="p-image" id="p2">
			<img src="images/web2.jpg" alt="">
		</div>
		<div class="p-image" id="p3">
			<img src="images/mobile1.jpg" alt="">
		</div>
		<div class="p-image" id="p4" style="padding:0 0 0 75px;background-color:black;">
		</div>
		<div class="p-image" id="p5">
			<img src="images/web3.jpg" alt="">
		</div>
		<div class="p-image" id="p6" style="padding:0 0 0 75px;background-color:black;">
		</div>
		<div class="p-image" id="p7">
			<img src="images/web1.jpg" alt="">
		</div>
		<div class="p-image" id="p8" style="padding:0 0 0 175px;background-color:black;">
		</div>
		<div class="p-image" id="p9">
			<img src="images/web4.jpg" alt="">
		</div>
		<div class="p-image" id="p10">
			<img src="images/appigo.jpg" alt="">
		</div>
		<div class="p-image" id="p11">
			<img src="images/noah.jpg" alt="">
		</div>
		<div class="p-image" id="p12">
			<img src="images/sunrise.jpg" alt="">
		</div>
		<div class="p-image" id="p13">
			<img src="images/d11.jpg" alt="">
		</div>
</div>

<div class="pop-border1" <?php if (empty($_POST) === false) { echo "style='display:block;'";}?>></div>
<div class="popup1" <?php if (empty($_POST) === false) { echo "style='display:block;'";}?>>	
	<div class="pop-wrap" <?php if (empty($_POST) === false) { echo "style='display:block;'";}?>>	
		<div class="contact-us" <?php if (empty($_POST) === false) { echo "style='display:block;'";}?>>
			<form class="form" method="post">  
  
  				<h1 style="margin:0px;padding:0px;">Get in touch</h1>
  				  
    			<p class="name">  
        			<label for="name">Name:<br></label>
        			<input type="text" name="name" id="name" <?php if (isset($_POST['name']) === true) {echo 'value="', strip_tags($_POST['name']), '"';} ?>/>    
    			</p>  
  
    			<p class="email">  
        			<label for="email">E-mail:<br></label>
        			<input type="text" name="email" id="email" <?php if (isset($_POST['email']) === true) {echo 'value="', strip_tags($_POST['email']), '"';} ?>/>    
    			</p>   
  
    			<p class="text">  
    				<label for="text">Message:<br></label>
        			<textarea name="text"><?php if (isset($_POST['text']) === true) {echo strip_tags($_POST['text']);} ?></textarea>  
    			</p>  
  
    			<p class="submit">  
        			<input type="submit" value="submit" />  
    			</p>  
  				<?php
					if (empty($_POST) == false)
					{
						$errors = array();
					
						$name 	= $_POST['name'];
						$email 	= $_POST['email'];
						$text 	= $_POST['text'];
						
						if (empty($name) === true || empty($email) === true || empty($text) === true) {
							$errors[] = 'Name, Email, and Message are required';
						} else	{
							if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
								$errors[] = 'That is not a valid email address';
							}
							if (ctype_alpha(str_replace(' ', '', $name)) === false) {
								$errors[] = 'Name must only contain letters';
							}
						}
						
						if (empty($errors) === false) {
								echo '<ul class="errors" style="color: #ca4c4d;">';
							foreach ($errors as $error) {
								echo '<li>',$error, '</li>';
							}
								echo '</ul>';
						}
						
						if (empty($errors) === true) {
							mail('keatz55@gmail.com','Contact Form',$text,'From: '. $email);
							echo '<h2 style="color:#3285ab;text-shadow:0px 1px 1px #333;">message sent</h2>';
						}
						
					}
				?>
			</form>  
		  </div>
		</div>
		
</div>
	

<!--________________________PROCESS_____________________________-->
				<div class="divider">
				<h1>
					<div class="content">	
						Process:
					</div>	
				</h1>
				</div>
			<div class="content">
					<div class="process-wrap">	
						<div class="process red">
								<img style="margin-top:50px;" src="images/light-bulb.png" width="93" alt="">
							<div class="p-cover c-red">
							</div>	
							<h2 style="left:75px;">Plan</h2>
							<h3 style="left:20px;">Get Out There</h3>
							<p>
								Careful analysis of a project is crucial to its success. Before we dive in and start coding we make sure we know exactly what you want, need and expect to get.
							</p>
						</div>
					
						<div class="process yellow" >
								<img style="margin-top:50px;" src="images/paint-brush.png" width="93" alt="">
							<h2 style="left:60px;">Design</h2>
							<h3 style="left:50px;">Get Dirty</h3>
							<p>
								We take design seriously. Whether you need help wire framing the layout for the app or just some stellar graphic designs, we have you covered.
							</p>
							<div class="p-cover c-yellow">
							</div>
						</div>
					
						<div class="process blue" >
							<img style="margin-top:70px;" src="images/gears.png" width="93" alt="">
							<h2 style="left:50px;">Develop</h2>
							<h3 style="left:55px;">Suit Up!</h3>
							<p>
								With years of experience building apps natively, we produce very clean, fast and high preforming apps. We develop for nearly any platform and provide backend services.
							</p>
							<div class="p-cover c-blue">
							</div>
						</div>
					
						<div class="process green" >
							<img style="margin-top:80px;" src="images/thumbs-up.png" width="93" alt="">
							<h2 style="left:60px;">Deploy</h2>
							<h3 style="left:50px;">Kick Back</h3>
							<p>
								Testing is the last but very important phase in our process. It is our job to give you a bug-free app and we take the time to thoroughly test your app before launch.
							</p>
							<div class="p-cover c-green">
							</div>
						</div>
					</div>
			</div>
				
				
				
				
				
<!--__________________OUR MISSION____________________				
				<div class="divider">
				<h1>
					<div class="content">	
						Our Mission:
					</div>	
				</h1>
				</div>
	<div class="content">
		
			<p class="our-mission">
			To be a business partner with those that want to achieve stunning media to help their business.
We make certain every customer is different and has different needs. We know that! We adapt to the needs of each customer on an individual basis!
			</p>
		<div class="our-mission" style="width:850px;margin:0 auto;">		
			
			<h3>Our Experience:</h3>
			<hr class="style-one"><br>
			<div class="picture">
			<img src="innovation2.jpg"  height="200" alt="" style="float:left;display:block;">
			</div>
			<ul class="about-us" style="margin-bottom:200px;">
				<li><img src="blue-check.png" width="25" alt=""> Logo & Web Design</li>
				<li><img src="blue-check.png" width="25" alt=""> Wordpress</li>
				<li><img src="blue-check.png" width="25" alt=""> University Apps</li>
				<li><img src="blue-check.png" width="25" alt=""> Videos</li>
				<li><img src="blue-check.png" width="25" alt=""> SEO & Page Ranking</li>
				<li><img src="blue-check.png" width="25" alt=""> Data Mining</li>
				<li><img src="blue-check.png" width="25" alt=""> Educational</li>
				<li><img src="blue-check.png" width="25" alt=""> Social apps</li>
			</ul>
			
			
			
			
			<h3 style="margin-top:250px;">Our Dream:</h3>
			<hr class="style-one"><br>
			<div class="picture">
			<img src="images.jpeg" height="175" alt="" style="float:left;">
			</div>
			
			<ul class="about-us">
				<li><img src="blue-check.png" width="25" alt=""> Innovate</li>
				<li><img src="blue-check.png" width="25" alt=""> Create Happiness</li>
				<li><img src="blue-check.png" width="25" alt=""> Disrupt</li>
				<li><img src="blue-check.png" width="25" alt=""> Help Mankind</li>
				<li><img src="blue-check.png" width="25" alt=""> Build Products</li>
				<li><img src="blue-check.png" width="25" alt=""> Change the World</li>
				
			</ul>
		</div>			
		</div>
-->		
			<div class="divider">
				<h1>
					<div class="content">	
						Our Team:
					
					<div style="float:right;margin-right:130px;">Connect:</div>
					
							<a href="http://www.linkedin.com/pub/jace-warren/37/737/877"><div id="linkedin"></div></a>
							<a href="https://twitter.com/JaceWarren"><div id="twitter"></div></a>
							<a href="https://www.facebook.com/jace.warren.1"><div id="facebook"></div></a>	
					</div>
				</h1>
			</div>
		<div class="content">

<!--_____________________TEAM SECTION _____________________-->		
		<div class="team" style="position:relative;height:250px;padding:20px;margin:0 auto;">
			<div class="polaroid" id="team-one">
				<img src="images/team.jpg" width="200" alt="" style="float:left;">
			</div>
			<div class="team-text">			
				<h1>
					Jace Warren
				</h1>
				<h2>
					Web Development, Design, & SEO
				</h2>
				<p>
					Jace has extended experience in building both personal and business websites. His most recent project includes building a savings portal for UVU Alumni Association.
					<br><br>
					In his free time, Jace enjoys longboarding, sports, and other physical activities.
					<br><br>
				</p>				
					Find me on <a href="http://www.linkedin.com/pub/jace-warren/37/737/877/"><img src="images/linkedin_logo.png" width="100" alt=""></a>
				<div class="p-quote">
					"You cannot change what you refuse to confront."
				</div>
			</div>
		</div>
		
		<hr class="style-one">
		
		<div class="team">
			<div class="polaroid" id="team-two">
				<img src="images/team1.jpg" width="200" alt="" style="float:left;"> 
			</div>
			<div class="team-text">			
				<h1>
					Colton Lee
				</h1>
				<h2>
					Mobile App Development, Design, & Video
				</h2>
				<p>
					Colton has a wide range of experience with mobile apps. He has worked on numerous teams and learned from the best from the best developers.
					<br><br>
					In his free time, Colton enjoys being with family and friends.
					<br><br>
				</p>
					Find me on <a href="http://www.linkedin.com/pub/colton-lee/39/a46/207"><img src="images/linkedin_logo.png" width="100" alt=""></a>
				<div class="p-quote">
					"No matter how many mistakes you make or how slow you progress, you are still way ahead of everyone who isn't trying."
				</div>
			</div>
		</div>
		
		<hr class="style-one">
		
		<div class="team">
			<div class="polaroid" id="team-four">
				<img src="images/team4.jpg" width="200" alt="" style="float:left;"> 
			</div>
			<div class="team-text">
				<h1>
					Sean Thomas
				</h1>
				<h2>				
					Web Development, Mobile App Development, Game Development, & Design	
				</h2>					
				<p>
					Sean is a graduate of BYU who quickly got into mobile, web, and game development. Sean has years of expertise in working with and programming apps for businesses.
					<br><br>
					In his free time, Sean enjoys spending time with his wife and building mobile app powered light suits.
					<br><br>
				</p>					
					Add me on <a href="http://www.linkedin.com/pub/sean-thomas/29/9a4/170/"><img src="images/linkedin_logo.png" width="100" alt=""></a>
				<div class="p-quote">
					"Accept responsibility for your life. Know that it is you who will get you where you want to go, no one else." - Les Brown
				</div>
			</div>
		</div>
		
		<hr class="style-one">
		
		<div class="team">
			<div class="polaroid" id="team-three">
				<img src="images/team3.jpg" alt="" style="float:left;"> 
			</div>	
			<div class="team-text">			
				<h1>
					William Day
				</h1>
				<h2>
					Graphic Design, Illustration, Whiteboard Animation, Video, Logo Design
				</h2>
				<p>
					William first started his career working as a designer for BYU. For the past two years Will has been a Contract Digital Artist building various apps and working on various animation projects.
					<br><br>
					In his free time, William enjoys hiking and plein air painting.
					<br><br>
				</p>
					Find me on <a href="http://www.linkedin.com/pub/william-day/5a/8ab/b72"><img src="images/linkedin_logo.png" width="100" alt=""></a>
				<div class="p-quote">
					"Life is 10% of what happens to you and 90% of how you react to it."
				</div>	
			</div>
			
		</div>
		
		<hr class="style-one">
		
		<div class="team">
			<div class="polaroid" id="team-four">
				<img src="images/team2.jpg" width="200" alt="" style="float:left;"> 
			</div>
			<div class="team-text">
				<h1>
					Jonathan Blomquist
				</h1>
				<h2>				
					Search Engine Optimization, Marketing, Social Media, Technical Writing, & Blogging	
				</h2>					
				<p>
					Jonathan has extensive experience in search engine optimization for large companies, which includes bringing InsideSales.com to #2 most popular website on google's search engine database.
					<br><br>
					In his free time, Jonathan enjoys all kinds of music and does a little DJing on the side.
					<br><br>
				</p>					
					Add me on <a href="http://www.linkedin.com/in/jonathanblomquist/"><img src="images/linkedin_logo.png" width="100" alt=""></a>
				<div class="p-quote">
					"Sometimes good things fall apart so better things can fall together."
				</div>
			</div>
			
		</div>
	
	</div>
	
	
	
	<div class="footer">
		<div class="bar-wrap">
			<p>&copy; 2011-2013 AffinityCounts, Ogden, UT</p>
		</div>
	</div>

</div>

<div class="test" style="display:none;">

</div>

<script>
var des = 0;
var mob = 0;
var web = 0;
var seo = 0;
var scroll = 310;
var logo = 0;


$(".quote").click(function () {
	$('.popup1,.popup-bg,.pop-border1').fadeIn('slow');
	$(".contact-us").show();
});


$(".item").click(function () {
	$("#p1,#p2,#p3,#p4,#p5,#p6,#p7,#p8,#p9,#p10,#p11,#p12,#p13,#p14").hide();
	$('.popup2,.popup-bg,.pop-border2').fadeIn('slow');
	var id = $(this).attr("id");
	if (id == "p-1") {
		$("#p1").show();
	} else if (id == "p-2") {
		$("#p2").show();
	} else if (id == "p-3") {
		$("#p3").show();
	} else if (id == "p-4") {
		$("#p4").append('<iframe width="853" height="480" src="http://www.youtube.com/embed/3-rUD5LLZfA?wmode=opaquerel=0" frameborder="0" allowfullscreen></iframe>');
		$("#p4").show();
	} else if (id == "p-5") {
		$("#p5").show();
	} else if (id == "p-6") {
		$("#p6").append('<iframe width="853" height="480" src="http://www.youtube.com/embed/UI_2oDJnW00?wmode=opaquerel=0" frameborder="0" allowfullscreen></iframe>');
		$("#p6").show();
	} else if (id == "p-7") {
		$("#p7").show();
	} else if (id == "p-8") {
		$("#p8").append('<iframe width="640" height="480" src="http://www.youtube.com/embed/u-F37iY2uw4?wmode=opaquerel=0" frameborder="0" allowfullscreen></iframe>');
		$("#p8").show();
	} else if (id == "p-9") {
		$("#p9").show();	
	} else if (id == "p-10") {
		$("#p10").show();
	} else if (id == "p-11") {
		$("#p11").show();
	} else if (id == "p-12") {
		$("#p12").show();
	} else {
		$("#p13").show();
	} 
});

$(".popup-bg,.pop-border").click(function () {
	$('.popup1,.popup2,.pop-border2,.popup-bg,.pop-border1').fadeOut('slow');
	$("#p4,#p6,#p8").empty();
});

	var buttons = 0;
$(".skills").on("click", function(){
	var id = $(this).attr("id");
	var j = $(".itemd,.itemw,.items,.itemm");
	$(j).appendTo(".test");
	$(".skills").removeClass('pushed');
	if (id == "des") {
			$('.itemd').appendTo(".portfolio");
			$('.portfolio').masonry( 'reload' );
			$("#des").addClass('pushed');
			$('html, body').animate({ scrollTop: scroll }, 'normal');
	} else if (id == "mob") {
			$('.itemm').appendTo(".portfolio");
			$('.portfolio').masonry( 'reload' );
			$("#mob").addClass('pushed');
			$('html, body').animate({ scrollTop: scroll }, 'normal');
	} else if (id == "web") {
			$('.itemw').appendTo(".portfolio");
			$('.portfolio').masonry( 'reload' );
			$("#web").addClass('pushed');
			$('html, body').animate({ scrollTop: scroll }, 'normal');	
	} else {
			$('.items').appendTo(".portfolio");
			$('.portfolio').masonry( 'reload' );
			$("#seo").addClass('pushed');
			$('html, body').animate({ scrollTop: scroll }, 'fast');
	}
	
});

$('.menu li').click(function(){
	var menu = $(this).html();
	$(".itemd,.itemw,.items,.itemm").appendTo(".portfolio");
	$('.portfolio').masonry( 'reload' );
	if (menu == "Portfolio") {
     $('html, body').animate({ scrollTop: scroll }, 'slow');
     } else if (menu == "Process") {
     $('html, body').animate({ scrollTop: 1465 }, 'slow');
     } else {
     $('html, body').animate({ scrollTop: 2055 }, 'slow');
     }
    });


setInterval(function() {

	if (logo == 0) {
      $("#w-one").removeClass('w-one');
      $("#w-two").removeClass('w-two');
      $("#w-one").addClass("w-two fade-in");
      $("#w-two").addClass("w-one fade-in");
      logo++;
      } else {
      $("#w-one").removeClass('w-two');
      $("#w-two").removeClass('w-one');
      $("#w-one").addClass("w-one fade-in");
      $("#w-two").addClass("w-two fade-in");
      logo--;
      }
}, 2000);

</script>

</body>

</html>