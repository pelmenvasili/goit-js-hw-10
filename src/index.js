import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const clearAll = () => {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
};

const renderCountriesCard = country => {
  clearAll();
  const c = country[0];
  countryInfoRef.innerHTML = `
            <img src="${
              c.flags.svg
            }" alt="Country flag" width="55", height="35">
            <h2>${c.name.official}</h2>
            <p><strong>Capital:</strong> ${c.capital}</p>
            <p><strong>Population:</strong> ${c.population}</p>
            <p><strong>Languages:</strong> ${Object.values(c.languages).join(
              ', '
            )}</p>`;
};

const renderCountriesList = countries => {
  clearAll();
  countryListRef.innerHTML = countries
    .map(
      c =>
        `<li>
            <img src="${c.flags.svg}" alt="${c.name.official} flag" width="40", height="30">
            <span>${c.name.official}</span>
        </li>`
    )
    .join('');
};

function handleInput() {
  const userInput = inputRef.value.trim();

  if (!userInput) {
    countryListRef.innerHTML = '';
    return;
  }

  fetchCountries(userInput)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length > 1) {
        renderCountriesList(countries);
      } else if (countries.length === 1) {
        renderCountriesCard(countries);
      } else {
        clearAll();
        Notiflix.Notify.failure('"Oops, there is no country with that name"');
      }
    })
    .catch(error => {
      console.error(error);
      Notiflix.Notify.failure('Oops, something went wrong. Please try again.');
    });
}

const debouncedInputHandler = debounce(handleInput, DEBOUNCE_DELAY);

inputRef.addEventListener('input', debouncedInputHandler);
