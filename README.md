ShootManager
============

ShootManager is a web-based interface for a database project for the Spring 2013 Database Systems class at
Villanova University.

Features
--------

Current Functionality:
- View a complete list of photographers
- View all photo shoots associated with the photographer
- Add a new photoshoot, associating with it any equipment used at that shoot.

Architecture
------------

The site utilizes Spring MVC to display views.  The ApplicationController handles routing.  This will be utilized
for the inital page laod (/) as well as subsequent AJAX requests (/getShoots, /addShoot).  Each object in the
database has a corresponding model.  All models extend from the base Model class:

src/main/java/com/braintrust/models
- Model --> Photographer
- Model --> Shoot
- Model --> Equipment
- Model --> Location
- Model --> Category

Subclasses in the database structure inherit from the parent module:
- Equipment --> PhotoEquipment
- Equipment --> MiscEquipment

In this way, the heirarchy of the database structure is mirrored at the server level.  The model classes consist of
getters and setters that allow us to easily instantiate new objects with the values from the database. All models
also have properties to reference the ids of related objects.  When being sent as a response to an AJAX request,
objects are converted to JSON strings using the Google Gson library.

___________

Manager classes utilize the Oracle JDBC driver to submit queries to the database.  

src/main/java/com/braintrust/managers
- PhotographerManager
- ShootManager

These classes will either make simple queries against the database, or make calls to functions that are stored
on the Villanova Unix server.

Database Programming
------------

Functions

The following database functions have been added to support the addition of a new photographer and a new photoshoot:

- fn_addphotographer
- fn_addequipmentused
- fn_addsubjectfound
- fn_addshoot

Sequences

Two sequences were added to support the additions of a photoshoot. These two tables have incremental 
ids that are stored within their database tables. 

- sq_photographer
- sq_photoshoot

Reports

In addition, two reports (that are currently usable outside of the java application) are as follows: 

- BT_EU.sql (Equipment Use Report) - Report will list all of the equipment that has been used, how many times, 
and date of last use by a particular photographer. 
- BT_LU.sql (Location Use Summary Report) - Report will list each location, how many photographer have shot at that location, 
total number of shoots per location, and the last shoot date


___________

![ShootManager Screen 1](/src/main/webapp/WEB-INF/resources/images/sm-grab-1.jpg "Photographer List View")

The user interface is rendered using jsp templates:

src/main/webapp/WEB-INF/jsp
- shootList.jsp

A list of photographers is passed to the view, making this data available on page load.  Additional content is loaded
asynchronously.

![ShootManager Screen 2](/src/main/webapp/WEB-INF/resources/images/sm-grab-2.jpg "Shoot List List View")

The following JavaScript libraries are leveraged to build the user interface:
src/main/webapp/WEB-INF/resources/javascripts
- xooie.0.0.7.js - Xooie: a UI widget library that is used to build non-native functionality.
- require.js - RequireJS is used to asyncronously load modules and maintain a loosely coupled system.  It is also a dependency for Xooie.
- jquery.js - Jquery provides numerous functions.  In particular it provides helper methods for AJAX requests.
- underscore.js - Underscore provides some utility methods, but also provides a template framework for loading content asynchronously.

- photographer.js - A module built on Xooie that provides the functionality to the list of photographers
- shoots.js - A module that handles rendering functionality for the shoots list.
- add_shoot.js - A Xooie addon module that provides functionality for submitting new photo shoot data via AJAX.

![ShootManager Screen 3](/src/main/webapp/WEB-INF/resources/images/sm-grab-3.jpg "Add Shoot View")

The add_shoot form consists currently of a data-type input for the date value, a dropdown select to chose a location,
an input for weather description and a list of checkboxes to select equipment used for the shoot.  Subject data is 
still pending.

All CSS is stored in src/main/webapp/WEB-INF/resources/stylesheets/shootList.css.  Ideally these styles should be
organized into separate stylesheets.  They are, however, organized by component on the page.  Many CSS3 properties
are leveraged, including transitions, box-shadows and border-radius.
