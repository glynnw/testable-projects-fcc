// BDD tests for the alignment-D3 module.

import {
  getShapeValue,
  getTickValue
} from '../src/utils/alignment-D3-support';

import {
  areShapesAlignedWithTicks,
  _getSurroundingTicks
} from '../src/utils/alignment-D3';

import { assert } from 'chai';
import { JSDOM } from 'jsdom';

describe('D3 Alignment module tests', function() {

  // Test data.
  const heatMapDom = new JSDOM(`
  <g id="y-axis" transform="translate(144,16)">
    <g class="tick" transform="translate(0,16.5)">
      <line x2="-10" y2="0"></line>
      <text>January</text>
    </g>
    <g class="tick" transform="translate(0,49.5)">
      <line x2="-10" y2="0"></line>
      <text>February</text>
    </g>
    <g class="tick" transform="translate(0,79.5)">
      <line x2="-10" y2="0"></line>
      <text>March</text>
    </g>
    <g class="tick" transform="translate(0,99.5)">
      <line x2="-10" y2="0"></line>
      <text>April</text>
    </g>
  </g>
  <g id="x-axis" transform="translate(144,412)">
    <g class="tick" transform="translate(37.5,0)">
      <line y2="10" x2="0"></line>
      <text>1760</text>
    </g>
    <g class="tick" transform="translate(87.5,0)">
      <line y2="10" x2="0"></line>
      <text>1770</text>
    </g>
    <g class="tick" transform="translate(137.5,0)">
      <line y2="10" x2="0"></line>
      <text>1780</text>
    </g>
  </g>
  <rect class="cell" data-month="0" data-year="1753"
    data-temp="7.2940000000000005" x="0" y="0" width="5" height="33">
  </rect>
  <rect class="cell" data-month="1" data-year="1765"
    data-temp="8.56" x="60" y="33" width="5" height="33">
  </rect>
  <rect class="cell-misaligned" data-month="1" data-year="1765"
    data-temp="8.56" x="0" y="0" width="5" height="33">
  </rect>
  `);

  const scatterPlotDom = new JSDOM(`
  <g id="y-axis">
    <g class="tick" transform="translate(0,28.277777777777775)">
      <line x2="-6"></line>
      <text>37:00</text>
    </g>
    <g class="tick" transform="translate(0,69.94444444444444)">
      <line x2="-6"></line>
      <text>37:15</text>
    </g>
    <g class="tick" transform="translate(0,111.6111111111111)">
      <line x2="-6"></line>
      <text>37:30</text>
    </g>
  </g>
  <g id="x-axis" transform="translate(0,500)">
    <g class="tick" transform="translate(37.02173913043478,0)">
      <line y2="6"></line>
      <text>1994</text>
    </g>
    <g class="tick" transform="translate(110.06521739130434,0)">
      <line y2="6"></line>
      <text>1996</text>
    </g>
    <g class="tick" transform="translate(183.1086956521739,0)">
      <line y2="6"></line>
      <text>1998</text>
    </g>
  </g>
  <circle class="dot" r="6" cx="36.52173913043478" cy="69.44444444444444"
    data-xvalue="1994" data-yvalue="Mon Jan 01 1900 00:37:15 GMT-0200 (BRST)">
  </circle>
  <circle class="dot-misaligned" r="6" cx="0" cy="0"
    data-xvalue="1996" data-yvalue="Mon Jan 01 1900 00:38:00 GMT-0200 (BRST)">
  </circle>
  `);

  const scatterPlotReverseAxisDom = new JSDOM(`
  <g id="y-axis">
    <g class="tick" transform="translate(0,290.5)">
      <line x2="-6"></line>
      <text>37:45</text>
    </g>
    <g class="tick" transform="translate(0,320.5)">
      <line x2="-6"></line>
      <text>37:30</text>
    </g>
    <g class="tick" transform="translate(0,350.5)">
      <line x2="-6"></line>
      <text>37:15</text>
    </g>
    <g class="tick" transform="translate(0,380.5)">
      <line x2="-6"></line>
      <text>37:00</text>
    </g>
    <g class="tick" transform="translate(0,410.5)">
      <line x2="-6"></line>
      <text>36:45</text>
    </g>
  </g>
  <g id="x-axis">
    <g class="tick" transform="translate(110.91666666666666,0)">
      <line y2="6"></line>
      <text>1994</text>
    </g>
    <g class="tick" transform="translate(171.75,0)">
      <line y2="6"></line>
      <text>1996</text>
    </g>
    <g class="tick" transform="translate(232.66666666666666,0)">
      <line y2="6"></line>
      <text>1998</text>
    </g>
  </g>
  <circle class="dot" r="3" cx="140.83333333333331" cy="400" data-xvalue="1995"
    data-yvalue="Mon Jan 01 1900 00:36:50 GMT-0700 (MST)">
  </circle>
  <circle class="dot" r="3" cx="201.75" cy="390" data-xvalue="1997"
    data-yvalue="Mon Jan 01 1900 00:36:55 GMT-0700 (MST)">
  </circle>
  <circle class="dot" r="3" cx="110.41666666666666" cy="350" data-xvalue="1994"
    data-yvalue="Mon Jan 01 1900 00:37:15 GMT-0700 (MST)">
  </circle>

  <circle class="dot-misaligned" r="6" cx="0"
    cy="355" data-xvalue="1997"
    data-yvalue="Mon Jan 01 1900 00:37:25 GMT-0200 (BRST)">
  </circle>
  `);

  const barChartDom = new JSDOM(`
    <g id="y-axis" transform="translate(60, 0)">
      <g class="tick" transform="translate(0,361.597610256467)">
        <line x2="-6"></line>
        <text x="-9" dy="0.32em">2,000</text>
      </g>
      <g class="tick" transform="translate(0,317.31234673147077)">
        <line x2="-6"></line>
        <text x="-9" dy="0.32em">4,000</text>
      </g>
      <g class="tick" transform="translate(0,273.0270832064745)">
        <line x2="-6"></line>
        <text x="-9" dy="0.32em">6,000</text>
      </g>
      <g class="tick" transform="translate(0,228.74181968147826)">
        <line x2="-6"></line>
        <text x="-9" dy="0.32em">8,000</text>
      </g>
    </g>

    <g id="x-axis" transform="translate(60, 400)">
      <g class="tick" transform="translate(35.794117647058826,0)">
        <line y2="6"></line>
        <text y="9" dy="0.71em">1950</text>
      </g>
      <g class="tick" transform="translate(94.61764705882352,0)">
        <line y2="6"></line>
        <text y="9" dy="0.71em">1955</text>
      </g>
      <g class="tick" transform="translate(153.44117647058823,0)">
        <line y2="6"></line>
        <text y="9" dy="0.71em">1960</text>
      </g>
      <g class="tick" transform="translate(212.26470588235296,0)">
        <line y2="6"></line>
        <text y="9" dy="0.71em">1965</text>
      </g>
    </g>

    <rect data-date="1947-01-01" data-gdp="243.1" class="bar"
      x="0" y="394.6171262185367" width="2.909090909090909"
      height="5.382873781463295" transform="translate(60, 0)">
    </rect>
    <rect data-date="1947-04-01" data-gdp="246.3" class="bar"
      x="2.909090909090909" y="394.5462697968967" width="2.909090909090909"
      height="5.453730203103289" transform="translate(60, 0)">
    </rect>
    <rect data-date="1947-01-01" data-gdp="243.1" class="bar-misaligned"
      x="0" y="0" width="2.909090909090909"
      height="5.382873781463295" transform="translate(60, 0)">
    </rect>
  `);
  // Some of the tests will be performed on all the sets of data above.
  const tests = [
    {
      name: 'Heat Map',
      dom: heatMapDom,
      shapeClassName: '.cell',
      tickOrderNormalYAxis: true,
      dataType: { x: 'year', y: 'month'},
      increment: { x: 10, y: 1},
      attribute: { x: 'data-year', y: 'data-month'},
      positionType: { x: 'center', y: 'center' },
      dimension: { x: 'x', y: 'y' }
    },
    {
      name: 'Scatter Plot',
      dom: scatterPlotDom,
      shapeClassName: '.dot',
      tickOrderNormalYAxis: true,
      dataType: { x: 'year', y: 'minute'},
      increment: { x: 2, y: 0.25},
      attribute: { x: 'data-xvalue', y: 'data-yvalue'},
      positionType: { x: 'center', y: 'center' },
      dimension: { x: 'cx', y: 'cy' }
    },
    {
      name: 'Scatter Plot Reverse Axis',
      dom: scatterPlotReverseAxisDom,
      shapeClassName: '.dot',
      tickOrderNormalYAxis: false,
      dataType: { x: 'year', y: 'minute'},
      increment: { x: 2, y: 0.25},
      attribute: { x: 'data-xvalue', y: 'data-yvalue'},
      positionType: { x: 'center', y: 'center' },
      dimension: { x: 'cx', y: 'cy' }
    },
    {
      name: 'Bar Chart',
      dom: barChartDom,
      shapeClassName: '.bar',
      tickOrderNormalYAxis: true,
      dataType: { x: 'year', y: 'thousand'},
      increment: { x: 5, y: 2000},
      attribute: { x: 'data-date', y: 'data-gdp'},
      positionType: { x: 'center', y: 'topLeft' },
      dimension: { x: 'x', y: 'y' }
    }
  ];

  // Perform the following tests on each set of test data.
  tests.forEach(function(test) {

    describe(`Using ${test.name} data`, function() {

      describe('_getSurroundingTicks function', function() {

        it('should return before and after ticks for a given shape',
        function() {
          let tickValues = [].map.call(
            test.dom.window.document.querySelectorAll(
              '#y-axis .tick'
            ), tick => getTickValue(tick, test.dataType.y)
          );
          const increment = tickValues[1] - tickValues[0];
          tickValues = [
            tickValues[0] - increment,
            ...tickValues,
            tickValues[tickValues.length - 1] + increment
          ];

          const shapes =
            test.dom.window.document.querySelectorAll(test.shapeClassName);

          const alignedTicks = _getSurroundingTicks(
            getShapeValue(shapes[0], test.attribute.y, test.dataType.y),
            tickValues,
            test.tickOrderNormalYAxis
          );

          assert.strictEqual(
            alignedTicks.length,
            2
          );
        });
      });

      describe('areShapesAlignedWithTicks function', function() {
        it('should return true when all datapoints are aligned with an x axis',
        function() {
          const axis = test.dom.window.document.querySelector('#x-axis'),
            dataPoints = test.dom.window.document.querySelectorAll(
              test.shapeClassName
            );
          const dimension = test.dimension.x;
          const ticks = axis.querySelectorAll('.tick');

          assert.isTrue(areShapesAlignedWithTicks(
            dataPoints,
            ticks,
            dimension,
            test.attribute.x,
            test.dataType.x,
            test.positionType.x
          ));
        });
      });
    });
  });
});
