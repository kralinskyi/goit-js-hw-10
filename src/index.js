import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, 300));

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery === '') {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearMarkup();
      if (countries.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else {
        renderCountriesList(countries);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function clearMarkup() {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const fifaId = country.fifa.toString().toLowerCase();

  refs.countryInfo.innerHTML = `
    <div class="country-card">
      <img src="${country.flags.svg}" alt="${country.name.official} flag"/>
      <div class="country-info-card">
        <h2>${country.name.official}</h2>
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population.toLocaleString()}</p>
        <p><b>Languages:</b> ${country.languages[fifaId]}</p>
      </div>
    </div>
  `;
}

function renderCountriesList(countries) {
  const countriesMarkup = countries
    .map(country => {
      return `
      <li class="country-list-item">
        <img src="${country.flags.svg}" alt="${country.name.official} flag" />
        <p>${country.name.official}</p>
      </li>
    `;
    })
    .join('');

  refs.countriesList.innerHTML = `<ul class="country-list">${countriesMarkup}</ul>`;

  refs.countriesList.addEventListener('click', onCountryClick);
}

function onCountryClick(event) {
  if (event.target.nodeName !== 'LI') {
    return;
  }

  const countryName = event.target.querySelector('p').textContent;

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
