import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, 300));

function clearMarkup() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function onSearch(event) {
  event.preventDefault();
  const searchQuery = event.target.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearMarkup();
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length <= 10 && countries.length >= 2) {
        renderCountriesList(countries);
      } else {
        console.log(countries);
        renderCountryInfo(countries[0]);
      }
    })
    .catch(error => {
      if ((error.message = 404)) {
        clearMarkUp();

        Notiflix.Notify.failure('Oops, there is no country with that name');
        refs.searchBox.value = '';
        console.log(error);
      }
    });

  function clearMarkUp() {
    refs.countriesList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }

  function renderCountryInfo(country) {
    const { flags, name, capital, population, languages } = country;

    refs.countryInfo.innerHTML = `
    <div class="country-card">
      <img src="${flags.svg}" alt="${name.official} flag"/>
      <div class="country-info-card">
        <h2>${name.official}</h2>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population.toLocaleString()}</p>
        <p><b>Languages:</b> ${Object.values(languages)}</p>
      </div>
    </div>
  `;
  }

  function renderCountriesList(countries) {
    const countriesMarkup = countries
      .map(country => {
        const { flags, name } = country;

        return `
      <li class="country-list-item">
        <img src="${flags.svg}" alt="${name.official} flag" />
        <p>${name.official}</p>
      </li>
    `;
      })
      .join('');

    refs.countriesList.innerHTML = `<ul class="country-list">${countriesMarkup}</ul>`;
  }
}
