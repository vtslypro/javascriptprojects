var API_KEY = '320d6619216242dbebf256d24b24e6e2';

var gb = require('geckoboard')(
  API_KEY
);


gb.datasets.findOrCreate(
  {
    id: 'blinky.bytheminute',
    fields: {
      powerdata: {
        type: 'number',
        name: 'Power'
      },
      temperaturedata: {
        type: 'number',
        name: 'Temperature'
      },
      date: {
        type: 'date',
        name: 'Date'
      }
    }
  },
  function (err, dataset) {
    if (err) {
      console.error(err);
      return;
    }

    dataset.put(
      [
        { date: '2016-01-01', powerdata: 0, temperaturedata: 10 },
        { date: '2016-01-02', powerdata: 1, temperaturedata: 50 },
        { date: '2016-01-03', powerdata: 0, temperaturedata: 40 }
      ],
      function (err) {
        if (err) {
          console.error(err);
          return;
        }

        console.log('Dataset created and data added');
      }
    );

  }
);