(function () {
// --- view ---
  var el = {
    debug: document.querySelector('#debug'),
    circles: [].slice.call(document.querySelectorAll('circle')),
    svg: document.querySelector('svg'),
  };

// --- model ---
  var states = {
    waiting: function waiting() {
      return {
        type: 'waiting',
      };
    },
    sliding: function sliding(circleIndex, startPosition) {
      var slidingCircle = data.circlePositions[circleIndex];
      return {
        type: 'sliding',
        circleIndex: circleIndex,
        startPosition: { x: startPosition.x, y: startPosition.y },
        currentPosition: { x: startPosition.x, y: startPosition.y },
        offsetFromCenter: {
          x: startPosition.x - slidingCircle.x,
          y: startPosition.y - slidingCircle.y,
        },
      };
    },
  };

  var data = {
    screen: {
      width: 0,
      height: 0,
    },
    circleRadius: 50,
    circlePositions: [
      { x: -100, y: -100 },
      { x: 0, y: -100 },
      { x: 100, y: -100 },
      { x: -50, y: -13.4 },
      { x:  50, y: -13.4 },
      { x: 150, y: -13.4 },
    ],
    state: states.waiting(),
    slideSpeed: 1 / 5,
    showDebugInfo: window.location.search === '?debug',
  };

// --- render loop ---
  function render() {
    // set derived state
    setSlidingCirclePosition();
    setScreenSize();

    // set view properties
    setDebugText();
    positionCircles();

    // repeat next frame
    requestAnimationFrame(render);
  }
  render();

// --- interactions ---
  el.svg.onpointerdown = function onPointerDown(event) {
    if (data.state.type === 'waiting') {
      var startPosition = {
        x: event.pageX - data.screen.midPoint.x,
        y: event.pageY - data.screen.midPoint.y,
      };
      var circleIndex = -1;
      for (var index = 0; index < data.circlePositions.length; index += 1) {
        var pos = data.circlePositions[index];
        var distSquared = squaredDistBetween(startPosition, pos);
        if (distSquared < Math.pow(data.circleRadius, 2)) {
          circleIndex = index;
          break;
        }
      }
      if (circleIndex !== -1) {
        data.state = states.sliding(circleIndex, startPosition);
      }
    }
  };

  el.svg.onpointermove = function onPointerMove(event) {
    if (data.state.type === 'sliding') {
      data.state.currentPosition.x = event.pageX - data.screen.midPoint.x;
      data.state.currentPosition.y = event.pageY - data.screen.midPoint.y;
    }
  };

  el.svg.onpointerup = function onPointerUp(event) {
    if (data.state.type === 'sliding') {
      data.state = states.waiting();
    }
  };

// --- helpers ---
  function squaredDistBetween(posA, posB) {
    var diffX = posA.x - posB.x;
    var diffY = posA.y - posB.y;
    return diffX * diffX + diffY * diffY;
  }

  function setScreenSize() {
    var width = data.screen.width = window.innerWidth;
    var height = data.screen.height = window.innerHeight;
    data.screen.midPoint = { x: width / 2, y: height / 2 };
  }

  function setSlidingCirclePosition() {
    if (data.state.type === 'sliding') {
      var intendedPos = {
        x: data.state.currentPosition.x - data.state.offsetFromCenter.x,
        y: data.state.currentPosition.y - data.state.offsetFromCenter.y,
      };
      var oldPos = data.circlePositions[data.state.circleIndex];
      var moveToPos = {
        x: oldPos.x + data.slideSpeed * (intendedPos.x - oldPos.x),
        y: oldPos.y + data.slideSpeed * (intendedPos.y - oldPos.y),
      };
      var overlappingCircleIndex = -1;
      for (var index = 0; index < data.circlePositions.length; index += 1) {
        if (index === data.state.circleIndex) continue;
        var otherCirclePos = data.circlePositions[index];
        var distSquared = squaredDistBetween(otherCirclePos, moveToPos);
        if (distSquared < Math.pow(2 * data.circleRadius, 2)) {
          overlappingCircleIndex = index;
          break;
        }
      }
      if (overlappingCircleIndex === -1) {
        oldPos.x = moveToPos.x;
        oldPos.y = moveToPos.y;
      }
    }
  }

  function setDebugText() {
    if (data.showDebugInfo) {
      el.debug.innerText = JSON.stringify(data, null, 2);
    }
  }

  function positionCircles() {
    el.circles.forEach(function (circle, index) {
      var midPoint = data.screen.midPoint;
      circle.setAttribute('cx', midPoint.x + data.circlePositions[index].x);
      circle.setAttribute('cy', midPoint.y + data.circlePositions[index].y);
      circle.setAttribute('r', data.circleRadius);
    });
  }
}());
