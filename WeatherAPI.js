const apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4714921&lon=24.5734362';

const headers = {
  'User-Agent': 'Tallinna ilmaennustus', // Lisab kasutajaagendi päises
};

console.log(`Praegune ilm Tallinnas:`); // Kuvab teate praeguse ilma kohta Tallinnas

fetch(apiUrl, {
  method: 'GET', // Päringumeetod on GET
  headers: headers, // Kasutab määratud päiseid
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP viga! Staatus: ${response.status}`); // Viskab vea, kui vastus ei ole edukas
    }
    return response.json(); // Tagastab vastuse JSON-andmetena
  })
  .then(data => {
    data.properties.timeseries.forEach(entry => { // Läbib "timeseries" massiivi
      const time = new Date(entry.time); // Teisendab aja Date objektiks
      const estonianTime = time.toLocaleString('et-EE', { timeZone: 'Europe/Tallinn' }); // Kohandab aja Eesti ajatsoonile
      const airTemperature = entry.data.instant.details.air_temperature; // Õhutemperatuur
      const precipitation = entry.data.instant.details.precipitation_amount; // Sademed
      const windSpeed = entry.data.instant.details.wind_speed; // Tuulekiirus
      const humidity = entry.data.instant.details.relative_humidity; // Õhuniiskus

      // Kuvab ilmaandmed, kui need on saadaval
      console.log(`Aeg: ${estonianTime}`);
      console.log(`Õhutemperatuur: ${airTemperature} °C`);
      if (typeof precipitation !== 'undefined') {
        console.log(`Sademed: ${precipitation} mm`);
      } else {
        console.log(`Sademed: Andmed puuduvad`);
      }
      console.log(`Tuulekiirus: ${windSpeed} m/s`);
      console.log(`Õhuniiskus: ${humidity}%`);
      console.log(); // Lisab tühja rea järgmise kirje eraldamiseks
    });
  })
  .catch(error => {
    console.error('Viga päringu tegemisel:', error.message); // Kuvab veateate
  });
