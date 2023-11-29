
// Hämta tillåtna värden och bygg filter-menyer
fetchAPI("https://dog.ceo/api/breeds/list/all", buildDogBreedsMenu);    
fetchAPI("https://api.chucknorris.io/jokes/categories", buildChuckCategoryMenu);
fetchAPI("https://restcountries.com/v3.1/all?fields=cca2,name,languages,capital", buildCountryMenus);


////////////////////////////////////////////////////////////////////////////////////////
// Submit-handler för filter-formuläret för öl
document.querySelector("#beer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const inputName = document.querySelector("#beer_name").value;
    const inputFood = document.querySelector("#food").value;
    const inputBrewed = document.querySelector("#brewed_before").value;

    const apiUrl = new URL("https://api.punkapi.com/v2/beers");

    if (inputName.length > 0) {
        apiUrl.searchParams.append("beer_name", inputName);
    }
    if (inputFood.length > 0) {
        apiUrl.searchParams.append("food", inputFood);
    }
    if (inputBrewed.length > 0) {
        apiUrl.searchParams.append("brewed_before", inputBrewed);
    }
    
    fetchAPI(apiUrl, showBeer);
});


////////////////////////////////////////////////////////////////////////////////////////
// Submit-handler för filter-formuläret för hundar
document.querySelector("#dog-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const inputBreed = document.querySelector("#dog-breed").value;
    const inputCount = document.querySelector("#dog-amount").value;

    if ((inputBreed.length > 0) && (inputCount > 0)) {
        const apiUrl = new URL(`https://dog.ceo/api/breed/${inputBreed}/images/random/${inputCount}`);
        fetchAPI(apiUrl, showDogs);
    }
    else if (inputCount > 0) {
        const apiUrl = new URL(`https://dog.ceo/api/breeds/image/random/${inputCount}`);
        fetchAPI(apiUrl, showDogs);
    }
});


////////////////////////////////////////////////////////////////////////////////////////
// Submit-handler för ilter-formuläret för skämt
document.querySelector("#chuck-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const selectedCategory = document.querySelector("#chuck-category").value;

    const apiUrl = new URL("https://api.chucknorris.io/jokes/random");

    if (selectedCategory.length > 0) {
        apiUrl.searchParams.append("category", selectedCategory);
    }

    fetchAPI(apiUrl, showJoke);
});


////////////////////////////////////////////////////////////////////////////////////////
// Submit-handler för filter-formuläret länder
document.querySelector("#country-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    const filterCountry = document.querySelector("#country-name").value;
    const filterLanguage = document.querySelector("#country-language").value;
    const filterCapital = document.querySelector("#country-capital").value;
    const showFields = document.querySelectorAll("input[name='fields']");

    let apiUrl;
    let selectedFields = [];

    for (const field of showFields) {
        if (field.checked) {
            selectedFields.push(field.value);
        }
        
    }

    if (filterCountry.length > 0) {
        apiUrl = new URL("https://restcountries.com/v3.1/alpha");
        apiUrl.searchParams.append("codes", filterCountry);
    }
    else if (filterLanguage.length > 0) {
        apiUrl = new URL("https://restcountries.com/v3.1/lang/" + filterLanguage);
    }
    else if (filterCapital.length > 0) {
        apiUrl = new URL("https://restcountries.com/v3.1/capital/" + filterCapital);
        
    }

    if (apiUrl !== undefined) {
        if (selectedFields.length > 0) {
            apiUrl.searchParams.append("fields", selectedFields.join(","));
        }

       fetchAPI(apiUrl, showCountry);
    }
});

////////////////////////////////////////////////////////////////////////////////////////
// Väljare för sök-kriterier för länder
document.querySelector("#country-search").addEventListener("change", (event) => {
    const elements = document.querySelectorAll(".filter");
    for (const element of elements) {
        if (element.id != event.currentTarget.value) {
            element.classList.remove("show");
            element.value = "";
        }
        else {
            element.classList.add("show");
        }
    }
});


////////////////////////////////////////////////////////////////////////////////////////
// Fyll i dog breed menyn
function buildDogBreedsMenu(response) {
    const dogBreedSelect = document.querySelector("#dog-breed");
    const dogBreeds = response.message;

    for (const dogBreed in dogBreeds) {
        const breedOption = document.createElement("option");
        breedOption.value = dogBreed;
        breedOption.innerText = dogBreed;
        dogBreedSelect.appendChild(breedOption);

        if (dogBreeds[dogBreed].length > 0) {
            for (const subBreed of dogBreeds[dogBreed]) {
                const subOption = document.createElement("option");
                subOption.value = `${dogBreed}/${subBreed}`;
                subOption.innerText = `${subBreed} ${dogBreed}`;
                dogBreedSelect.appendChild(subOption);
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Fyll i skämt-kategorimenyn 
function buildChuckCategoryMenu(jokeCategories) {
    const categorySelect = document.querySelector("#chuck-category");

    for (const jokeCategory of jokeCategories) {
        const jokeOption = document.createElement("option");
        jokeOption.value = jokeCategory;
        jokeOption.innerText = jokeCategory;
        categorySelect.appendChild(jokeOption);
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// Fyll i värden för länder-filtrets menyer
function buildCountryMenus(countries) {
    const countrySelect = document.querySelector("#country-name");
    const languageSelect = document.querySelector("#country-language");
    const capitalSelect = document.querySelector("#country-capital");

    let languageList = [];
    let capitalList = [];

    // Sortera länder efter kort namn i bokstavsordning
    countries.sort(function(a,b) {
        if (a.name.common > b.name.common) {
            return 1;
        }
        else if (a.name.common < b.name.common) {
            return -1;
        }
        else {
            return 0;
        }
    });

    
    for (const country of countries) {
        // Namn-menyn
        const countryOption = document.createElement("option");
        countryOption.value = country.cca2;
        countryOption.innerText = country.name.common;
        countrySelect.appendChild(countryOption);

        // Samla ihop språk utan dubletter
        if (country.languages !== undefined) {
            for (const lang in country.languages) {
                if (!languageList.includes(country.languages[lang]) && (country.languages[lang].length > 0)) {
                    languageList.push(country.languages[lang]);
                }
            }
        }

        // Samla ihop huvudstäder utan dubletter
        if (country.capital !== undefined) {
            if (!capitalList.includes(country.capital) && (country.capital.length > 0)) {
                capitalList.push(country.capital);
            }
        }
    }

    // Sortera val i bokstavs/nummer-ordning innan menyerna byggs
    languageList.sort();
    capitalList.sort();

    // Bygg språk-menyn
    for (const language of languageList) {
        const langOption = document.createElement("option");
        langOption.value = language;
        langOption.innerText = language;
        languageSelect.appendChild(langOption);
    }

    // Bygg huvudstad-menyn
    for (const capital of capitalList) {
        const capitalOption = document.createElement("option");
        capitalOption.value = capital;
        capitalOption.innerText = capital;
        capitalSelect.appendChild(capitalOption);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Visa info om hund(ar) på sidan
function showDogs(dogsResponse) {
    const outBox = document.querySelector("#dog-output");
    outBox.innerHTML = "";
    document.querySelector("#dog-results").innerHTML = `Results: ${dogsResponse.message.length}`;

    for (const dog of dogsResponse.message) {
        const dogBox = document.createElement("figure");
        const dogImage = document.createElement("img")
        dogImage.src = dog;
        dogBox.classList.add("dogbox");
        dogBox.appendChild(dogImage);
        outBox.appendChild(dogBox);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Visa info om öl på sidan
function showBeer(beers) {
    const outBox = document.querySelector("#beer-output");
    outBox.innerHTML = `Results: ${beers.length}`;
  
    for (const beer of beers) {
      const beerBox = document.createElement("div");
      beerBox.classList.add("beerbox");
  
      const beerName = document.createElement("h2");
      const beerTag = document.createElement("div");
      const beerBrewed = document.createElement("div");
      const beerDesc = document.createElement("p");
      const beerFood = document.createElement("ul");
      const beerFoodTitle = document.createElement("h3");
      const beerImage = document.createElement("img");
  
      beerImage.src = beer.image_url;
      beerImage.classList.add("beerimage");
      beerFoodTitle.innerText = "Food pairing";
      beerName.innerText = beer.name;
      beerTag.innerText = beer.tagline;
      beerDesc.innerText = beer.description;
      beerBrewed.innerHTML = `<strong>First brewed:</strong> ${beer.first_brewed}`;
  
      beerFood.appendChild(beerFoodTitle);
      for (const pairing of beer.food_pairing) {
        const foodItem = document.createElement("li");
        foodItem.innerText = pairing;
        beerFood.appendChild(foodItem);
      }
  
      beerBox.append(beerImage, beerName, beerTag, beerDesc, beerFood, beerBrewed);
      outBox.appendChild(beerBox);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Visa ett Chuck Norris skämt
function showJoke(joke) {
    const outBox = document.querySelector("#chuck-output");

    const jokeBox = document.createElement("div");
    const jokeText = document.createElement("p");

    jokeBox.classList.add("jokebox");
    jokeText.innerHTML = joke.categories.length > 0 ? `<strong>${joke.categories[0]}:</strong> ${joke.value}` : joke.value;

    jokeBox.appendChild(jokeText);

    if (outBox.children.length > 0) {
        outBox.insertBefore(jokeBox, outBox.children[0]);
    }
    else {
        outBox.appendChild(jokeBox);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Visa länder på sidan utifrån valda filter
function showCountry(countries) {
    console.log("COUNTRY RESULT", countries);
    const outBox = document.querySelector("#country-output");
    outBox.innerHTML = "";

    for (const country of countries) {
        const countryBox = document.createElement("div");
        countryBox.classList.add("countrybox");

        if (country.flags !== undefined) {
            const flagImg = document.createElement("img");
            flagImg.classList.add("flagbox");
            flagImg.src = country.flags.png;
            flagImg.alt = country.flags.alt;
            countryBox.appendChild(flagImg);
        }
        if (country.name !== undefined) {
            const nameField = document.createElement("h3");
            const nameNative = document.createElement("div");

            nameNative.classList.add("nativenames");
            nameField.innerText = country.name.common;
            
            for (const inLanguage in country.name.nativeName) {  
                const nameRow = document.createElement("div");
                nameRow.innerText = country.name.nativeName[inLanguage].official;
                nameNative.appendChild(nameRow);
            }
            
            countryBox.appendChild(nameField);
            countryBox.appendChild(nameNative);
        }
        if (country.region !== undefined) {
            const regionField = document.createElement("div");
            regionField.innerHTML = `<strong>Region:</strong> ${country.region}`;
            countryBox.appendChild(regionField);
        }
        if (country.capital !== undefined) {
            const regionField = document.createElement("div");
            regionField.innerHTML = `<strong>Capital:</strong> ${country.capital}`;
            countryBox.appendChild(regionField);
        }
        if (country.population !== undefined) {
            const popField = document.createElement("div");
            popField.innerHTML = `<strong>Population:</strong> ${country.population}`;
            countryBox.appendChild(popField);
        }
        if (country.timezones !== undefined) {
            const timeZones = document.createElement("ul");
            const timeZoneTitle = document.createElement("div");
            timeZoneTitle.innerText = "Time zone(s):";
            timeZoneTitle.classList.add("subheading");
            for (const timezone of country.timezones) {
                const timeZone = document.createElement("li");
                timeZone.innerText = timezone;
                timeZones.appendChild(timeZone);
            }
            countryBox.appendChild(timeZoneTitle);
            countryBox.appendChild(timeZones);
        }
        if (country.languages !== undefined) {
            const langList = document.createElement("ul");
            const langsTitle = document.createElement("div");
            langsTitle.innerText = "Language(s):";
            langsTitle.classList.add("subheading");
            for (const lang in country.languages) {
                const langItem = document.createElement("li");
                langItem.innerText = country.languages[lang];
                langList.appendChild(langItem);
            }
            countryBox.appendChild(langsTitle);
            countryBox.appendChild(langList);
        }

        outBox.appendChild(countryBox);
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// Hämta och returnera data från API
async function fetchAPI(fetchURL, callbackFunc, errorFunc=errorHandler) {
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) 
            throw new Error(`Fetch error: ${response.status}`);
        const result = await response.json();
        callbackFunc(result);
    }
    catch (err) {
        errorFunc(err);
    }
}

function errorHandler(error) {
    console.log("FetchAPI Error", error);
    alert("Problem att hämta från API: " + error);
}