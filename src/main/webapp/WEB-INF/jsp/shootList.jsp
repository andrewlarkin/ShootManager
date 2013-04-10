<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>ShootManager</title>
</head>
<body>
  <div>${photographer.name}</div>
  <ol>
    <c:forEach items="${photographer.shoots}" var="shoot">
      <li>${shoot.location.name} - ${shoot.date}</li>
    </c:forEach>
  </ol>
</body>
</html>