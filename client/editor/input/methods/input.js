Template.input.onRendered(function(){
    var body = document.body, html = document.documentElement;
    var canvas = document.getElementById("canvas");
    canvas.width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth ) /8*2.70;
    canvas.height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight) *.6;
    var inkManager = new MyScript.InkManager();
    var mathRenderer = new MyScript.MathRenderer();
    var mathRecognizer = new MyScript.MathRecognizer();
    var instanceId;
    var applicationKey = '3b16c45f-e990-4b06-bc2c-bdef00a38457';
    var hmacKey = '7e4afab3-3a4d-47a3-b02b-38e234820743';

    (function() {
        var canvas = document.getElementById("canvas");
        var pointerId;
        canvas.addEventListener('pointerdown', function (event) {
            if (!pointerId) {
                pointerId = event.pointerId;
                event.preventDefault();
            }
        }, false);
        canvas.addEventListener('pointermove', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
            }
        }, false);
        canvas.addEventListener('pointerup', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();

                pointerId = undefined;
            }
        }, false);

        canvas.addEventListener('pointerleave', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
                pointerId = undefined;
            }
        }, false);
    })();
    (function() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var pointerId;
        canvas.addEventListener('pointerdown', function (event) {
            if (!pointerId) {
                pointerId = event.pointerId;
                event.preventDefault();
                mathRenderer.drawStart(event.offsetX, event.offsetY);
            }
        }, false);
        canvas.addEventListener('pointermove', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();

                mathRenderer.drawContinue(event.offsetX, event.offsetY, context);
            }
        }, false);
        canvas.addEventListener('pointerup', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
                mathRenderer.drawEnd(event.offsetX, event.offsetY, context);
                pointerId = undefined;
            }
        }, false);
        canvas.addEventListener('pointerleave', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
                mathRenderer.drawEnd(event.offsetX, event.offsetY, context);
                pointerId = undefined;
            }
        }, false);
    })();
    (function() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var pointerId;

        canvas.addEventListener('pointerdown', function (event) {
            if (!pointerId) {
                pointerId = event.pointerId;
                event.preventDefault();
                mathRenderer.drawStart(event.offsetX, event.offsetY);
                inkManager.startInkCapture(event.offsetX, event.offsetY);
            }
        }, false);
        canvas.addEventListener('pointermove', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
                mathRenderer.drawContinue(event.offsetX, event.offsetY, context);
                inkManager.continueInkCapture(event.offsetX, event.offsetY);
            }
        }, false);
        canvas.addEventListener('pointerup', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();
                mathRenderer.drawEnd(event.offsetX, event.offsetY, context);
                inkManager.endInkCapture();
                pointerId = undefined;
            }
        }, false);
        canvas.addEventListener('pointerleave', function (event) {
            if (pointerId === event.pointerId) {
                event.preventDefault();

                mathRenderer.drawEnd(event.offsetX, event.offsetY, context);
                inkManager.endInkCapture();
                pointerId = undefined;
            }
        }, false);
    })();
    function doRecognition () {
        mathRecognizer.doSimpleRecognition(applicationKey, instanceId, inkManager.getStrokes(), hmacKey).then(
            function (data) {

                if (!instanceId) {
                    instanceId = data.getInstanceId();
                } else if (instanceId !== data.getInstanceId()) {
                    return;
                }
                var results = data.getMathDocument().getResultElements();
                for (var i in results) {
                    if (results[i] instanceof MyScript.MathLaTexResultElement) {
                        Session.set("latex_results",results[i].getValue());
                        var editor_area = document.getElementById("editor_area");
                        editor_area.value = editor_area.value +'\n{{#mathjax}}\n'+results[i].getValue()+'\n{{/mathjax}}\n';
                        Session.set("editor_area",editor_area.value);
                        Session.set("render",true);
                    }
                }
            }
        )
    }
    document.getElementById("add_question").addEventListener("click", function(){
      doRecognition();
    });
    document.getElementById("cancel").addEventListener("click", function(){
      Session.set("render",true);
    });
  }
);
