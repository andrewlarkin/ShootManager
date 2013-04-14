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
   
    <div data-widget-type="dialog" class="add-shoot-modal">
      <button data-role="closeButton" class="button close"></button>
      <div data-role="container">
        
      </div>
    </div>
  </section>
  
  
  
</body>
</html>