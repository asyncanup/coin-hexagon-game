(function () {
// --- view ---
  var el = {
    debug: document.querySelector('#debug'),
    circles: [].slice.call(document.querySelectorAll('circle')),
    svg: document.querySelector('svg'),
  };

// --- model ---
  var data = {
    width: 0,
    height: 0,
    circlePositions: [
      { x: -100, y: -100 },
      { x: 0, y: -100 },
      { x: 100, y: -100 },
      { x: -50, y: -13.4 },
      { x:  50, y: -13.4 },
      { x: 150, y: -13.4 },
    ],
  };

// --- render loop ---
  function render() {
    data.width = window.innerWidth;
    data.height = window.innerHeight;

    setDebugText(el, data);
    positionCircles(el, data);

    requestAnimationFrame(render);
  }
  render();

// --- interactions ---
  el.svg.pointerdown = function() {
    alert('ha');
  };

// --- helpers ---
  function setDebugText(el, data) {
    el.debug.innerText = data.width + ', ' + data.height;
  }

  function positionCircles(el, data) {
      var screenMidPoint = { x: data.width / 2, y: data.height / 2 };
      el.circles.forEach(function (circle, index) {
        circle.setAttribute('cx', screenMidPoint.x + data.circlePositions[index].x);
        circle.setAttribute('cy', screenMidPoint.y + data.circlePositions[index].y);
      });
  }
}());
