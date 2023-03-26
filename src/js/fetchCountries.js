const url = 'https://restcountries.com/v3.1/name/';
const filter = '?fields=name,flags,population,capital,languages';

export function fetchCountries(name) {
  return fetch(`${url}${name}${filter}`).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    // console.log(response.json());
    return responce.json();
  });
}
