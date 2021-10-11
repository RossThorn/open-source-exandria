# Open-Source Exandria (OSE)
 A repository for fans of Critical Role to freely use and contribute to the data behind the [interactive fantasy map](https://www.redgiantmaps.com/maps/exandria).

 ## About
 The Orly Skiffback Exandriarium, also known as **Open-Source Exandria (OSE)**, is an open-source repository of the map data for the world of Exandria, created by Matthew Mercer of the incredibly popular livestream RPG group, [Critical Role](https://critrole.com/). Orly has navigated all around the seas of Exandria and knows a thing or two about its geography and has graciously provided data to Red Giant Maps, the creator and curator of the interactive maps for [Wildemount](https://www.redgiantmaps.com/maps/wildemount) and [Tal'Dorei](https://www.redgiantmaps.com/maps/taldorei). This repo is intended for geographic mappers and critters to not only get a glimpse at the fantasy map data, but also contribute to its growth by digitizing cities or adding other features. The sky is the limit for whatever you want to do with it!

 Not sure where to start? Check out the highlights on my [Twitch Channel](https://www.twitch.tv/rth0rn/videos) and this [YouTube tutorial](https://youtu.be/5ByYLeTls2Q) to see how to work with fantasy maps in QGIS.

 ![Orly Skiffback](https://static.wikia.nocookie.net/criticalrole/images/d/d9/Orly_Skiffback_by_David_Ren%C3%A9.jpg/revision/latest/scale-to-width-down/310?cb=20180926151624)  
 *Art by [David René](http://www.crushingrainbow.com/)*

 ## Contents
 This repo contains three important aspects:
 #### OSE Map Document (.qgz file)
 This is the [QGIS](https://www.qgis.org) map document that can be used to add, edit, and manage the data. You'll need to install QGIS (3.16 or newer) to open the file.

 #### Data (folder)
 This folder contains the OSE folder with the following vector data in geojson format. The data should all be referenced with relative paths.
 
 #### Webmap (folder)
 This folder contains the code to spin up a web page with a Mapbox map of your very own! You'll need to create a [Mapbox](https://www.mapbox.com) account and change some variables to get it rolling. See the [discussion](https://github.com/RossThorn/open-source-exandria/discussions/2) post for more details and the tutorials in the about section for a more detailed walkthrough.

| Name | Description | Feature Type |
|-|-|-|
| exandria_bathmetry | The water depth data for the entire world of Exandria. This, like the other bathymetry data in this repo, is mostly conjecture and just added to make it look good. | polygon |
| exandria_cities | All of the populated places on all continents in Exandria. | point |
| exandria_pois | All of the points of interest (typically not populated places) on all continents in Exandria. | point |
| taldorei_bathymetry | The water depth data for the continent of Tal'Dorei. **Note**: This and the Wildemount bathymetry are digitized with only their respective continents in mind to be used in standalone maps. | polygon |
| taldorei_cities | All of the populated places in Tal'Dorei. | point |
| taldorei_inland_water | The inland waterbodies located within Tal'Dorei. | polygon |
| taldorei_label_points | Locations of labels for geographical features in Tal'Dorei. | point |
| taldorei_land | The basic landmass for Tal'Dorei (inland waterbodies have been clipped out). | polygon |
| taldorei_landcover | The dominant [landcover](https://en.wikipedia.org/wiki/Land_cover) for areas in Tal'Dorei. | polygon |
| taldorei_pois | All of the points of interest in Tal'Dorei. | point |
| taldorei_roads | The major roadways in Tal'Dorei. | line |
| wildemount_bathymetry | The water depth data for the continent of Wildemount. | polygon |
| wildemount_cities | All of the populated places in Wildemount. | point |
| wildemount_city_block_polys | The shapes of the city blocks in the cities of Wildemount. | polygon |
| wildemount_city_palace_walls | The thicker walls in a city in Wildemount (typically used for the outer walls of the city and the walls that separate inner, "royal" areas from that of the commoners; see the Rexxentrum map for reference). | line |
| wildemount_city_walls | The thinner walls in a city in Wildemount (typically used to separate inner wards of the a city from each other). | line |
| wildemount_city_ward_labels | Label locations for named wards/buroughs/neighborhoods of a city map in Wildemount. | point |
| wildemount_inland_water | The inland waterbodies located within Wildemount. | polygon |
| wildemount_label_points | Locations of labels for geographical features in Tal'Dorei. | point |
| wildemount_land | The basic landmass for Wildemount (inland waterbodies have been clipped out). | polygon |
| wildemount_landcover | The dominant landcover for areas in Wildemount. | polygon |
| wildemount_pois | All of the points of interest in Wildemount. | point |
| wildemount_roads | The major roadways of Wildemount. | line |

 ### Extras
 In the root folder, there are two georeferenced images of maps (.geo_tif files) for the continent of Tal'Dorei and the city of Rexxentrum. Wildemount is not included due to the size and resolution exceeding github size restrictions (working on getting a solution). These are linked to layers in the file and are merely for reference. However, if you wish to add other cities, please follow suit and add the georeferenced images you used to digitize the features.

 ### Pull Requests
 At this point in the project, I will try to check pull requests on a monthly basis for potential changes to bring into the interactive maps. A couple points:
 1. Descriptions for cities and pois are limited in order to succinctly summarize the location to make sure the popup in the map is small. You are free to edit these for your own personal usage, but pull requests regarding descriptions will most likely be limited to correcting typos or other mistakes.
 2. **Only officially published Critical Role content is to be used to create new data for integration.** These maps are intended to be as true as possible to the official CR content. There are several well-done maps that might branch out into neighboring continents, but until there are published sources for these, they will be omitted.
 3. Feel free to make pull requests for adding other fields. At the time of this writing, demographic data or political affiliations are not recorded in any of the fields for the map, but that doesn't mean they can't be added! 
 4. If adding data that exists on one continent but not another (e.g., city maps in Wildemount vs Tal'Dorei), please follow the format of the existing data.
 5. It is **EXTREMELY IMPORTANT** that any data added is the proper scale. If you plan to add cities, please take a look at the Rexxentrum map to see that the scale bar of the map you're using for reference is the same scale.
 
 ### Please feel free to reach out with any questions or comments
 [Reddit](https://www.reddit.com/user/RedGiantMaps)  
 [Instagram](https://www.instagram.com/redgiantmaps)  
 [Email](mailto:ross@redgiantmaps.com)  
 [Twitter](https://www.twitter.com/RealRossThorn)
