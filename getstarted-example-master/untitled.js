dataset.put(
      [
        { date: '2016-01-01', powerData: 209, temperatureData: 10 },
        { date: '2016-01-02', powerData: 409, temperatureData: 50 },
        { date: '2016-01-03', powerData: 164, temperatureData: 40 }
      ],
      function (err) {
        if (err) {
          console.error(err);
          return;
        }

        console.log('Dataset created and data added');
      }
    );