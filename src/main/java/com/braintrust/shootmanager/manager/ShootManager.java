package com.braintrust.shootmanager.manager;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.braintrust.shootmanager.model.Location;
import com.braintrust.shootmanager.model.Shoot;

public class ShootManager {
	private static String jdbcDriver = "oracle.jdbc.driver.OracleDriver";
	private static String connectionURI = "jdbc:oracle:thin:@csdb.csc.villanova.edu:1521:csdb";
	
	public static Shoot getShoot(int shootId, String login, String password)  throws SQLException{
		Shoot shoot;
	
		try {

			//Load the Oracle JDBC driver
			Class.forName(jdbcDriver);

			//Connect to the database
			Connection conn = DriverManager.getConnection(connectionURI, login, password);
  
			String query = "select shootid, shootdate, weather, locid " +
						   " from    ddevos.photoshoot " + 
						   " where shootid = " + shootId;         

			PreparedStatement ps = conn.prepareStatement(query);

			ResultSet rset = ps.executeQuery();


			//Action on the result
			while (rset.next ())
			{
				shoot = new Shoot (rset.getInt("shootid"));
				shoot.setDate(rset.getDate("shootdate"));
	  			shoot.setWeatherDesc(rset.getString("weather"));
	  			
	  			return shoot;
			}
			rset.close();
			return null;
		} catch (ClassNotFoundException e){
			System.out.println("couldn't load database driver");           
		}
		return null;
	}
	
	public static List<Shoot> getShoots(int photographerId, String login, String password) throws SQLException {
		List<Shoot> shoots = new ArrayList<Shoot>();
		
		try {
			Class.forName(jdbcDriver);
			
			Connection conn = DriverManager.getConnection(connectionURI, login, password);
			
			String query = "select shootid, shootdate, weather, l.locid, locname, city, state" + 
						   " from ddevos.photoshoot s, ddevos.location l " +
						   " where pid = " + photographerId + 
						   " and s.locid = l.locid";
			
			PreparedStatement ps = conn.prepareStatement(query);
			
			ResultSet rset = ps.executeQuery();
			
			while (rset.next()){
				Location location = new Location(rset.getInt("locid"));
				location.setName(rset.getString("locname"));
				location.setCity(rset.getString("city"));
				location.setState(rset.getString("state"));
				
				Shoot shoot = new Shoot(rset.getInt("shootid"));
				shoot.setDate(rset.getDate("shootdate"));
	  			shoot.setWeatherDesc(rset.getString("weather"));
	  			shoot.setLocation(location);
	  			
	  			shoots.add(shoot);
			}
			rset.close();
		} catch (ClassNotFoundException e){
			System.out.println("could not load database driver");
		}
		
		return shoots;
	}
	
	
	public static void addShoot(Shoot shoot, String login, String password) throws SQLException {
		
		int ResultCount;
		
		try {
			
			Class.forName(jdbcDriver);
			
			Connection conn = DriverManager.getConnection(connectionURI, login, password);
			
			conn.setAutoCommit(false);
			
			CallableStatement cs = conn.prepareCall("{? = call DDEVOS.fn_addShoot(?,?,?,?)}");
			cs.registerOutParameter(1, Types.NUMERIC);
			cs.setDate(2, shoot.getDate());
			cs.setString(3, shoot.getWeatherDesc());
			cs.setInt(4, shoot.getPhotographerId());
			cs.setInt(5, shoot.getLocationId());
			cs.executeUpdate();
			
			shoot.setId(cs.getInt(1));
			
			for (int equipmentId : shoot.getEquipmentIds()) {
				cs = conn.prepareCall ("{? = call DDEVOS.fn_addEquipmentUsed(?,?)}");
				cs.registerOutParameter(1, Types.NUMERIC);
				cs.setInt(2, equipmentId);
				cs.setInt(3, shoot.getId());
				cs.executeUpdate();
				ResultCount = cs.getInt(1);
			}
			
			/*
			for (int subjectId : shoot.getSubjectIds()) {
				cs = conn.prepareCall ("{? = call DDEVOS.fn_addEquipmentUsed(?,?,?,?)}");
				cs.registerOutParameter(1, Types.NUMERIC);
				cs.setString(2, subject.getGenus());
				cs.setString(3, subject.getSpecies());
				cs.setInt(4, subject.locid);
				cs.setString(5, subject.getfndNotes());
				cs.executeUpdate();
				ResultCount = cs.getInt(1);
			}*/
			
			conn.commit();
			conn.setAutoCommit(true);
			
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
