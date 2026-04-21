package com.infosys.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

@Bean
public SecurityFilterChain filterChain(
HttpSecurity http,
JwtFilter jwtFilter
) throws Exception {

http
.cors(cors->{})   // ENABLE CORS

.csrf(csrf->csrf.disable())

.sessionManagement(session ->
session.sessionCreationPolicy(
SessionCreationPolicy.STATELESS
))

.authorizeHttpRequests(auth->auth

.requestMatchers(
"/api/auth/register",
"/api/auth/login"
).permitAll()

.anyRequest().authenticated()

)

.addFilterBefore(
jwtFilter,
UsernamePasswordAuthenticationFilter.class
);

return http.build();

}


@Bean
public CorsConfigurationSource corsConfigurationSource(){

CorsConfiguration config=
new CorsConfiguration();

config.setAllowedOrigins(
List.of("http://localhost:5173")
);

config.setAllowedMethods(
List.of("GET","POST","PUT","DELETE","OPTIONS")
);

config.setAllowedHeaders(
List.of("*")
);

UrlBasedCorsConfigurationSource source=
new UrlBasedCorsConfigurationSource();

source.registerCorsConfiguration(
"/**",
config
);

return source;
}

}