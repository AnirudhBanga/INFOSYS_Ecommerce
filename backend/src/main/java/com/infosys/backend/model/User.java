package com.infosys.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="users")
public class User{

@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private Long id;

@NotBlank(message="Name required")
private String name;

@Email(message="Invalid email")
@NotBlank(message="Email required")
@Column(unique=true,nullable=false)
private String email;

@Size(min=6,message="Password must be 6+ chars")
@com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
private String password;

private String gender;

private int age;

@Column(name="phone_no")
private String phoneNo;

@Column(nullable=false)
private String role="USER";

private String address;
private String dob;
private String preferences;

public Long getId(){ return id; }

public String getName(){ return name; }
public void setName(String name){
this.name=name;
}

public String getEmail(){ return email; }
public void setEmail(String email){
this.email=email;
}

public String getPassword(){ return password; }
public void setPassword(String password){
this.password=password;
}

public String getGender(){ return gender; }
public void setGender(String gender){
this.gender=gender;
}

public int getAge(){ return age; }
public void setAge(int age){
this.age=age;
}

public String getPhoneNo(){
return phoneNo;
}
public void setPhoneNo(String phoneNo){
this.phoneNo=phoneNo;
}

public String getRole(){
return role;
}

public void setRole(String role){
this.role=role;
}

public String getAddress() { return address; }
public void setAddress(String address) { this.address = address; }

public String getDob() { return dob; }
public void setDob(String dob) { this.dob = dob; }

public String getPreferences() { return preferences; }
public void setPreferences(String preferences) { this.preferences = preferences; }

}