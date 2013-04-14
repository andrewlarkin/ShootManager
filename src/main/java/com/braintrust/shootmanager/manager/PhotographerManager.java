package com.braintrust.shootmanager.manager;

import java.sql.*;
import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;

import com.braintrust.shootmanager.model.Location;
import com.braintrust.shootmanager.model.Photographer;
import com.braintrust.shootmanager.model.Shoot;

public class PhotographerManager {
	
	//private static Photographer photographer;
	
	/*static {
		//This code is for testing purposes only and will be replaced by the query class
		photographer = new Photographer(1);
		
		photographer.setName("Andrew Larkin");
		photographer.setRetired(false);
		
		//Lets create some fake locations
		Location capeCod = new Location(0);
		Location yosemite = new Location(1);
		Location mountWashington = new Location(2);
		
		capeCod.setName("Cape Cod National Seashore");
		capeCod.setCity("Hyannis");
		capeCod.setState("MA");
		capeCod.setRetired(false);
		
		yosemite.setName("Yosemite National Park");
		yosemite.setCity("Mariposa");
		yosemite.setState("CA");
		yosemite.setRetired(false);
		
		mountWashington.setName("Mount Washington");
		mountWashington.setCity("Sargent's Purchase");
		mountWashington.setState("NH");
		mountWashington.setRetired(false);
		
		List<Shoot> shoots = new ArrayList<Shoot>();
		
		Shoot shoot1 = new Shoot(0);
		shoot1.setDate(new Date(13501872 * 100000));
		shoot1.setLocation(capeCod);
		shoot1.setWeatherDesc("Sunny but chilly");
		shoots.add(shoot1);
		
		Shoot shoot2 = new Shoot(1);
		shoot2.setDate(new Date(13401648 * 100000));
		shoot2.setLocation(mountWashington);
		shoot2.setWeatherDesc("A beautiful day!");
		shoots.add(shoot2);
		
		Shoot shoot3 = new Shoot(2);
		shoot3.setDate(new Date(13230612 * 100000));
		shoot3.setLocation(yosemite);
		shoot3.setWeatherDesc("Cold, but clear");
		shoots.add(shoot3);
		
		photographer.addShoot(shoots);
		//end test code
	}*/
	
	public static Photographer getPhotographer(int photographerId, String login, String password)  throws SQLException{
		Photographer photographer;
	
		try {

			//Load the Oracle JDBC driver
			Class.forName("oracle.jdbc.driver.OracleDriver");

			//Connect to the database
			Connection conn = DriverManager.getConnection("jdbc:oracle:thin:@csdb.csc.villanova.edu" + ":1521:csdb", login, password);
  
			String query = "select pid, pname, pRetired " +
						   " from    ddevos.photographer " + 
						   " where pid = " + photographerId;         

			PreparedStatement ps = conn.prepareStatement(query);

			ResultSet rset = ps.executeQuery();


			//Action on the result
			while (rset.next ())
			{
				photographer = new Photographer (rset.getInt("pid"));
	  			photographer.setName(rset.getString("pname"));
	  			photographer.setRetired(rset.getString("pretired"));
	  			
	  			return photographer;
			}
			rset.close();
			return null;
		} catch (ClassNotFoundException e){
			System.out.println("couldn't load database driver");           
		}
		return null;
	}
	
	public static List<Photographer> getPhotographers(String login, String password) throws SQLException{
		List<Photographer> photographers;
		
		try {

			//Load the Oracle JDBC driver
			Class.forName("oracle.jdbc.driver.OracleDriver");

			//Connect to the database
			Connection conn = DriverManager.getConnection("jdbc:oracle:thin:@csdb.csc.villanova.edu" + ":1521:csdb", login, password);
  
			String query = "select pid, pname, pRetired " +
						   " from    ddevos.photographer ";

			PreparedStatement ps = conn.prepareStatement(query);

			ResultSet rset = ps.executeQuery();
			
			photographers = new ArrayList<Photographer>();
			
			//Action on the result
			while (rset.next ())
			{
				Photographer photographer = new Photographer (rset.getInt("pid"));
	  			photographer.setName(rset.getString("pname"));
	  			photographer.setRetired(rset.getString("pretired"));
	  			
	  			photographers.add(photographer);
			}
			rset.close();
			return photographers;
		} catch (ClassNotFoundException e){
			System.out.println("couldn't load database driver");           
		}
		return null;
	}
}
