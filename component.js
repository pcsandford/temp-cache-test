"use strict";

const $directoryContainer = $(".directory");
const riseCache = RiseVision.Common.RiseCache;
const imageCols = [ 2, 4 ];

// Wait for 'WebComponentsReady'.
      window.addEventListener("WebComponentsReady", () => {
        const sheet = document.getElementById("googleSheetDirectory");

        // Respond to events it fires.
          sheet.addEventListener("rise-google-sheet-response", e => {
              if (e.detail && e.detail.results) {

                displayEvents(e.detail.results);
              }
            });

            function displayEvents( events ) {
              let callsRemaining = 0;

              events.shift();

              // Get total count of calls to be made to Rise Cache.
              events.forEach( event => {
                imageCols.forEach( imageCol => {
                  if ( event[ imageCol ] ) {
                    callsRemaining++;
                  }
                } );
              } );

              // Set image URLs.
              events.forEach( event => {
                imageCols.forEach( imageCol => {
                  if ( event[ imageCol ] ) {
                    getFile( event[ imageCol ], url => {
                      event[ imageCol ] = url;
                      onFileFetched();
                    } );
                  }
                } );
              } );

              // Get the proper URL to use from Rise Cache.
              function getFile( url, callback ) {
                riseCache.getFile( url, ( response, error ) => {
                  if ( error ) {
                    onFileFetched();
                    return;
                  }

                  if ( callback ) {
                    callback( response.url );
                  }
                } );
              }

              function onFileFetched() {
                callsRemaining--;

                if ( callsRemaining === 0 ) {
                  appendTheCards( events );
                }
              }
            };

            //append the cards which now have the new urls from the array
            const appendTheCards = function(finalResults) {

              const eventEntry = finalResults.map( entry => {

                if(entry[2]) {
                  return `<li class="events-screen__entry clearfix"
                                            data-name="${entry[0]}"
                                            data-position="${entry[1]}"
                                            data-image="${entry[2]}"
                                            data-details="${entry[3]}"
                                            data-qr="${entry[4]}">
                                            <div class="person__details">
                                              <p class="person__name">${entry[0]}</p>
                                              <p class="person__text">${entry[1]}</p>
                                              <p class="button--more">More Details</p>
                                            </div>
                                            <img class="person_image" src="${entry[2]}" alt="smiley">
                                          </li>`;
                }

                else {
                  return `<li class="events-screen__entry clearfix"
                                          data-name="${entry[0]}"
                                          data-position="${entry[1]}"
                                          data-image="${entry[2]}"
                                          data-details="${entry[3]}"
                                          data-qr="${entry[4]}">
                                          <div class="person__details">
                                            <p class="person__name">${entry[0]}</p>
                                            <p class="person__text">${entry[1]}</p>
                                            <p class="button--more">More Details</p>
                                          </div>
                                        </li>`;
                }

              });

              $directoryContainer.empty();

              $directoryContainer.append(eventEntry);

            };

            sheet.go(); // Executes a request.
      });