//*****************************************************************************
// Copyright © 2012 Waters Corporation. All rights reserved.
//*****************************************************************************
'use strict';

angular.module('jogWheelCtrl.directive', [])
    .directive('jogWheel', function () {
        // Directive functionality goes here
        var linker = function (scope, element, attrs) {
            var refreshInterval = 500; // update display every 500ms
            var mouseX = 0;
            var mouseY = 0;
            var previousAngle = 0;
            var colour = attrs.col;

            var lastMovementTime;
            var distanceTravel = 0;
            var lastmousex = -1;
            var lastmousey = -1;
            var pps = 0;
            var incCounter = 0;

            function speed() {

                var md = new Date();
                var timenow = md.getTime();

                if (lastMovementTime && lastMovementTime != timenow) {
                    pps = Math.round(distanceTravel / (timenow - lastMovementTime) * 1000);

                    // console.log("pps:" + pps +   "  col: " + colour + "  " + "distanceTravel = " + distanceTravel);
                    distanceTravel = 0;
                }

                lastMovementTime = timenow;
                setTimeout(speed, refreshInterval);
            }

            function draw() {

                // Clear the canvas before redrawing movement
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

                ctx.fillStyle = "rgba(0,0,255,0.1)";
                ctx.fillRect(0, 0, 400, 400);

                ctx.beginPath();
                ctx.strokeStyle = colour;
                ctx.lineWidth = 6;
                // Draw thick inner circle
                ctx.arc(100, 100, 36,0,Math.PI*2,true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = colour;
                ctx.lineWidth = 2;

                // Draw outer circle
                ctx.arc(100, 100, 62,0,Math.PI*2,true);
                ctx.stroke();

                if (mouseDown == 1) {
                    var mouseLimit = limit(mouseX, mouseY);

                    ctx.beginPath();
                    ctx.strokeStyle = colour;
                    // draw thumb
                    ctx.arc(mouseLimit.x, mouseLimit.y, 10, 0,Math.PI*2, true);
                    ctx.stroke();
                    //ctx.fill();
                }
                else
                {
                    var mouseLimit = limit(mouseX, mouseY);

                    ctx.beginPath();
                    ctx.strokeStyle = "lightgrey";
                    // draw thumb
                    ctx.arc(mouseLimit.x, mouseLimit.y, 10, 0,Math.PI*2, true);
                    ctx.stroke();
                }
            }


            function drawJogWheel(colour) {

                if (position == "right") {
                    myCanvas.style.left = window.innerWidth - 200;
                    myCanvas.style.top = window.innerHeight - 200;
                }
                else if (position == "left"){
                    myCanvas.style.left = 0;
                    myCanvas.style.top = window.innerHeight - 200;
                }
                else
                {
                    myCanvas.style.left = posX;
                    myCanvas.style.top = posY;
                }

                myCanvas.width  = 200;
                myCanvas.height = 200;

                myCanvas.style.position = 'absolute';
            }


            function onTouchStart(e) {
                for(var i = 0; i < e.changedTouches.length; i++) {
                    setStartPosition(e.changedTouches[i]);
                }
            }

            function onMouseDown(event) {
                setStartPosition(event);
            }


            function setStartPosition(event) {
                mouseDown = 1;
                var p = getCoords(event);

                mouseX = p.x;
                mouseY = p.y;

                var angle = parseInt(getAngle({x:p.x, y:p.y}));
                previousAngle = angle;

                return p;
            }

            function onTouchMove(e) {
                // Prevent the browser from doing its default thing (scroll, zoom, etc)
                e.preventDefault();

                if (mouseDown == 1) {

                    for(var i = 0; i < e.changedTouches.length; i++){
                        var p = getCoords(e.changedTouches[i]);

                        calculateIncreament(p);
                    }
                }
            }


            function onMouseMove(event) {
                if (mouseDown == 1) {
                    var p = getCoords(event);
                    calculateIncreament(p);

                    distanceTravel += Math.max(Math.abs(p.x - lastmousex), Math.abs(p.y - lastmousey));
                    lastmousex = p.x;
                    lastmousey = p.y;

                }
            }


            function calculateIncreament(p) {

                mouseX = p.x;
                mouseY = p.y;

                var angle = parseInt(getAngle({x:p.x, y:p.y}));

                var newAngle = angle;
                var newIncrement = 0;

                if (previousAngle > 270 && newAngle < 90)
                {
                    newIncrement = newAngle;
                    newIncrement += (359 - previousAngle);
                }
                else if (previousAngle < 90 && newAngle > 270) {
                    newIncrement -= previousAngle;
                    newIncrement -= (359 - newAngle);
                }
                else {
                    newIncrement = newAngle - previousAngle;
                }

                if (pps < 100) {

                    //console.log("debug: " + newIncrement + "  pps:" + pps +   "  incCounter:" + incCounter);
                    incCounter += newIncrement;
                    if (incCounter >= 20) {
                        scope.IncrementBy(binding, 1);
                        incCounter = 0;
                    }
                    else
                    {
                        if (incCounter <= -20) {
                            scope.IncrementBy(binding, -1);
                            incCounter = 0;
                        }
                    }
                }
                else
                {
                    //console.log("*******************");
                    scope.IncrementBy(binding, newIncrement);
                }

                //scope.IncrementBy(binding, newIncrement);

                // If we use angular events then this will not be needed!
                scope.$apply();

                previousAngle = angle;

            }

            function onMouseUp(event) {
                mouseDown = 0;
            }

            function onTouchEnd(e) {
                mouseDown = 0;
            }


            // Get the coordinates for a mouse or touch event
            function getCoords(e) {
                if (e.offsetX) {
                    return { x: e.offsetX, y: e.offsetY };
                }
                else if (e.layerX) {
                    return { x: e.layerX, y: e.layerY };
                }
                else {
                    return { x: e.pageX - myCanvas.offsetLeft, y: e.pageY - myCanvas.offsetTop };
                }
            }

            function getAngle(point){

                // use atan2 to get the angle; Atan2 returns radians
                var angleRadians = Math.atan2(point.y - 100, point.x - 100);

                //convert to degrees
                var angleDegrees = toDegrees(angleRadians);

                //angleDegrees will be in the range (-180,180].
                //I like normalizing to [0,360) myself, but this is optional..
                if (angleDegrees<0)
                    angleDegrees+=360;

                return angleDegrees;
            }


            function limit(x, y) {
                var canvasCenter = [200 / 2, 200 / 2];
                var canvasRadius = 100 / 2;

                x = x - canvasCenter[0];
                y = y - canvasCenter[1];

                var radians = Math.atan2(y, x);

                return { x: Math.cos(radians) * canvasRadius + canvasCenter[0],
                    y: Math.sin(radians) * canvasRadius + canvasCenter[1] }
            }

            function toDegrees(radians) {

                var degrees = radians * (180 / 3.14159265)

                return degrees;
            }

            function toRadians(degrees) {

                var radians = degrees * (3.14159265 / 180)
                return radians;
            }

            function debugOutput(message) {
                scope.debugger(message);

                // If we use angular events then this will not be needed!
                scope.$apply();
            }


            function output(id, message) {
                var property = scope.property(id);
                property.setting = message;

                // If we use angular events then this will not be needed!
                scope.$apply();
            }

            var posX = attrs.x;
            var posY = attrs.y;
            var binding = attrs.binding;
            var mouseDown = 0;
            var myCanvas = element[0];
            var ctx = element[0].getContext('2d');
            var position = attrs.position;

            // is this running in a touch capable environment?
            var touchable = 'createTouch' in document;

            if (touchable) {
                myCanvas.addEventListener( 'touchstart', onTouchStart, false );
                myCanvas.addEventListener( 'touchmove', onTouchMove, false );
                myCanvas.addEventListener( 'touchend', onTouchEnd, false );
                if ($$.isMobile()) {
                    //debugOutput("66");
                }

                //myCanvas.doubleTap(function(ev) { debugOutput(44) });

                // myCanvas.hammer.ontap = function(ev) { };
                // myCanvas.hammer.ondoubletap = function(ev) { };
            }
            else {
                myCanvas.addEventListener( 'mousemove', onMouseMove, false );
                myCanvas.addEventListener( 'mousedown', onMouseDown, false );
                myCanvas.addEventListener( 'mouseup', onMouseUp, false );
            }

            drawJogWheel(colour);

            setInterval(draw, 10);
            setTimeout(speed, refreshInterval);
        };

        return {
            restrict: 'E',
            scope: {
                model: '@ngModel'
            },
            template: '<canvas width="0" height="0"></canvas>',
            replace: true,
            link: linker
        }
    });
