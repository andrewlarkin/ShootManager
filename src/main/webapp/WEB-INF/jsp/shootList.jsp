<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <meta http-equiv="Cache-Control" content="no-store" />
  <title>ShootManager</title>
  
  <script src="resources/javascripts/require-config.js"></script>
  <script src="resources/javascripts/require.js"></script>
  <script src="resources/javascripts/jquery.js"></script>
  <script src="resources/javascripts/underscore.js"></script>
  <script src="resources/javascripts/underscore_amd.js"></script>
  <script src="resources/javascripts/xooie-config.js"></script>
  <script src="resources/javascripts/xooie-0.0.7.js"></script>
  
  <link rel="stylesheet" type="text/css" href="resources/stylesheets/shootList.css" />
</head>
<body>

	<header class="heading">
    <div class="heading-title">Shoot Manager<span class="heading-subtitle">Manage Your Photo Shoots.</span></div>
	</header>
	
	<section class="content">
		<form id="photographer_form" class="photographers" data-widget-type="photographers">
		  <h2 class="photographer-heading">Photographers</h2>
			<fieldset>
			  <ol class="photographer-list">
          <c:forEach items="${photographers}" var="photographer">
            <li class="photographer-list-item ${photographer.retired}"><a href="#" role="button" type="button" class="button list-button" data-role="photographer-button" data-photographer-id="${photographer.id}" >${photographer.name}</a></li>
          </c:forEach>
			  </ol>
		    <select style="display: none;">
		      <c:forEach items="${photographers}" var="photographer">
		        <option value="${photographer.id}">${photographer.name}</option>
		      </c:forEach>
		    </select>
	    </fieldset>
	  </form>
  
    <div id="shoots" class="shoots" data-widget-type="shoots">
      <h2 class="shoots-heading">Photo Shoots</h2>
      <ol class="shoot-list" data-role="listContainer"></ol>
      <button class="button add" data-role="addShoot">Add Shoot</button>
    </div>
   
    <div data-widget-type="dialog" class="add-shoot-modal" data-addons="add_shoot">
      <div data-role="container" class="add-shoot-container">
        <h2 class="add-shoot-heading">Add A Photo Shoot</h2>
        <form data-role="form">
          <fieldset>
            <label>Date</label>
            <input class="add-shoot-input" type="date" name="date" required></input>
            <label>Location</label>
            <select name="location" class="add-shoot-select" data-role="locationSelect"  required>
              <option value="1">Pennypack Park</option>
              <option value="2">Penn Treaty Park</option>
              <option value="3">Franklin Delano Roosevelt Park</option>
              <option value="4">Jenkins Arboretum</option>
              <option value="5">Skunk Hollow Park</option>
              <option value="6">Valley Forge</option>
              <option value="7">Philaelphia Memorial Park</option>
              <option value="8">Paoli Battlefield Historical Park</option>
              <option value="9">Sutcliff Park</option>
              <option value="10">Spring Mill County Park</option>
            </select>
            <label>Weather</label>
            <input class="add-shoot-input" name="weather"  required></input>
           </fieldset>
           <fieldset>
            <legend>Equipment</legend>
            <ol>
              <li><label>AF-S NIKKOR 85mm</label><input type="checkbox" name="equipment" value="1"/></li>
	            <li><label>AF-S Nikkor 24-70mm</label><input type="checkbox" name="equipment" value="2"/></li>
	            <li><label>Canon EF 70-200mm</label><input type="checkbox" name="equipment" value="3"/></li>
            </ol>
          </fieldset>
          <button data-role="closeButton" class="button">Cancel</button>
          <button data-role="submitButton" type="submit" class="button">Submit</button>
        </form>
      </div>
    </div>
  </section>
  
  
  
</body>
</html>