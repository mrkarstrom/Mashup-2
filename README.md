# Mashup API  

**Version:** 1.0.0  
**Author:** Magnus Karström  
**Description:** A REST API that combines data from MusicBrainz, Wikidata, Wikipedia, and Cover Art Archive to fetch artist details, including descriptions and album information.

---

## Table of Contents  

1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Requirements](#requirements)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [API Documentation](#api-documentation)  
7. [Testing](#testing)  
8. [Project Structure](#project-structure)  
9. [Known Limitations and Future Work](#known-limitations-and-future-work)  
10. [License](#license)  

---

## Introduction  

This API combines data from multiple sources to deliver a comprehensive artist profile:  
- **MusicBrainz**: Provides artist metadata, including album lists.
- **Wikidata**: Bridges data from MusicBrainz to Wikipedia, providing artist descriptions in multiple languages.
- **Wikipedia**: Supplies artist descriptions sourced through Wikidata or directly from MusicBrainz.
- **Cover Art Archive**: Fetches album artwork.  

### API Workflow  
1. The user provides an MBID (MusicBrainz Identifier).  
2. The API retrieves:
   - A description of the artist from Wikipedia, using Wikidata as an intermediary if necessary.
   - A list of albums and their corresponding cover images from MusicBrainz and Cover Art Archive.  

---

## Features  

- **RESTful API:** Complies with REST principles and returns data in JSON format.  
- **Caching:** Utilizes `node-cache` to handle high traffic and reduce external API requests.  
- **Scalable and Modular:** Built with Node.js and Express for easy integration and scalability.
- **Multi-source Integration**: Seamlessly combines data from MusicBrainz, Wikidata, Wikipedia, and Cover Art Archive.  
- **Error Handling:** Graceful error responses and fallbacks for missing data.  

---

## Requirements  

- **Node.js**: Version 16 or later.  
- **npm**: Installed with Node.js.  
- An active internet connection for API requests.  

---

## Installation  

1. Extract the provided `.zip` file to your desired location.  
2. Open the project folder in your terminal or IDE.  
3. Install dependencies by running the following command in your terminal:  
   `npm install`
4. Start the development server with live reloading:  
   `npm run dev`
5. Start the production server:  
   `npm run start`
6. Alternatively, start testing suites:  
   `npm run test`  

---

## Usage  

After starting the server, the API will be available at `http://localhost:3000` by default.  

### Example Request  

To fetch data for an artist using their MBID, send a `GET` request to:  
`http://localhost:3000/artist/{mbid}`  

Replace `{mbid}` with the actual MusicBrainz Identifier.  

#### Example  
Request:  
`http://localhost:3000/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da`  

Response:  
```json
{
   "mbid": "5b11f4ce-a62d-471e-81fc-a69a8278c7da",
   "description": "<p><b>Nirvana</b> was an American rock band formed in Aberdeen, Washington, in 1987...</p>",
   "albums": [
       {
           "title": "Nevermind",
           "id": "1b022e01-4da6-387b-8658-8678046e4cef",
           "image": "http://coverartarchive.org/release/a146429a-cedc-3ab0-9e41-1aaf5f6cdc2d/3012495605.jpg"
       },
       {
           "title": "In Utero",
           "id": "f8a1557a-56dc-39b1-8c48-6a3c4e06507a",
           "image": "http://coverartarchive.org/release/a79d9397-d7a5-34b3-a13c-8ef4d915a6a4/2033894523.jpg"
       }
   ]
}
```

---

## API Documentation  

### Endpoints  

#### 1. `/artist/{mbid}`  
**Method:** `GET`  
**Description:** Fetches artist data, including a description and album list with cover art.  

##### Parameters  
- **`{mbid}`**: The MusicBrainz Identifier for the artist written in UUID-format: 8-4-4-4-12 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).  

##### Response  
A JSON object containing:  
- **`mbid`**: The MusicBrainz Identifier for the artist.  
- **`description`**: A brief description of the artist, retrieved from Wikipedia.  
- **`albums`**: An array of objects containing album details:  
  - `title`: The album title.  
  - `id`: The unique identifier for the album.  
  - `image`: The URL of the album cover art.  

---

## Testing  

The API has been thoroughly tested using Jest.  

### Running Tests  

To execute all test suites, run the following command in the terminal:  
`npm run test`  

---

## Project Structure

```
project-root/
├── src/
│   ├── routes/ 
│   │   └── artistRoutes.js
│   ├── services/ 
│   │   └── artistServices.js
│   ├── utils/ 
│   │   ├── CacheUtil.js
│   │   ├── ErrorHandler.js
│   │   └── wrapAsync.js
│   ├── test/ 
│   │   ├── api.test.js
│   │   ├── ArtistService.test.js
│   │   ├── cacheUtil.test.js
│   │   ├── edgeCase.test.js
│   │   ├── errorHandling.test.js
│   │   └── integration.test.js
├── index.js
├── package.json
└── README.md

```


---

## Known Limitations and Future Work  

### Known Limitations  
1. **Rate Limits**: External APIs may impose request limits, which could affect performance under heavy traffic.  
2. **Incomplete Data**: If an external API fails to return data (e.g., missing album artwork), the response may have gaps.  
3. **Dependency on External APIs**: The API relies on third-party services, which could become unavailable or deprecated.  

### Future Work  
1. **OAuth Integration**: Implement authentication for user-specific data.  
2. **Pagination**: Add pagination support for large album lists.  
3. **GraphQL Support**: Provide an alternative query interface for advanced users.  
4. **Extended Caching**: Integrate a distributed caching mechanism like Redis for enhanced performance.  

---

## License  

This project is licensed under the MIT License. See the LICENSE file for more details.  
