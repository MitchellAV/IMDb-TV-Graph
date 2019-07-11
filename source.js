var COLORS = [
  '#ff71ce',
  '#01cdfe',
  '#05ffa1',
  '#b967ff'
];

let maxWidth = 800;
let validShow = true;
let trendSeasons = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateChart(title, values, indexes, trendlines) {
  var config = {
    type: 'line',
    data: {
      labels: indexes,
      datasets: [{
        label: title,
        data: values,
        backgroundColor: [
          'rgba(30, 30, 30, 0.1)'
        ],
        borderColor: [
          // COLORS[getRandomInt(COLORS.length)]
          'rgba(30,30,30,.3)'
        ],
        fill: true
      }]
    },
    options: {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: true,
      elements: {
        line: {
          tension: 0,
        },
        point: {
          hitRadius: 0,
          hoverRadius: 0
        }
      },
      spanGaps: true,

      tooltips: {
        mode: 'index',
        intersect: false

      },

      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Episodes'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Ratings'
          }
        }]
      }
    }
  };

  for (var i = trendlines.length - 1; i >= 0; i--) {
    config.data.datasets.unshift(trendlines[i]);
  }
  // config.options.tooltips = Object.assign(config.options.tooltips, {
  //   onlyShowForDatasetIndex: [config.data.datasets.length - 1]
  // });

  if (width < maxWidth) {
    config.options.tooltips.intersect = true;
    $('.graphic').css('width', '100%');
  } else {
    config.options.tooltips.intersect = false;
    $('.graphic').css('width', '80%');
  }


  $('.graphic').html('<canvas id="chart"></canvas>');
  var ctx = document.getElementById("chart").getContext('2d');
  var myChart = new Chart(ctx, config);

}

function runAjax(link, complete) {
  $.ajax({
      url: link,
      type: 'GET',
      dataType: 'json',
      async: false
    })
    .done(function(json) {
      complete.push(json);
    })
}

function getHeader(show) {
  $.ajax({
      url: show,
      type: 'GET',
      dataType: 'json',
      async: false
    })
    .done(function(json) {
      if (!json.hasOwnProperty('Error')) {
        runTime = parseInt(json.Runtime.split(" ")[0]);

        total = json.totalSeasons;
        name = json.Title;
        $('.title').text(name);
        $('.overall').text('IMDb Rating: ' + json.imdbRating);

        total = json.totalSeasons;
        for (let i = 0; i < total; i++) {
          $('.content').append('<div id="index' + i + '"><h2 class="season"></h2><div class="json"></div></div>');
          $('#index' + i + ' .season').text('Season ' + (i + 1)).css("color", COLORS[i % COLORS.length]);
        }
      } else {
        $('.title').text("Please check your spelling and try again");
        validShow = false;
      }

    })
}



function average(episodes) {
  let sum = 0.0;
  let err = 0;
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != 'N/A') {
      sum += parseFloat(episodes[i]);
    } else {
      err++;
    }
  }
  return (sum / (i - err));
}

function std(episodes) {
  let avg = average(episodes);
  let sumArr = [];
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != 'N/A') {
      sumArr.push(Math.pow((episodes[i] - avg), 2));
    }
  }
  answer = Math.pow(average(sumArr), .5);
  return answer;
}


function eachSeason(total, link, complete) {
  for (var i = 0; i < total; i++) {
    runAjax(link[i], complete);
  }
}

function getLength(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i + 1);
  }
  return arr;
}

function max(episodes) {
  let maxInfo = [
    [],
    []
  ];
  let max = 0;
  let maxIndex = 0;
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != "N/A" && episodes[i] != undefined) {
      if (max < episodes[i]) {
        max = episodes[i];
        maxIndex = i;
        maxInfo[0][0] = max;
        maxInfo[1][0] = maxIndex;
      }
    }
  }
  let k = 0;
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != "N/A" && episodes[i] != undefined) {
      if (max == episodes[i]) {
        maxInfo[0][k] = max;
        maxInfo[1][k] = i;
        k++;
      }
    }
  }
  return maxInfo;
}

function min(episodes) {
  let minInfo = [
    [],
    []
  ];
  let min = episodes[0];
  let minIndex = 0;
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != "N/A" && episodes[i] != undefined) {
      if (min > episodes[i]) {
        min = episodes[i];
        minIndex = i;
        minInfo[0][0] = min;
        minInfo[1][0] = minIndex;
      }
    }
  }
  let k = 0;
  for (var i = 0; i < episodes.length; i++) {
    if (episodes[i] != "N/A" && episodes[i] != undefined) {
      if (min == episodes[i]) {
        minInfo[0][k] = min;
        minInfo[1][k] = i;
        k++;
      }
    }
  }
  return minInfo;
}


function sum(numbers) {
  let sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum += parseFloat(numbers[i]);
  }
  return sum;
}

function linReg(ratings) {
  let count = 0;
  let err = 0;
  let x = [];
  let y = [];
  let x2 = [];
  let xy = [];
  for (var i = 0; i < ratings.length; i++) {
    if (ratings[i] != 'N/A') {
      x.push(i);
      y.push(ratings[i]);
      x2.push(x[i - err] * x[i - err]);
      xy.push(x[i - err] * y[i - err]);
    } else {
      err++;
    }
  }
  count = y.length;

  summedVars = [
    [sum(x)],
    [sum(y)],
    [sum(x2)],
    [sum(xy)]
  ];

  let m, b;
  if (count != 0) {
    m = parseFloat((count * summedVars[3] - summedVars[0] * summedVars[1]) / (count * summedVars[2] - Math.pow(summedVars[0], 2)).toFixed(2));
    b = parseFloat(((summedVars[1] - m * summedVars[0]) / count).toFixed(2));
  }
  return [
    [m],
    [b]
  ];
}



function trendData(epNames, ratingPerSeason) {
  let numUpto = [0];
  let temp = 0;
  for (var i = 0; i < ratingPerSeason.length; i++) {
    temp += ratingPerSeason[i].length;
    numUpto.push(temp);
  }

  let trendlines = [];
  for (var i = 0; i < ratingPerSeason.length; i++) {
    var newDataset = {
      label: 'Season ' + (i + 1),
      borderColor: COLORS[i % COLORS.length],
      data: [{
        x: 0,
        y: 0
      }, {
        x: 0,
        y: 0
      }],
      fill: false,
      pointRadius: 0
    };
    let trend = linReg(ratingPerSeason[i]);
    trendSeasons.push(trend[0][0]);
    if (width < maxWidth) {

    } else {
      newDataset.data[0].x = epNames[numUpto[i]];
      newDataset.data[1].x = epNames[numUpto[i + 1] - 1];
    }

    newDataset.data[0].y = parseFloat(trend[1]).toFixed(1);
    newDataset.data[1].y = parseFloat(trend[0] * (ratingPerSeason[i].length - 1) + parseFloat(trend[1])).toFixed(1);
    trendlines.push(newDataset);

  }
  return trendlines;
}

function mobile(epNames, trendlines, ratingPerSeason) {

  let numUpto = [0];
  let temp = 0;
  for (var i = 0; i < ratingPerSeason.length; i++) {
    temp += ratingPerSeason[i].length;
    numUpto.push(temp);
  }
  for (var i = 0; i < epNames.length; i++) {
    let split = epNames[i].split(':');
    epNames[i] = split[0];
  }

  for (var i = 0; i < trendlines.length; i++) {
    for (var j = 0; j < 2; j++) {
      trendlines[i].data[0].x = epNames[numUpto[i]];
      trendlines[i].data[1].x = epNames[numUpto[i + 1] - 1];
    }
  }

}


$("canvas .width").text('100');
$("#search").keyup(function(event) {
  if (event.keyCode === 13) {
    $("#search .submit").click();
  }
});



let runTime;
//let runTotalHours;
let name;
let total;
let header;
let allRatings = [];
let epNums = [];
let complete = [];
let epNames = [];
let ratingPerSeason = [];
let epNamesPerSeason = [];
var width = 0;
let avgSeasons = [];
let stdSeasons = [];

$("button").click(function() {
  console.log('yep');
});

$("#search .submit").click(function(event) {


  epNames = [];
  epNamesPerSeason = [];
  ratingPerSeason = [];
  avgSeasons = [];
  stdSeasons = [];
  trendSeasons = [];
  validShow = true;

  $('.action').unbind();
  $(".notes").addClass("hide");
  $('.graphic').show();
  $('.stats').show();
  $('.timeModule').removeClass("hide");
  $('.list').show();
  width = window.innerWidth;

  $('.content').empty();
  $('.minEps').empty();
  $('.maxEps').empty();
  $('#seasonLength').empty();
  let apiKey = 'c7dd0183';
  let title = $('#search .term').val();
  let nameQuery = '&t=' + title + '&type=series';
  let seasonQuery = [];
  let show = 'https://www.omdbapi.com/?apikey=' + apiKey + nameQuery;
  let link = [];
  getHeader(show);
  if (validShow) {

    $(".timeModule").removeClass("hide");
    $(".list").children().removeClass("hide");

    for (let i = 0; i < total; i++) {
      seasonQuery.push('&Season=' + (i + 1));
      link.push(show + seasonQuery[i]);
    }
    complete = [];
    allRatings = [];
    eachSeason(total, link, complete);

    for (let i = 0; i < complete.length; i++) {
      let ratings = [];
      let names = [];
      let empty = false;
      if (!complete[i].hasOwnProperty('Error')) {
        // for (let j = 0; j < complete[i].Episodes.length; j++) {
        //   ratings[j] = complete[i].Episodes[j].imdbRating;
        //   $('#index' + i + ' .json').append('<p>' + (i + 1) + '-' + (j + 1) + ': ' + complete[i].Episodes[j].Title + ': ' + ratings[j] + '</p>');
        //   allRatings.push(ratings[j]);
        //   names[j] = (i + 1) + '-' + (j + 1) + ': ' + complete[i].Episodes[j].Title;
        //   epNames.push(names[j]);
        // }

        for (let j = 0; j < complete[i].Episodes.length; j++) {
          ratings[j] = complete[i].Episodes[j].imdbRating;
          names[j] = (i + 1) + '-' + (j + 1) + ': ' + complete[i].Episodes[j].Title;
        }
        let flag = false;
        for (var j = 0; j < complete[i].Episodes.length; j++) {
          if (ratings[j] != "N/A") {
            flag = true;
          }
        }
        if (flag) {
          for (var j = 0; j < complete[i].Episodes.length; j++) {
            $('#index' + i + ' .json').append('<p>' + (i + 1) + '-' + (j + 1) + ': ' + complete[i].Episodes[j].Title + ': ' + ratings[j] + '</p>');
            allRatings.push(ratings[j]);
            epNames.push(names[j]);
          }
          avgSeasons.push(average(ratings));
          stdSeasons.push(std(ratings));

          $('#index' + i + ' .json').append('<h3>Average: ' + avgSeasons[i].toFixed(1) + '</h3>');
          $('#index' + i + ' .json').append('<h3>Standard Deviation: ' + stdSeasons[i].toFixed(2) + '</h3>');
          $('#index' + i + ' .json').append('<div class="besti"></div>');
          $('#index' + i + ' .json').append('<div class="worsti"><h3>Worst Episodes: </h3></div>');
        } else {
          $('#index' + i + ' .season').empty();
          names = [];
          ratings = [];
          empty = true;
          total--;
        }

      }
      if (!empty) {


        epNamesPerSeason.push(names);
        ratingPerSeason.push(ratings);

        let tempMax = max(ratingPerSeason[i]);
        let tempMin = min(ratingPerSeason[i]);
        $('#index' + i + ' .besti').html('<h3>Best Episodes: ' + tempMax[0][0] + '</h3>');
        for (var n = 0; n < tempMax[0].length; n++) {

          $('#index' + i + ' .besti').append('<p>' + epNamesPerSeason[i][tempMax[1][n]] + '</p>');

        }
        $('#index' + i + ' .worsti').html('<h3>Worst Episodes: ' + tempMin[0][0] + '</h3>');
        for (var n = 0; n < tempMin[0].length; n++) {

          $('#index' + i + ' .worsti').append('<p>' + epNamesPerSeason[i][tempMin[1][n]] + '</p>');

        }
      }

      ratings = [];
    }

    epNums = getLength(allRatings.length);
    let trendlines = trendData(epNames, ratingPerSeason);
    let tempMax = max(allRatings);
    let tempMin = min(allRatings);
    $('.avgScore').text('Average Episode Rating: ' + average(allRatings).toFixed(1));
    $('.totalStd').text('Standard Deviation: ' + std(allRatings).toFixed(2));
    $('.max').text('Best: ' + tempMax[0][0]);
    for (var i = 0; i < tempMax[0].length; i++) {
      if (i == 0) {
        $('.maxEps').append(epNames[tempMax[1][i]]);
      } else {
        $('.maxEps').append('<br>' + epNames[tempMax[1][i]]);
      }
    }
    $('.min').text('Worst: ' + tempMin[0][0]);
    for (var i = 0; i < tempMin[0].length; i++) {
      if (i == 0) {
        $('.minEps').append(epNames[tempMin[1][i]]);
      } else {
        $('.minEps').append('<br>' + epNames[tempMin[1][i]]);
      }
    }


    function calcTime(epNums, runTime) {

      let runDay = (runTime * (epNums.length + 1)) / (60 * 24);
      let runTotalHours = runDay * 24;

      let runHour = ((runDay % 1) * 24);


      let runMin = ((runHour % 1) * 60).toFixed(0) + " Mins";

      if (Math.floor(runDay) == 0) {
        runDay = "";
      } else {
        runDay = Math.floor(runDay) + " Days ";
      }
      if (Math.floor(runHour) == 0) {
        runHour = "";
      } else {
        runHour = Math.floor(runHour) + " Hours ";
      }

      return [runDay, runHour, runMin, runTotalHours];
    }

    function calcSingle(freeHours, totalRunTime) {

      let runDays = totalRunTime / freeHours;
      console.log(runDays);

      let totalDays = Math.ceil(runDays);
      console.log(totalDays);

      let weeks = totalDays / 7;
      let days = totalDays % 7;
      console.log(weeks);

      let result = 'Realistic time to finish show: ';
      let w = Math.floor(weeks);
      if (w != 0) {
        if (w == 1) {
          result += w + ' Week ';
        } else {
          result += w + ' Weeks ';
        }

      }

      if (days == 1) {
        result += days + ' Day';
      } else {
        result += days + ' Days';
      }

      return result;
    }

    let totalRunTime = calcTime(epNums, runTime);


    $('.avgRunTime').text('Average runtime per Episode: ' + runTime + ' Mins');
    $('.totalLength').text('Total Length of all Episodes: ' + totalRunTime[0] + totalRunTime[1] + totalRunTime[2]);

    for (var i = 0; i < total; i++) {
      let all = calcTime(ratingPerSeason[i], runTime);
      $('#seasonLength').append('<p>Season ' + (i + 1) + ': ' + all[0] + all[1] + all[2] + '</p>');
    }

    console.log(avgSeasons, stdSeasons, trendSeasons);
    $('.numEps').text('Number of Episodes: ' + epNums.length);
    let maxSeason = max(avgSeasons);
    let minSeason = min(avgSeasons);
    let constSeason = min(stdSeasons);
    let inconstSeason = max(stdSeasons);
    let mostImprovedSeason = max(trendSeasons);
    let leastImprovedSeason = min(trendSeasons);

    if (avgSeasons.length != 1) {
      $('.bestSeason').text('Best Rated Season: Season ' + (maxSeason[1][0] + 1));
      $('.mostImprovedSeason').text('Most Improved Season: Season ' + (mostImprovedSeason[1][0] + 1));
      $('.worstSeason').text('Worst Rated Season: Season ' + (minSeason[1][0] + 1));

      if (leastImprovedSeason[0][0] < 0) {
        $('.leastImprovedSeason').text('Most Disappointing Season: Season ' + (leastImprovedSeason[1][0] + 1));

      }
      $('.constSeason').text('Most Consistent Season: Season ' + (constSeason[1][0] + 1));
      $('.inconstSeason').text('Least Consistent Season: Season ' + (inconstSeason[1][0] + 1));

    }

    if (width < maxWidth) {
      mobile(epNames, trendlines, ratingPerSeason);
    }


    generateChart(name, allRatings, epNames, trendlines);



    $("#calculate").keyup(function(event) {
      if (event.keyCode === 13) {
        $("#calculate .submit").click();
      }
    });
    $('#calculate .submit').click(function(event) {
      let freeHours = parseFloat($('#calculate .term').val());
      console.log(totalRunTime[3]);
      let result = calcSingle(freeHours, totalRunTime[3]);
      $('.result').text(result);
    });




    $('.json').addClass('hide');
    $('.season').click(function() {
      $(this).next().slideToggle(200);
    });

    $('.action').click(function() {
      if ($('.json').is(':hidden')) {
        $('.json').slideDown(200);
      } else {
        $('.json').slideUp(200);
      }
    });
  } else {
    $('.graphic').hide();
    $('.stats').hide();
    $('.timeModule').addClass("hide");
    $('.list').hide();
  }
});
