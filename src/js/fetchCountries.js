import Notiflix from 'notiflix';

export function fetchCountries(searchQuery) {
  const url = `https://restcountries.com/v3.1/name/${searchQuery}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(data => {
      return data;
    });
}
