# National Park Finder <!-- omit in toc -->
- [Description](#description)
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Technologies Used](#technologies-used)
- [Demo and Usage](#demo-and-usage)
- [Grading Criteria](#grading-criteria)
- [TO DO](#to-do)
- [EXTRA](#extra)

## Description
National Park Finders.
This is a terrific application website that can be used by anyone wanting to use the internet to gather weather information about certain times of the day, certain times of the week and even certain times of the month about information that is critical of the weather which plays a vital role in our every day lifestyle's. For example the prediction of snow, rain and even ice-storms, this sort of information would be deem very useful to anyone and even especially when planing events on certain days of the week or even different times of the year. The application is centered on recreational parks and weather predictions and gives information that might be useful to someone wanting to for example schedule an outdoor event. This information can easily be gathered from its sleek and easy to use web interface that allows a user the ability of easy to use drop down search buttons that gives the names of all US states and a list of all sorts of activities that anyone might be interested in. This website can also be used to gather weather information on search topics, such as past historical events and even future predictions and so on. By just clicking on any state or activity from a given list you the user are given the information in real time, so this application in fact would be very useful to anyone who relies on the weather.

## User Story
```
AS A national park enthusiast
I WANT to see national park acitivities and local weather
SO THAT I can plan trips to national parks accordingly
```

## Acceptance Criteria
```
GIVEN a search engine for national park information
WHEN I load the application
THEN I am presented with a dropdown menus for activity type and state
WHEN I search using the activity and/or state criteria
THEN I am presented with national parks that match my search
WHEN I click on a national park
THEN I can view more detailed information about the park including current weather, 5-day forecast, address, pictures, and activities/events
WHEN I reload page
THEN I am presented with national parks that I viewed more information on
```

## Technologies Used
### HTML, CSS, JavaScript <!-- omit in toc -->
HTML provides the backbone for this application. In HTML, we outline the structure of the application and what information users will see upon loading the webpage. HTML is also used to define the modal and park result divs in the HTML and use JavaScript to populate those divs with information. Using this methodology, parent divs will appear and interact with the other html content as expected.

Most of the CSS in this project comes from Foundations, however custom CSS is implemented to make up for areas that Foundations doesn't cover. This includes general color themes, type-faces, font-sizing, padding, and margins.

JavaScript is the heavy lifter in this project. JavaScript gives the application access to Foundations content that is reliant on jQuery and JavaScript to work. JavaScript is also used to make API calls, dynamically generate HTML content, and cache user inputs and other data in localStorage.

### Zurb Foundations CSS Framework <!-- omit in toc -->
[Foundations](https://get.foundation/sites/docs/) is used to provide general structure to the webpage. The grid layout, for instance, is provided by the Foundations framework. Foundations is also used to create advanced components, such as the error and park modals (called reveals in Foundations).

### jQuery <!-- omit in toc -->
[jQuery](https://api.jquery.com/), is generally used for it's helpful methods for DOM manipulation. Unfortunately, jQuery is only used as a prequisite for Foundations for this project. Instead of jQuery, native JavaScript is used to reference and make changes to the DOM.

### National Park Service API <!-- omit in toc -->
The [National Park Service API](https://www.nps.gov/subjects/developer/api-documentation.htm) is used to get data about national parks in the United States and it's territories. That data is then used to populate park information, such as images and descriptions of parks, to the application. The location data from this API call is also used to get local weather data on that park from the OpenWeather API.

### OpenWeather API <!-- omit in toc -->
[OpenWeather API](https://openweathermap.org/api) is used to get current weather and weather forecasting for a chosen park. Weather data is then populated to the application for the user to see local weather at a park location.


## Demo and Usage

## Grading Criteria
### Technical Acceptance Criteria - 25% <!-- omit in toc -->
- [x] Application uses at least two server-side APIs
- [x] Application uses client-side storage to store persistent data
- [x] Application doesn't use JS alerts, prompts, or confirms (uses modals instead)
- [x] Application uses as CSS framework other than Bootstrap
- [x] Application is interative (accepts and responds to user input)

### Concept - 10% <!-- omit in toc -->
- [x] Application should be a unique and novel idea
- [ ] Your group should clearly and concisely articulate your project idea

### Deployment - 20% <!-- omit in toc -->
- [x] Application deployed at live URL and loads with no errors
- [x] Application GitHub URL submitted
- [ ] Portfolio at live URL submitted, featuring project

### Repository Quality <!-- omit in toc -->
- [x] Repository has a unique name
- [x] Repository follow best practices for file structure and naming conventions
- [x] Repository follow best practices for class/id naming conventions, indentation, quality comments, etc.
- [x] Repository contains multiple descriptive commit messages
- [x] Repository contains a quality README file with description, screenshot, and link to deployed application
  
### Application Quality - 15% <!-- omit in toc -->
- [ ] Application user experience is intuitive and easy to navigate
- [ ] Application user interface style is clean and polished
- [ ] Application is responsive

### Presentation - 10% <!-- omit in toc -->
- [ ] Presentation uses Powerpoint or similar presentation software
- [ ] Every group member should speak during the presentation
- [ ] Presentation follows Project Presentation Template

### Collaboration - 10% <!-- omit in toc -->
- [ ] There are no major disparities in the number of GitHub contributions between group members


## TO DO
-   presentation
-   styling
-   readme
-   alert for no search results found
## EXTRA
-   carousel for images in modal
-   include territories in search options
-   add topics search option
-   show sunrise/sunset times in park modal
-   show things-to-do and activities in park modal
-   add badge system when park is visited
-   add pagination so can return more than 100 items on search (can remove state error that way too)
-   revise search to be more modular (searching multiple states at once)